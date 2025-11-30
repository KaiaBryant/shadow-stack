import pool from "../db.js";

// GET /api/leaderboard
export const getLeaderboard = (req, res) => {
    const query = `
        SELECT id, user_id, username, character_id, score, created_at
        FROM leaderboard
        ORDER BY score DESC
        LIMIT 20
    `;

    pool.query(query, (err, rows) => {
        if (err) {
            console.error("Leaderboard SQL Error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        // console.log("Leaderboard rows:", rows); // IMPORTANT DEBUG
        res.json(rows);
    });
};

// POST /api/leaderboard
export const submitScore = (req, res) => {
    const { username, score, level_completed } = req.body;

    if (!username || score === undefined || level_completed === undefined) {
        return res.status(400).json({ error: "Username, score, and level_completed are required" });
    }

    const query = `
        INSERT INTO leaderboard (username, score, level_completed)
        VALUES (?, ?, ?)
    `;

    pool.query(query, [username, score, level_completed], (err, result) => {
        if (err) {
            console.error("Error submitting score:", err);
            return res.status(500).json({ error: "Failed to submit score" });
        }

        return res.json({
            message: "Score submitted",
            id: result.insertId,
            username,
            score,
            level_completed
        });
    });
};
