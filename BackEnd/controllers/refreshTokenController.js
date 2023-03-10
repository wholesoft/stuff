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

const handleRefreshToken = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(401)
    console.log(cookies.jwt);
    const refresh_token = cookies.jwt;

    const rows = pool.query(`SELECT id FROM Users WHERE refresh_token=?`, [refresh_token]);
    if (rows[0].length < 1) {
        return res.sendStatus(403);
    } 
    // evaluate jwt
    jwt.verify(
        refresh_token, process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || rows[0].id !== decoded.user_id) return res.sendStatus(403);
            const access_token = generate_access_token(decoded.user_id);
            res.json({ accessToken });
        }
    )
  }


function generate_access_token(user_id) {
    return jwt.sign({ user_id: user_id, admin: false }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

export default { handleRefreshToken };