import pool from "../db.js";
import bcrypt from "bcrypt";

// Convert pool.query into a Promise wrapper
const query = (sql, params = []) =>
    new Promise((resolve, reject) => {
        pool.query(sql, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });


export const adminRegister = async (req, res) => {
    try {
        const { username, password, pin_code } = req.body;

        if (!username || !password || !pin_code) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Check if username already exists
        const existing = await query(
            "SELECT id FROM admins WHERE username = ?",
            [username]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: "Username already exists." });
        }

        // Hash password + pin
        const passwordHash = await bcrypt.hash(password, 12);
        const pinHash = await bcrypt.hash(pin_code, 12);

        // Insert new admin
        const result = await query(
            "INSERT INTO admins (username, password_hash, pin_code, role) VALUES (?, ?, ?, 'admin')",
            [username, passwordHash, pinHash]
        );

        return res.status(201).json({
            id: result.insertId,
            username,
            message: "Admin account created successfully."
        });
    } catch (error) {
        console.error("Admin register error:", error);
        return res.status(500).json({ error: "Server error creating admin." });
    }
};
