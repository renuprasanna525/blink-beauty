
const express = require("express");
const pool = require("../config/db");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// All routes in this file require an authenticated admin.
router.use(adminAuth);

// GET /api/admin/dashboard
router.get("/dashboard", async (req, res) => {
    try {
        const [[serviceStats]] = await pool.query(`
            SELECT
                COUNT(*) AS total,
                COALESCE(SUM(is_active = TRUE), 0) AS active
            FROM services
        `);

        const [[customerStats]] = await pool.query(`
            SELECT COUNT(*) AS total
            FROM customers
        `);

        const [[bookingStats]] = await pool.query(`
            SELECT
                COUNT(*) AS total,
                COALESCE(SUM(status = 'pending'), 0) AS pending,
                COALESCE(SUM(status = 'confirmed'), 0) AS confirmed,
                COALESCE(SUM(status = 'completed'), 0) AS completed,
                COALESCE(SUM(status = 'cancelled'), 0) AS cancelled
            FROM bookings
        `);

        const [recentBookings] = await pool.query(`
            SELECT
                b.id,
                c.full_name AS customer_name,
                s.title AS service_name,
                DATE_FORMAT(b.appointment_date, '%Y-%m-%d') AS appointment_date,
                b.appointment_time,
                b.status
            FROM bookings b
            INNER JOIN customers c ON c.id = b.customer_id
            INNER JOIN services s ON s.id = b.service_id
            ORDER BY b.appointment_date DESC, b.appointment_time DESC
            LIMIT 5
        `);

        return res.json({
            success: true,
            admin: req.admin,
            stats: {
                services: {
                    total: Number(serviceStats.total),
                    active: Number(serviceStats.active),
                },
                customers: {
                    total: Number(customerStats.total),
                },
                bookings: {
                    total: Number(bookingStats.total),
                    pending: Number(bookingStats.pending),
                    confirmed: Number(bookingStats.confirmed),
                    completed: Number(bookingStats.completed),
                    cancelled: Number(bookingStats.cancelled),
                },
            },
            recentBookings,
        });
    } catch (error) {
        console.error("Dashboard data failed:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to load dashboard data.",
        });
    }
});


/* ---------- SERVICE MANAGEMENT ---------- */

// GET /api/admin/services — list all services
router.get("/services", async (req, res) => {
    try {
        const [services] = await pool.query(`
            SELECT id, title, description, price, duration_minutes,
                   is_active, created_at, updated_at
            FROM services
            ORDER BY id DESC
        `);

        return res.json({ success: true, services });
    } catch (error) {
        console.error("List services failed:", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to retrieve services.",
        });
    }
});

// POST /api/admin/services — create a service
router.post("/services", async (req, res) => {
    try {
        const {
            title,
            description = null,
            price = null,
            duration_minutes = null,
            is_active = true,
        } = req.body;

        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Service title is required.",
            });
        }

        if (title.trim().length > 150) {
            return res.status(400).json({
                success: false,
                message: "Service title must not exceed 150 characters.",
            });
        }

        if (description !== null && typeof description !== "string") {
            return res.status(400).json({
                success: false,
                message: "Description must be text or null.",
            });
        }

        if (
            price !== null &&
            (price === "" || !Number.isFinite(Number(price)) || Number(price) < 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "Price must be a non-negative number or null.",
            });
        }

        if (
            duration_minutes !== null &&
            (duration_minutes === "" ||
                !Number.isInteger(Number(duration_minutes)) ||
                Number(duration_minutes) <= 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "Duration must be a positive whole number or null.",
            });
        }

        if (typeof is_active !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "Active status must be true or false.",
            });
        }

        const [result] = await pool.query(
            `INSERT INTO services
                (title, description, price, duration_minutes, is_active)
             VALUES (?, ?, ?, ?, ?)`,
            [
                title.trim(),
                description?.trim() || null,
                price === null ? null : Number(price),
                duration_minutes === null ? null : Number(duration_minutes),
                is_active,
            ]
        );

        const [rows] = await pool.query(
            `SELECT id, title, description, price, duration_minutes,
                    is_active, created_at, updated_at
             FROM services WHERE id = ?`,
            [result.insertId]
        );

        return res.status(201).json({
            success: true,
            message: "Service created successfully.",
            service: rows[0],
        });
    } catch (error) {
        console.error("Create service failed:", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to create service.",
        });
    }
});

