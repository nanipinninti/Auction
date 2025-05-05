const jwt = require('jsonwebtoken');

const verifyFranchiseToken = (req, res, next) => {
    // Extract token from cookies or Authorization header
    const token = req.cookies.franchise_token || 
                  (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
        return res.status(403).send({ message: 'No token provided.' });
    }

    jwt.verify(token, process.env.FRANCHISE_JWT_TOKEN, (err, decoded) => {
        if (err) {
            console.log('Invalid Token:', token);
            return res.status(500).send({ message: 'Failed to authenticate token.' });
        }

        // If everything is good, save the decoded token to request for use in other routes
        req.franchise_id = decoded._id;
        next();
    });
};

module.exports = { verifyFranchiseToken };
