import pool from "../db.js";

// GET /api/leaderboard
export const getLeaderboard = (req, res) => {
    const query = `
        SELECT username, score, level_completed, created_at
        FROM leaderboard
        ORDER BY score DESC, created_at ASC
        LIMIT 20
    `;

    pool.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching leaderboard:", err);
            return res.status(500).json({ error: "Failed loading leaderboard" });
        }

        return res.json(results);
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
