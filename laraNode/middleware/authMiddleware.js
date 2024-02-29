const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    // Step 1: Check presence of token
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    // Step 2: Check JWT token format
    const tokenParts = token.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer' || !tokenParts[1]) {
        return res.status(401).json({ message: 'Invalid token format.' });
    }

    // Step 3: Decode the token
    const decodedToken = jwt.decode(tokenParts[1], { complete: true });
    if (!decodedToken) {
        return res.status(401).json({ message: 'Invalid token.' });
    }

    // Step 4: Verify the signature if needed (optional)
    jwt.verify(tokenParts[1], jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token.' });
        }
        
        // Attach the student ID to the request object
        req.studentId = decoded.id;
        console.log(req.studentId)

        // Proceed to the next middleware
        next();
    });
};

module.exports = verifyToken;
