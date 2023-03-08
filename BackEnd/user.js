import mysql from 'mysql2';
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import joi from 'joi'
import nodemailer from 'nodemailer'

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
    // save it, but I like to anyway
    const result = await pool.query(`
    INSERT INTO Users (email, password, salt)
    VALUES (?, ?, ?)`, [props.email, hashed_password, salt]);

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
        to: props.email,
        subject: 'Registration: Confirm Email',
        text: email_plain,
        html: email_html
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        } else {
        console.log('Email sent: ' + info.response);
        }
    });

    return result[0].insertId;
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

 export async function login_user(email, password){ 

    // get the user based on their email
    const sql = (`SELECT id, email, password FROM Users WHERE email=?`, [email])
    const [rows] = await pool.query(sql);
    const record = rows[0];

  
    // use bcrypt to hash the password and compared it to our stored hash
    return await bcrypt.compare(user.password, record.password);
    
  }



/*
TABLE SCHEMA

MySQL
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    email_confirmed DATETIME,
    last_login DATETIME,
    n_logins INT,
    created DATETIME DEFAULT CURRENT_TIMESTAMP
)  



*/