import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Helper wrapper for pool.query
const query = (sql, params = []) =>
    new Promise((resolve, reject) => {
        pool.query(sql, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });


// Admin login -> POST /api/admin/login
export const adminLogin = async (req, res) => {
    try {
        const { username, password, pin_code } = req.body;

        if (!username || !password || !pin_code) {
            return res.status(400).json({ error: "All credentials required" });
        }

        const admins = await query("SELECT * FROM admins WHERE username = ?", [username]);

        if (admins.length === 0) {
            return res.status(401).json({ error: "Invalid login" });
        }

        const admin = admins[0];

        const passwordMatch = await bcrypt.compare(password, admin.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid login" });
        }

        const pinMatch = await bcrypt.compare(pin_code, admin.pin_code);
        if (!pinMatch) {
            return res.status(401).json({ error: "Invalid login" });
        }

        const token = jwt.sign(
            { id: admin.id, username: admin.username, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ message: "Login successful", token });

    } catch (err) {
        console.error("Admin login error:", err);
        res.status(500).json({ error: "Server error logging in admin" });
    }
};


// Create new admin account -> // POST /api/admin
export const createAdmin = async (req, res) => {
    try {
        const { username, password, pin_code } = req.body;

        if (!username || !password || !pin_code) {
            return res.status(400).json({ error: "All fields required" });
        }

        const exists = await query("SELECT id FROM admins WHERE username = ?", [username]);
        if (exists.length > 0) {
            return res.status(400).json({ error: "Admin already exists" });
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const pinHash = await bcrypt.hash(pin_code, 12);

        const result = await query(
            "INSERT INTO admins (username, password_hash, pin_code, role) VALUES (?, ?, ?, 'admin')",
            [username, passwordHash, pinHash]
        );

        res.status(201).json({
            id: result.insertId,
            username,
            message: "Admin created successfully"
        });

    } catch (err) {
        console.error("Create admin error:", err);
        res.status(500).json({ error: "Server error creating admin" });
    }
};



// Get all users 
export const adminGetAllUsers = async (req, res) => {
    try {
        const users = await query(
            `SELECT id, username, character_id, created_at 
             FROM users 
             ORDER BY created_at DESC`
        );

        res.json(users);

    } catch (err) {
        console.error("Error getting users:", err);
        res.status(500).json({ error: "Server error loading users" });
    }
};


// Get all users session
export const adminGetAllSessions = async (req, res) => {
    try {
        const sessions = await query(
            `SELECT * FROM user_sessions ORDER BY created_at DESC`
        );

        res.json(sessions);

    } catch (err) {
        console.error("Error fetching sessions:", err);
        res.status(500).json({ error: "Server error loading sessions" });
    }
};


// Delete users 
export const adminDeleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        await query("DELETE FROM user_sessions WHERE user_id = ?", [id]);
        await query("DELETE FROM users WHERE id = ?", [id]);

        res.json({ message: "User deleted successfully" });

    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ error: "Server error deleting user" });
    }
};
