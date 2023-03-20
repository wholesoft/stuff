import mysql from 'mysql2';
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import joi from 'joi'
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import cryptoRandomString from 'crypto-random-string'

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
    const email_confirm_token = cryptoRandomString({length: 30, type: 'alphanumeric'});

    // salt is already in the hashed password so don't really need to save it, but I like to anyway.  
    const result = await pool.query(`
    INSERT INTO Users (email, password, salt, roles, email_confirm_token, email_token_created, created)
    VALUES (?, ?, ?, '1001', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`, [props.email, hashed_password, salt, email_confirm_token]);

    send_email_confirmation_request(props.email);

    return result[0].insertId;
 }

 export async function update_password(props)
 {
    // THIS GETS CALLED WHEN A USER REQUESTS TO 
    // UPDATE THEIR EMAIL ADDRESS
    // Returns { 'success': true/false , 'message': '' }
    let success = false;
    let message = "";
    let validation_okay = true;

    // VALIDATE INPUT
    const schema = joi.object({
        user_id: joi.number().integer().required(),
        password: joi.string().min(8).max(128).required(),
        confirm_password: joi.ref('password')
      });

    const { error, value } = schema.validate(props); 
    if (error) {
      console.log(error);
      console.log("Validation Error.");
      message = "Vaidation Error (" + error.details[0].message + ")";
      validation_okay = false;
    }

    const salt = await bcrypt.genSalt(12);
    const hashed_password = await bcrypt.hash(props.password, salt);

    // UPDATE THE USER'S PASSWORD
    if (validation_okay) {
        const result = await pool.query(`
        UPDATE Users SET password=?, salt=? WHERE id=?`, [hashed_password, salt, props.user_id]); 
        console.log(result);
        success = true;
        message = `Password Updated.`;
    }

    return { "success": success, "message": message };
 }


 export async function update_email_address(props)
 {
    // THIS GETS CALLED WHEN A USER REQUESTS TO 
    // UPDATE THEIR EMAIL ADDRESS
    // Returns { 'success': true/false , 'message': '' }
    let success = false;
    let message = "";
    let validation_okay = true;

    // VALIDATE INPUT
    const schema = joi.object({
        user_id: joi.number().integer().required(),
        email: joi.string().email().required(),
      });

    const { error, value } = schema.validate(props); 
    if (error) {
      console.log(error);
      console.log("Validation Error.");
      message = "Vaidation Error (" + error.details[0].message + ")";
      validation_okay = false;
    }

    // ENSURE EMAIL ISN'T ALREADY IN THE DATABASE
    if (await email_exists(props.email) == true && validation_okay) {
        message = "Vaidation Error (EMAIL ALREADY EXISTS)";
        validation_okay = false;
    }

    const email_confirm_token = cryptoRandomString({length: 30, type: 'alphanumeric'});

    // UPDATE THE USER'S EMAIL
    if (validation_okay) {
        const result = await pool.query(`
        UPDATE Users SET email=?, email_confirmed=NULL, email_confirm_token=?, email_token_created=CURRENT_TIMESTAMP
        WHERE id=?`, [props.email, email_confirm_token, props.user_id]); 
        console.log(result);
        success = true;
        message = `Email Updated (${props.email}).`;
        send_email_confirmation_request(props.email);
    }
    
    return { "success": success, "message": message };
 }

export async function reset_password(email) {
    // CALLED IF A USER REQUESTS TO RESET THEIR PASSWORD
    // Returns { 'success': true/false , 'message': '' }
    // TODO:
    // VALIDATE THAT WE'RE GETTING AN EMAIL ADDRESS
    // LOG THAT THE EMAIL WAS SENT.
    // LIMIT THE NUMBER OF TIMES IT CAN BE SENT.

    let success = false;
    let message = "";


    // CREATE A RESET TOKEN
    let password_reset_token = cryptoRandomString({length: 30, type: 'alphanumeric'});

    // SAVE TOKEN TO THE DB
    const [rows] = await pool.query(`
        UPDATE USERS SET password_reset_token=?, password_token_created=CURRENT_TIMESTAMP
        WHERE email=?`, [email]);
    
    // SEND PASSWORD RESET EMAIL
    var transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD 
        }
    });

    const encodedToken = encodeURIComponent(password_reset_token); // not really needed


    // just let them use the salt as the id, should probably change this to some other random text
    let email_html = `Please click the link below to reset your password.<br />
    <br /><a href='${process.env.APP_FULL_DOMAIN}/reset/?id=${encodedToken}'>confirm email</a>`;
    let email_plain = `Please click the link below to confirm your email./n
    /n<${process.env.APP_FULL_DOMAIN}/reset/?id=${encodedToken}`;

    var mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Reset Password Request',
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
            message = "Reset password email sent.";
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

    return { "success": success, "message": message };
}

