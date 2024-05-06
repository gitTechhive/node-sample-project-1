const jwt = require('jsonwebtoken');
const secretKey = require('./privateKey'); // Import private key
const publicKey = require('./publicKey'); // Import public key

const privateKEY = Buffer.from(secretKey.privateKey, 'utf-8').toString(); // Convert private key to Buffer
const publicKEY = publicKey.publicKey; // Access public key

// Function to sign JWT token with user data
const signToken = (data) => {
    let { id, firstName, lastName, email, mobileNo } = data
    let privateKEY = Buffer.from(secretKey.privateKey, 'utf-8').toString();

    let payload = {
        id: id,
        firstName: firstName,
        lastName: lastName,
        email: email,
        mobileNo: mobileNo,
    };

    let signOptions = {
        expiresIn: "12h",
        algorithm: "RS256"
    };

    return jwt.sign(payload, privateKEY, signOptions);
}
// Middleware function for authentication
const auth = async (req, res, next) => {
    try {
        // Extract JWT token from request headers
        const token = req.headers.authorization?.split(' ')[1];
        const nonSecurePaths = ['/captcha', '/test', '/generateOtpForRegistration', '/verifyOtpForRegistration', '/login', '/captcha/generate', '/master/countryCodes']; // Define non-secure paths

        // Check if request path is in non-secure paths, if yes, proceed to next middleware
        if (nonSecurePaths.includes(req.path)) {
            return next();
        }

        // If token exists
        if (token) {
            // Verify JWT token with public key
            const userDetail = await jwt.verify(token, publicKEY, { expiresIn: '12h', algorithms: ['RS256'] });
            if (!userDetail.userId && !userDetail.id) {
                res.status(401).json({ status: 401, message: 'Malware or invalid token detected', data: [], error: true });
            } else {
                next(); // Proceed to next middleware
            }
        } else {
            // If token doesn't exist, send unauthorized response
            res.status(401).json({ status: 401, message: 'Unauthorized User', data: [], error: true });
        }
    } catch (error) {
        // If any error occurs during authentication, log error and send unauthorized response
        console.error('Authentication Error:', error);
        res.status(401).json({ status: 401, message: 'Unauthorized User. Please login again.' });
    }
};

module.exports = {
    signToken,
    auth
};
