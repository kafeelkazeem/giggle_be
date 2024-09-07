import jwt from 'jsonwebtoken'
const jwtSecret = process.env.TOKENSECRET

export const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(403).json({ error: 'Access denied' });
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.customer = decoded;
        next();
    } catch (err) {
        console.log(err)
        res.status(401).json({ error: 'Invalid token' });
    }
};