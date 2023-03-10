import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

export const verifyJWT = (req, res, next) =>
{
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus('401');
    console.log(authHeader); // Bearer token
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); // invalid token
            req.user = decoded.username;
            next();
        }
    );
}

//module.exports = verifyJWT 