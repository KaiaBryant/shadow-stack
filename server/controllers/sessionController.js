import pool from "../db.js";

// Start session 
export const startSession = (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ error: "user_id is required" });
    }

    const query = `
        INSERT INTO user_sessions (user_id, current_level, lives_remaining, attempts_remaining, is_active)
        VALUES (?, 1, 3, 2, TRUE)
    `;

    pool.query(query, [user_id], (err, result) => {
        if (err) {
            console.error("Error starting session:", err);
            return res.status(500).json({ error: "Failed to start session" });
        }

        res.json({
            message: "Session started",
            session_id: result.insertId
        });
    });
};

// Update session 
export const updateSession = (req, res) => {
    const { session_id, current_level, lives_remaining, attempts_remaining } = req.body;

    if (!session_id) {
        return res.status(400).json({ error: "session_id is required" });
    }

    const query = `
        UPDATE user_sessions
        SET current_level = ?, lives_remaining = ?, attempts_remaining = ?, updated_at = NOW()
        WHERE id = ?
    `;

    pool.query(query,
        [current_level, lives_remaining, attempts_remaining, session_id],
        (err) => {
            if (err) {
                console.error("Error updating session:", err);
                return res.status(500).json({ error: "Failed to update session" });
            }
            res.json({ message: "Session updated" });
        }
    );
};

// End session
export const endSession = (req, res) => {
    const { session_id } = req.body;

    if (!session_id) {
        return res.status(400).json({ error: "session_id is required" });
    }

    const query = `
        UPDATE user_sessions
        SET is_active = FALSE, updated_at = NOW()
        WHERE id = ?
    `;

    pool.query(query, [session_id], (err) => {
        if (err) {
            console.error("Error ending session:", err);
            return res.status(500).json({ error: "Failed to end session" });
        }

        res.json({ message: "Session ended" });
    });
};

// Admin + get all session
export const getAllSessions = (req, res) => {
    const query = `
        SELECT 
            s.id AS session_id,
            s.user_id,
            u.username,
            s.current_level,
            s.lives_remaining,
            s.attempts_remaining,
            s.is_active,
            s.created_at,
            s.updated_at
        FROM user_sessions s
        JOIN users u ON s.user_id = u.id
        ORDER BY s.updated_at DESC
    `;

    pool.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching sessions:", err);
            return res.status(500).json({ error: "Failed to load sessions" });
        }

        res.json(results);
    });
};
