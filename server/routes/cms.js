const express = require("express");
const pool = require("../config/db");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

function isValidSectionKey(value) {
    return (
        typeof value === "string" &&
        /^[a-z0-9_-]{2,100}$/.test(value)
    );
}

function isValidContent(value) {
    return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
    );
}

function parseSection(row) {
    return {
        id: row.id,
        section_key: row.section_key,
        section_name: row.section_name,
        content: JSON.parse(row.content_json),
        is_published: Boolean(row.is_published),
        sort_order: row.sort_order,
        created_at: row.created_at,
        updated_at: row.updated_at,
    };
}

function handleError(res, error, message) {
    console.error(message, error.message);

    return res.status(500).json({
        success: false,
        message,
    });
}

// PUBLIC: Retrieve published website sections.
router.get("/content", async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT id, section_key, section_name,
                    content_json, sort_order
             FROM website_content
             WHERE is_published = TRUE
             ORDER BY sort_order ASC, id ASC`
        );

        const sections = rows.map((row) => ({
            id: row.id,
            section_key: row.section_key,
            section_name: row.section_name,
            content: JSON.parse(row.content_json),
            sort_order: row.sort_order,
        }));

        return res.json({
            success: true,
            sections,
        });
    } catch (error) {
        return handleError(
            res,
            error,
            "Unable to retrieve website content."
        );
    }
});

// All /admin endpoints require existing admin authentication.
router.use("/admin", adminAuth);

// ADMIN: Retrieve all sections, including unpublished sections.
router.get("/admin/content", async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT *
             FROM website_content
             ORDER BY sort_order ASC, id ASC`
        );

        return res.json({
            success: true,
            sections: rows.map(parseSection),
        });
    } catch (error) {
        return handleError(
            res,
            error,
            "Unable to retrieve admin website content."
        );
    }
});

// ADMIN: Create a website section.
router.post("/admin/content", async (req, res) => {
    const {
        section_key,
        section_name,
        content,
        is_published = true,
        sort_order = 0,
    } = req.body;

    if (
        !isValidSectionKey(section_key) ||
        typeof section_name !== "string" ||
        !section_name.trim() ||
        section_name.trim().length > 150 ||
        !isValidContent(content) ||
        typeof is_published !== "boolean" ||
        !Number.isInteger(sort_order)
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid section details or content.",
        });
    }

    try {
        const [result] = await pool.execute(
            `INSERT INTO website_content
                (section_key, section_name, content_json,
                 is_published, sort_order)
             VALUES (?, ?, ?, ?, ?)`,
            [
                section_key,
                section_name.trim(),
                JSON.stringify(content),
                is_published,
                sort_order,
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Website section created successfully.",
            id: result.insertId,
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "This section key already exists.",
            });
        }

        return handleError(
            res,
            error,
            "Unable to create website section."
        );
    }
});

// ADMIN: Update section content and optional metadata.
router.put("/admin/content/:sectionKey", async (req, res) => {
    const { sectionKey } = req.params;

    if (!isValidSectionKey(sectionKey)) {
        return res.status(400).json({
            success: false,
            message: "Invalid section key.",
        });
    }

    const updates = [];
    const values = [];
    const body = req.body;

    if (Object.prototype.hasOwnProperty.call(body, "content")) {
        if (!isValidContent(body.content)) {
            return res.status(400).json({
                success: false,
                message: "Content must be a JSON object.",
            });
        }

        updates.push("content_json = ?");
        values.push(JSON.stringify(body.content));
    }

    if (Object.prototype.hasOwnProperty.call(body, "section_name")) {
        if (
            typeof body.section_name !== "string" ||
            !body.section_name.trim() ||
            body.section_name.trim().length > 150
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid section name.",
            });
        }

        updates.push("section_name = ?");
        values.push(body.section_name.trim());
    }

    if (Object.prototype.hasOwnProperty.call(body, "is_published")) {
        if (typeof body.is_published !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "is_published must be true or false.",
            });
        }

        updates.push("is_published = ?");
        values.push(body.is_published);
    }

    if (Object.prototype.hasOwnProperty.call(body, "sort_order")) {
        if (!Number.isInteger(body.sort_order)) {
            return res.status(400).json({
                success: false,
                message: "sort_order must be an integer.",
            });
        }

        updates.push("sort_order = ?");
        values.push(body.sort_order);
    }

    if (updates.length === 0) {
        return res.status(400).json({
            success: false,
            message: "No valid fields supplied for update.",
        });
    }

    try {
        values.push(sectionKey);

        const [result] = await pool.execute(
            `UPDATE website_content
             SET ${updates.join(", ")}
             WHERE section_key = ?`,
            values
        );

        if (result.affectedRows === 0) {
            const [existing] = await pool.execute(
                `SELECT id
                 FROM website_content
                 WHERE section_key = ?
                 LIMIT 1`,
                [sectionKey]
            );

            if (existing.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Website section not found.",
                });
            }
        }

        return res.json({
            success: true,
            message: "Website section updated successfully.",
        });
    } catch (error) {
        return handleError(
            res,
            error,
            "Unable to update website section."
        );
    }
});

// ADMIN: Delete a website section.
router.delete("/admin/content/:sectionKey", async (req, res) => {
    const { sectionKey } = req.params;

    if (!isValidSectionKey(sectionKey)) {
        return res.status(400).json({
            success: false,
            message: "Invalid section key.",
        });
    }

    try {
        const [result] = await pool.execute(
            `DELETE FROM website_content
             WHERE section_key = ?`,
            [sectionKey]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Website section not found.",
            });
        }

        return res.json({
            success: true,
            message: "Website section deleted successfully.",
        });
    } catch (error) {
        return handleError(
            res,
            error,
            "Unable to delete website section."
        );
    }
});

module.exports = router;
