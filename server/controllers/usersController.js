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
