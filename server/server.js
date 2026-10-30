
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const bookingRoutes = require("./routes/bookings");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
}));

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/api/health", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT DATABASE() AS database_name");

        res.json({
            success: true,
            message: "Beauty Parlour API is running",
            database: rows[0].database_name,
        });
    } catch (error) {
        console.error("Database connection failed:", error.message);
        res.status(500).json({
            success: false,
            message: "Database connection failed",
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Beauty Parlour API running at http://localhost:${PORT}`);
});

