const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    try {
        const header = req.headers.authorization
        const token = header?.split(" ")[1]

        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        // console.log(token);
        // Add your token verification logic here
        jwt.verify(token, process.env.JWT_ACCESS_SECRETE_KEY, (error, decoded) => {
            if (error) {
                if (error.name === "TokenExpiredError") {
                    return res.status(401).json({ success: false, message: "Token expired" })
                }
                return res.status(401).json({ success: false, message: "Invalid token" })
            }
            req.user = decoded;
            // console.log(req.user);
            next(); // This calls the next middleware/route handler
        });
    } catch (error) {
        // console.log(error);
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

module.exports = verifyToken;
