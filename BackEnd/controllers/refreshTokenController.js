import mysql from 'mysql2';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

const handleRefreshToken = async (req, res) => {
    console.log("handleRefreshToken");
    const cookies = req.cookies
    if (!cookies?.jwt) {
         console.log("No JWT cookie");
         return res.sendStatus(401);
    }
    console.log(cookies.jwt);
    const refresh_token = cookies.jwt;
    console.log(`SELECT id, roles FROM Users WHERE refresh_token='${refresh_token}'`);
    const [rows] = await pool.query(`SELECT id, roles FROM Users WHERE refresh_token=?`, [refresh_token]);
    console.log(rows[0]);
    if (rows[0].length < 1) {
        return res.sendStatus(403);
    } 
    // evaluate jwt
    jwt.verify(
        refresh_token, process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || rows[0].id !== decoded.user_id) {
                //console.log(decoded);
                //console.log(rows[0].id);
                //console.log(decoded.user_id);
                //console.log(rows[0].id !== decoded.user_id);
                return res.sendStatus(403);
            }            
            const access_token = generate_access_token(decoded.user_id, decoded.roles);
            console.log(`New access token: ${access_token}`);
            res.json({ access_token: access_token, roles: decoded.roles });
        }
    )
  }


function generate_access_token(user_id, roles) {
    return jwt.sign({ user_id: user_id, roles: roles }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
}

export default { handleRefreshToken };