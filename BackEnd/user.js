import mysql from 'mysql2';
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import joi from 'joi'
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'

dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()


export async function create_user(props) {
    // VALIDATE INPUT
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(8).max(128).required(),
        confirm_password: joi.ref('password')
      });

    const { error, value } = schema.validate(props); 
    if (error) {
      console.log(error);
      return ("Vaidation Error (" + error.details[0].message) + ")";
    }

    // ENSURE EMAIL ISN'T ALREADY IN THE DATABASE
    if (await email_exists(props.email) == true)
    {
        return ("Vaidation Error (EMAIL ALREADY EXISTS)");
    }

    const salt = await bcrypt.genSalt(12);
    const hashed_password = await bcrypt.hash(props.password, salt);

    // salt is already in the hashed password so don't really need to
    // save it, but I like to anyway.  Will use it as a token to confirm the email for now.
    const result = await pool.query(`
    INSERT INTO Users (email, password, salt, roles)
    VALUES (?, ?, ?, '1001')`, [props.email, hashed_password, salt]);

    send_request_email_confirmation(props.email);

    return result[0].insertId;
 }

export async function send_request_email_confirmation(email)
{
    // THIS GETS CALLED AFTER THE USER REGISTERS
    // AND IF THE USER REQUESTS IT TO BE SENT AGAIN 
    // Returns { 'success': true/false , 'message': '' }
    // TODO: 
    // LOG THAT THE EMAIL WAS SENT.
    // LIMIT THE NUMBER OF TIMES IT CAN BE SENT.
    // STOP USING THE SALT AS A TOKEN FOR THIS AND ADD A NEW FIELD FOR THIS PURPOSE.


    let success = false;
    let message = "";

    // GET THE SALT WHICH WE'LL USE AS A TOKEN
    const [rows] = await pool.query(`
        SELECT salt, email_confirmed FROM Users
        WHERE email=?`, [email]);
    
    let salt = "";
    let email_confirmed = "";

    //console.log(rows);
    if (rows.length > 0)
    {
        let record = rows[0];
        salt = record.salt;
        email_confirmed = record.email_confirmed;
        if (email_confirmed !== null)
        {
            success = true; // it was already confirmed.
            message = "Email address confirmed.";
            return { "success": success, "messsage": message };
        }
    }
    else
    {
        message = "No user registration found for this email address.";
        return { "success": success, "messsage": message };
    }

    // SEND CONFIRMATION EMAIL
    var transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD 
        }
    });

    const encodedSalt = encodeURIComponent(salt);


    // just let them use the salt as the id, should probably change this to some other random text
    let email_html = `Please click the link below to confirm your email.<br />
    <br /><a href='${process.env.APP_FULL_DOMAIN}/confirm/?id=${encodedSalt}'>confirm email</a>`;
    let email_plain = `Please click the link below to confirm your email./n
    /n<${process.env.APP_FULL_DOMAIN}/confirm/?id=${encodedSalt}`;

    var mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Registration: Confirm Email',
        text: email_plain,
        html: email_html
    };

    console.log("Attempt to send email.");
    try {
        let mail_response = await transporter.sendMail(mailOptions);
        console.log(mail_response.messageId);
        if (mail_response.messageId != undefined)
        {
            console.log('Email sent: ' + mail_response.response);
            success = true;
            message = "Request confirmation email sent.";
        }
        else
        {
            message = "Error.  Problem sending email.";
        }        
    }
    catch (error)
    {
            message = "Error.  Problem sending email.";
    }


    return { "success": success, "messsage": message };
}

 export async function email_exists(email){ 

    // get the user based on their email
    const rows = await pool.query("SELECT id FROM Users WHERE email=?", [email]);
    //console.log(rows);
    let result = true
    if (rows[0].length < 1) {
        result = false
        console.log(rows[0].length);
    }
    console.log(result)
    return result
  }

  export async function confirm_email(key){

    await pool.query(`UPDATE Users 
    SET email_confirmed=CURRENT_TIMESTAMP WHERE salt=? AND email_confirmed IS NULL`, [key]);

    const rows = await pool.query("SELECT id FROM Users WHERE salt=?", [key]);

    let result = "Error";
    if (rows[0].length > 0)
    {
        result = "Email confirmed.  Thank you!";
    }
    return result
  }

 export async function login_user(props){ 

    const [rows] = await pool.query(`
    SELECT id, email, password, roles, email_confirmed 
    FROM Users WHERE email=?`, [props.email]);
    const record = rows[0];
  
    console.log(rows.length);
    // use bcrypt to hash the password and compared it to our stored hash
    let db_password = "";
    if (rows.length > 0)
    {
        db_password = record.password;
    }
    let success = false;
    if (props.password != "" && db_password != "")
    {
        success = await bcrypt.compare(props.password, db_password);
    }
    let access_token = "";
    let refresh_token = "";
    let user_roles = undefined;
    let email_confirmed = false;
    if (success) {        
        if (record.email_confirmed !== null)
        {
            email_confirmed = true;
            user_roles = record.roles.split(',').map(Number); // convert roles string to integer array, e.g. '1001, 2001' -> [1001, 2001] 
            // generate token
            access_token = generate_access_token(record.id, user_roles);
            refresh_token = generate_refresh_token(record.id, user_roles);
        }
    }

    const result = { success: success, 
        access_token: access_token, 
        refresh_token: refresh_token, 
        roles: user_roles,
        email_confirmed: email_confirmed
    }
    //console.log(JSON.stringify(result));
    return result
  }


function generate_access_token(user_id, roles) {
    return jwt.sign({ user_id: user_id, roles: roles }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
}

function generate_refresh_token(user_id, roles) {
    const refresh_token = jwt.sign({ user_id: user_id, roles: roles }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
    //console.log(refresh_token);
    pool.query(`UPDATE Users SET refresh_token=? WHERE id=?`, [refresh_token, user_id]);
    return refresh_token;
}

export async function getUsers() {
    const [rows] = await pool.query("SELECT id, email, last_login, n_logins, created, email_confirmed, roles FROM Users");
    //console.log(rows);//
    return rows; 
}  

async function test() {
    let user_email = "erikthompson@yandex.com";
    console.log(await send_request_email_confirmation(user_email));
    process.exit();
}

test();


/*
TABLE SCHEMA

MySQL
Roles is either '1001' or '1001,2001' // 1001=User, 2001=Admin
I'm not going to bother with creating another table for this.

IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255),
    email_confirmed DATETIME,
    last_login DATETIME,
    n_logins INT,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    roles VARCHAR(30)
)  



*/