export async function send_email_confirmation_request(email)
{
    // THIS GETS CALLED AFTER THE USER REGISTERS
    // AND IF THE USER REQUESTS IT TO BE SENT AGAIN 
    // Returns { 'success': true/false , 'message': '' }
    // TODO: 
    // LOG THAT THE EMAIL WAS SENT.
    // LIMIT THE NUMBER OF TIMES IT CAN BE SENT.

    let success = false;
    let message = "";

    // GET THE SALT WHICH WE'LL USE AS A TOKEN
    const [rows] = await pool.query(`
        SELECT email_confirm_token, email_confirmed FROM Users
        WHERE email=?`, [email]);
    
    let email_confirm_token = "";
    let email_confirmed = "";

    //console.log(rows);
    if (rows.length > 0)
    {
        let record = rows[0];
        email_confirm_token = record.email_confirm_token;
        email_confirmed = record.email_confirmed;
        if (email_confirmed !== null)
        {
            success = true; // it was already confirmed.
            message = "Email address confirmed.";
            return { "success": success, "message": message };
        }
    }
    else
    {
        message = "No user registration found for this email address.";
        return { "success": success, "message": message };
    }

    // SEND CONFIRMATION EMAIL
    var transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD 
        }
    });

    const encodedToken = encodeURIComponent(email_confirm_token); // not really needed


    // just let them use the salt as the id, should probably change this to some other random text
    let email_html = `Please click the link below to confirm your email.<br />
    <br /><a href='${process.env.APP_FULL_DOMAIN}/confirm/?id=${encodedToken}'>confirm email</a>`;
    let email_plain = `Please click the link below to confirm your email./n
    /n<${process.env.APP_FULL_DOMAIN}/confirm/?id=${encodedToken}`;

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


    return { "success": success, "message": message };
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
    SET email_confirmed=CURRENT_TIMESTAMP WHERE email_confirm_token=? AND email_confirmed IS NULL`, [key]);

    const rows = await pool.query("SELECT id FROM Users WHERE email_confirm_token=?", [key]);

    let result = "Error";
    if (rows[0].length > 0)
    {
        result = "Email confirmed.  Thank you!";
    }
    return result
  }

 export async function login_user(props){ 

    const [rows] = await pool.query(`
    SELECT id, email, password, roles, email_confirmed, n_logins 
    FROM Users WHERE email=?`, [props.email]);
    const record = rows[0];
  
    console.log(rows.length);
    // use bcrypt to hash the password and compared it to our stored hash
    let db_password = "";
    let user_id = 0;
    let n_logins = 0;
    if (rows.length > 0)
    {
        db_password = record.password;
        user_id = record.id;
        n_logins = record.n_logins;
    }
    let success = false;
    if (props.password != "" && db_password != "")
    {
        success = await bcrypt.compare(props.password, db_password);
        if (success)
        {
            // UPDATE n_logins and last_login
            await pool.query(`UPDATE Users SET n_logins=?, last_login=CURRENT_TIMESTAMP WHERE id=?`, [n_logins+1, user_id]);
        }
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

export async function getUser(user_id) {
    const [rows] = await pool.query(`SELECT id, email, last_login, n_logins, created, email_confirmed, roles 
    FROM Users WHERE id=?`, [user_id]);
    console.log(user_id + " : " + rows);
    return rows[0]; 
}  

async function test() {
    let user_email = "";
    console.log(await send_email_confirmation_request(user_email));
    process.exit();
}

//test();


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
    roles VARCHAR(30),
    password_reset_token VARCHAR(30),
    password_token_created DATETIME,
    email_token_created DATETIME,
    email_confirm_token VARCHAR(30)
)  



*/