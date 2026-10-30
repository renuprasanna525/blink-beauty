const express = require("express");
const pool = require("../config/db");

const router = express.Router();

const ALLOWED_BRANCHES = [
    "Mudichur - Lakshmi Nagar",
    "Old Perungalathur - Parvathy Nagar",
];

// GET /api/bookings/services — public list of active services
router.get("/services", async (req, res) => {
    try {
        const [services] = await pool.query(`
            SELECT id, title, description, price, duration_minutes
            FROM services
            WHERE is_active = TRUE
            ORDER BY title ASC
        `);

        return res.json({ success: true, services });
    } catch (error) {
        console.error("Public service list failed:", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to load available services.",
        });
    }
});

// POST /api/bookings — create a public appointment request
router.post("/", async (req, res) => {
    const {
        name,
        phone,
        service_id,
        appointment_date,
        appointment_time,
        branch,
    } = req.body;

    const customerName = typeof name === "string" ? name.trim() : "";
    const enteredPhone = typeof phone === "string" ? phone.trim() : "";
    const normalizedPhone = enteredPhone.replace(/\D/g, "");
    const serviceId = Number(service_id);

    if (customerName.length < 2 || customerName.length > 150) {
        return res.status(400).json({
            success: false,
            message: "Please enter a name between 2 and 150 characters.",
        });
    }

    if (!/^\d{7,15}$/.test(normalizedPhone)) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid phone number.",
        });
    }

    if (!Number.isSafeInteger(serviceId) || serviceId <= 0) {
        return res.status(400).json({
            success: false,
            message: "Please select a valid service.",
        });
    }

    if (
        typeof appointment_date !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(appointment_date)
    ) {
        return res.status(400).json({
            success: false,
            message: "Please select a valid appointment date.",
        });
    }

    const parsedDate = new Date(`${appointment_date}T00:00:00Z`);

    if (
        Number.isNaN(parsedDate.getTime()) ||
        parsedDate.toISOString().slice(0, 10) !== appointment_date
    ) {
        return res.status(400).json({
            success: false,
            message: "Please select a valid appointment date.",
        });
    }

    if (
        typeof appointment_time !== "string" ||
        !/^([01]\d|2[0-3]):[0-5]\d$/.test(appointment_time)
    ) {
        return res.status(400).json({
            success: false,
            message: "Please select a valid appointment time.",
        });
    }

    if (!ALLOWED_BRANCHES.includes(branch)) {
        return res.status(400).json({
            success: false,
            message: "Please select a valid salon branch.",
        });
    }

    const today = new Date();
    const todayLocal = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0"),
    ].join("-");

    if (appointment_date < todayLocal) {
        return res.status(400).json({
            success: false,
            message: "Please select today or a future appointment date.",
        });
    }

    let connection;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [serviceRows] = await connection.query(
            `SELECT id FROM services
             WHERE id = ? AND is_active = TRUE
             FOR UPDATE`,
            [serviceId]
        );

        if (!serviceRows.length) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: "That service is unavailable. Please choose another service.",
            });
        }

        const [customerRows] = await connection.query(
            "SELECT id FROM customers WHERE phone = ? LIMIT 1",
            [normalizedPhone]
        );

        let customerId;

        if (customerRows.length) {
            customerId = customerRows[0].id;

            await connection.query(
                "UPDATE customers SET full_name = ? WHERE id = ?",
                [customerName, customerId]
            );
        } else {
            const [customerResult] = await connection.query(
                `INSERT INTO customers (full_name, phone)
                 VALUES (?, ?)`,
                [customerName, normalizedPhone]
            );

            customerId = customerResult.insertId;
        }

        const [bookingResult] = await connection.query(
            `INSERT INTO bookings
                (customer_id, service_id, branch, appointment_date,
                 appointment_time, status)
             VALUES (?, ?, ?, ?, ?, 'pending')`,
            [
                customerId,
                serviceId,
                branch,
                appointment_date,
                appointment_time,
            ]
        );

        await connection.commit();

        return res.status(201).json({
            success: true,
            message: "Your appointment request has been submitted successfully.",
            booking: {
                id: bookingResult.insertId,
                customer_id: customerId,
                service_id: serviceId,
                branch,
                appointment_date,
                appointment_time,
                status: "pending",
            },
        });
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }

        console.error("Create public booking failed:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to submit your appointment. Please try again.",
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

module.exports = router;
