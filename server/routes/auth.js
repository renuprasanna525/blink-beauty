
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        if (!process.env.JWT_SECRET ||
            process.env.JWT_SECRET === "temporary_secret_replace_before_admin_login") {
            return res.status(500).json({
                success: false,
                message: "Server authentication configuration is incomplete.",
            });
        }

        const [admins] = await pool.execute(
            `SELECT id, username, email, password_hash, role, is_active
             FROM admins
             WHERE email = ?
             LIMIT 1`,
            [email.trim()]
        );

        if (admins.length === 0 || !admins[0].is_active) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        const admin = admins[0];
        const passwordMatches = await bcrypt.compare(
            password,
            admin.password_hash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        const token = jwt.sign(
            {
                id: admin.id,
                role: admin.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h",
                issuer: "beauty-parlour-api",
                audience: "beauty-parlour-admin",
            }
        );

        return res.json({
            success: true,
            message: "Admin login successful.",
            token,
            admin: {
                id: admin.id,
                username: admin.username,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        console.error("Admin login failed:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to process login right now.",
        });
    }
});

module.exports = router;
