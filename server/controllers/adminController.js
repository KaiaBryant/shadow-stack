import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// POST /api/admin/login
export const adminLogin = (req, res) => {
    const { username, password, pin_code } = req.body;

    if (!username || !password || !pin_code) {
        return res.status(400).json({ error: "Username, password, and pin code required" });
    }

    const query = "SELECT * FROM admins WHERE username = ?";

    pool.query(query, [username], async (err, results) => {
        if (err) {
            console.error("Admin login error:", err);
            return res.status(500).json({ error: "Server error" });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const admin = results[0];

        // Compare password
        const passwordMatch = await bcrypt.compare(password, admin.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Compare PIN
        const pinMatch = await bcrypt.compare(pin_code, admin.pin_code);
        if (!pinMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.json({
            message: "Login successful",
            token
        });
    });
};
