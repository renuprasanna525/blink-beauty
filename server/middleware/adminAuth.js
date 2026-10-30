
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

async function adminAuth(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Authentication required.",
        });
    }

    const token = authorization.slice(7).trim();

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Authentication required.",
        });
    }

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({
            success: false,
            message: "Server authentication configuration is incomplete.",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            issuer: "beauty-parlour-api",
            audience: "beauty-parlour-admin",
        });

        if (
            decoded.role !== "admin" ||
            !Number.isInteger(decoded.id) ||
            decoded.id <= 0
        ) {
            return res.status(403).json({
                success: false,
                message: "Admin access required.",
            });
        }

        const [admins] = await pool.execute(
            `SELECT id, username, email, role, is_active
             FROM admins
             WHERE id = ?
             LIMIT 1`,
            [decoded.id]
        );

        if (
            admins.length === 0 ||
            !admins[0].is_active ||
            admins[0].role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Admin account is inactive or unavailable.",
            });
        }

        req.admin = {
            id: admins[0].id,
            username: admins[0].username,
            email: admins[0].email,
            role: admins[0].role,
        };

        next();
    } catch (error) {
        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError" ||
            error.name === "NotBeforeError"
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired session. Please sign in again.",
            });
        }

        console.error("Admin authentication failed:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to verify admin access.",
        });
    }
}

module.exports = adminAuth;
