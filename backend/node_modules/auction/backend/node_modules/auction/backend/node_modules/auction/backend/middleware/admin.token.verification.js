const jwt = require('jsonwebtoken');

const verifyAdminToken = (req, res, next) => {
    const token = req.cookies.admin_token || 
                  (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
        return res.status(403).send({ message: 'No token provided.' });
    }

    jwt.verify(token, process.env.ADMIN_JWT_TOKEN, (err, decoded) => {
        if (err) {
            console.log('Invalid Token:', token);
            return res.status(500).send({ message: 'Failed to authenticate token.' });
        }

        req.admin_id = decoded._id;
        next();
    });
};

module.exports = { verifyAdminToken };