// PUT /api/admin/services/:id — update a service
router.put("/services/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid service ID.",
            });
        }

        const {
            title,
            description = null,
            price = null,
            duration_minutes = null,
            is_active = true,
        } = req.body;

        if (typeof title !== "string" || !title.trim() || title.trim().length > 150) {
            return res.status(400).json({
                success: false,
                message: "A valid service title of at most 150 characters is required.",
            });
        }

        if (description !== null && typeof description !== "string") {
            return res.status(400).json({
                success: false,
                message: "Description must be text or null.",
            });
        }

        if (
            price !== null &&
            (price === "" || !Number.isFinite(Number(price)) || Number(price) < 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "Price must be a non-negative number or null.",
            });
        }

        if (
            duration_minutes !== null &&
            (duration_minutes === "" ||
                !Number.isInteger(Number(duration_minutes)) ||
                Number(duration_minutes) <= 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "Duration must be a positive whole number or null.",
            });
        }

        if (typeof is_active !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "Active status must be true or false.",
            });
        }

        const [result] = await pool.query(
            `UPDATE services
             SET title = ?, description = ?, price = ?,
                 duration_minutes = ?, is_active = ?
             WHERE id = ?`,
            [
                title.trim(),
                description?.trim() || null,
                price === null ? null : Number(price),
                duration_minutes === null ? null : Number(duration_minutes),
                is_active,
                id,
            ]
        );

        if (result.affectedRows === 0) {
            const [existing] = await pool.query(
                "SELECT id FROM services WHERE id = ?",
                [id]
            );

            if (!existing.length) {
                return res.status(404).json({
                    success: false,
                    message: "Service not found.",
                });
            }
        }

        const [rows] = await pool.query(
            `SELECT id, title, description, price, duration_minutes,
                    is_active, created_at, updated_at
             FROM services WHERE id = ?`,
            [id]
        );

        return res.json({
            success: true,
            message: "Service updated successfully.",
            service: rows[0],
        });
    } catch (error) {
        console.error("Update service failed:", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to update service.",
        });
    }
});

// PATCH /api/admin/services/:id/status — activate/deactivate
router.patch("/services/:id/status", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { is_active } = req.body;

        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid service ID.",
            });
        }

        if (typeof is_active !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "is_active must be true or false.",
            });
        }

        const [result] = await pool.query(
            "UPDATE services SET is_active = ? WHERE id = ?",
            [is_active, id]
        );

        if (result.affectedRows === 0) {
            const [existing] = await pool.query(
                "SELECT id FROM services WHERE id = ?",
                [id]
            );

            if (!existing.length) {
                return res.status(404).json({
                    success: false,
                    message: "Service not found.",
                });
            }
        }

        return res.json({
            success: true,
            message: is_active
                ? "Service activated successfully."
                : "Service deactivated successfully.",
        });
    } catch (error) {
        console.error("Change service status failed:", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to change service status.",
        });
    }
});


/* ---------- BOOKING MANAGEMENT ---------- */

// GET /api/admin/bookings — retrieve all bookings
router.get("/bookings", async (req, res) => {
    try {
        const [bookings] = await pool.query(`
            SELECT
                b.id,
                b.customer_id,
                c.full_name AS customer_name,
                c.email AS customer_email,
                c.phone AS customer_phone,
                b.service_id,
                s.title AS service_name,
                DATE_FORMAT(b.appointment_date, '%Y-%m-%d') AS appointment_date,
                b.appointment_time,
                b.status,
                b.notes,
                b.created_at
            FROM bookings b
            INNER JOIN customers c ON c.id = b.customer_id
            INNER JOIN services s ON s.id = b.service_id
            ORDER BY b.appointment_date DESC,
                     b.appointment_time DESC,
                     b.id DESC
        `);

        return res.json({
            success: true,
            total: bookings.length,
            bookings,
        });
    } catch (error) {
        console.error("Retrieve bookings failed:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve bookings.",
        });
    }
});

// PATCH /api/admin/bookings/:id/status — update booking status
router.patch("/bookings/:id/status", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "confirmed",
            "completed",
            "cancelled",
        ];

        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking ID.",
            });
        }

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking status.",
            });
        }

        const [result] = await pool.query(
            "UPDATE bookings SET status = ? WHERE id = ?",
            [status, id]
        );

        if (result.affectedRows === 0) {
            const [existing] = await pool.query(
                "SELECT id FROM bookings WHERE id = ?",
                [id]
            );

            if (!existing.length) {
                return res.status(404).json({
                    success: false,
                    message: "Booking not found.",
                });
            }
        }

        return res.json({
            success: true,
            message: "Booking status updated successfully.",
            booking: {
                id,
                status,
            },
        });
    } catch (error) {
        console.error("Update booking status failed:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to update booking status.",
        });
    }
});

module.exports = router;
