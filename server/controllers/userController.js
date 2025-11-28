// Users table retreival

import connection from "../db.js";

// POST /api/users
export const createUser = (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }

    const query = `
    INSERT INTO users (username)
    VALUES (?)
  `;

    connection.query(query, [username], (err, result) => {
        if (err) {
            console.error("Error creating user:", err);
            return res.status(500).json({ error: "Failed to create user" });
        }

        return res.json({ id: result.insertId, username });
    });
};

// GET /api/admin/users   ← Admin-only
export const getAllUsers = (req, res) => {
    const query = `
        SELECT id, username, character_id, created_at
        FROM users
        ORDER BY created_at DESC
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).json({ error: "Failed to load users" });
        }

        return res.json(results);
    });
};