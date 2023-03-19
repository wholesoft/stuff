
import mysql from 'mysql2';
import dotenv from 'dotenv'
import joi from 'joi'

dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function addStuffGroup(props)
{
   // Returns { 'success': true/false , 'message': '' }
   let success = false;
   let message = "";
   let validation_okay = true;

   // VALIDATE INPUT
   const schema = joi.object({
       user_id: joi.number().integer().required(),
       group: joi.string().required(),
       notes: joi.string()
     });

   const { error, value } = schema.validate(props); 
   if (error) {
     console.log(error);
     console.log("Validation Error.");
     message = "Vaidation Error (" + error.details[0].message + ")";
     validation_okay = false;
     return { 'success': false, 'message': message }
   }

   // Add the Group
   if (validation_okay) {
       const result = await pool.query(`
       INSERT INTO Stuff_Group (user_id, group_name, notes, created, updated) VALUES (?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
       `, [props.user_id, props.group, props.notes]); 
       console.log(result);
       success = true;
       message = `Group Added (${props.email}).`;
   }

   return { "success": success, "message": message };
}

export async function getStuffGroups(props) {
    // Returns { 'success': true/false , 'message': '', 'data': [] }
   let success = false;
   let message = "";
   let validation_okay = true;

   // VALIDATE INPUT
   const schema = joi.object({
       user_id: joi.number().integer().required(),
     });

   const { error, value } = schema.validate(props); 
   if (error) {
     console.log(error);
     console.log("Validation Error.");
     message = "Vaidation Error (" + error.details[0].message + ")";
     validation_okay = false;
     return { 'success': false, 'message': message, 'data': [] }
   }
    const [rows] = await pool.query(`
    SELECT id, group_name, notes, created, updated FROM StuffGroups WHERE user_id=?
    `, [props.user_id]);

    return { 'success': true, 'message': 'OK', 'data': rows }
}  

export async function addStuffItem(props)
{
   // Returns { 'success': true/false , 'message': '' }
   let success = false;
   let message = "";
   let validation_okay = true;

   // VALIDATE INPUT
   const schema = joi.object({
       user_id: joi.number().integer().required(),
       group_id: joi.number().integer().required(),
       item_name: joi.string().required(),
       purchase_location: joi.string(),
       purchase_date: joi.date(),
       amount_paid: joi.number(),
       notes: joi.string()
     });

   const { error, value } = schema.validate(props); 
   if (error) {
     console.log(error);
     console.log("Validation Error.");
     message = "Vaidation Error (" + error.details[0].message + ")";
     validation_okay = false;
     return { 'success': false, 'message': message }
   }

   // Add the Stuff Item
   if (validation_okay) {
       const result = await pool.query(`
       INSERT INTO Stuff (user_id, group_id, item_name, notes, purcahsed_location, date_purchased, amount_paid, created, updated) 
       VALUES (?,?,?,?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
       `, [props.user_id, props.group_id, props.item_name, props.purchase_location, props.purchase_date, amount_paid, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP]); 
       console.log(result);
       success = true;
       message = `Item Added (${props.email}).`;
   }

   return { "success": success, "message": message };
}

export async function getStuff(props) {
    // Returns { 'success': true/false , 'message': '', 'data': [] }
   let success = false;
   let message = "";
   let validation_okay = true;

   // VALIDATE INPUT
   const schema = joi.object({
       user_id: joi.number().integer().required(),
       group_id: joi.number().integer().required()
     });

   const { error, value } = schema.validate(props); 
   if (error) {
     console.log(error);
     console.log("Validation Error.");
     message = "Vaidation Error (" + error.details[0].message + ")";
     validation_okay = false;
     return { 'success': false, 'message': message, 'data': [] }
   }
    const [rows] = await pool.query(`
    SELECT user_id, group_id, item_name, notes, purcahsed_location, date_purchased, amount_paid, created, updated
     FROM Stuff WHERE user_id=? AND group_id=?
    `, [props.user_id, props.group_id]);

    return { 'success': true, 'message': 'OK', 'data': rows }
}  

/*
CREATE TABLE Stuff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    group_id INT,
    item_name VARCHAR(255) NOT NULL,
    purchased_location VARCHAR(255),
    image VARCHAR(255),
    date_purchased DATETIME,
    amount_paid DECIMAL(10, 2),
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

CREATE TABLE Stuff_Groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    group_name VARCHAR(255) NOT NULL,
    notes TEXT,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated DATETIME DEFAULT CURRENT_TIMESTAMP
);
*/