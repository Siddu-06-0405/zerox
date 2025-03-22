import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';

export const protectAdmin = async (req, res, next) => {
    try {
        let token = req.cookies.jwt; // Try to get token from cookies

        if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1]; // Try to get token from headers
        }

        if (!token) {
            return res.status(401).json({ msg: "Unauthorized - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);

        if (!decoded) {
            return res.status(401).json({ msg: "Unauthorized - Invalid token" });
        }

        const user = await Admin.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        // console.log("Error in protectAdmin middleware:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
