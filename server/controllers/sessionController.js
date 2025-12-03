import pool from "../db.js";


// Helper: end session internally
const markSessionInactive = (session_id) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `
            UPDATE user_sessions
            SET is_active = FALSE, updated_at = NOW()
            WHERE id = ?
            `,
            [session_id],
            (err) => {
                if (err) reject(err);
                else resolve();
            }
        );
    });
};


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
export const updateSession = async (req, res) => {
    const { session_id, current_level, lives_remaining, attempts_remaining } = req.body;

    if (!session_id) {
        return res.status(400).json({ error: "session_id is required" });
    }

    try {
        // Condition 1 — lose all lives
        if (lives_remaining <= 0) {
            await markSessionInactive(session_id);
            return res.json({ message: "Session ended (out of lives)" });
        }

        // Condition 2 — finishes the game 
        if (current_level > 7) {
            await markSessionInactive(session_id);
            return res.json({ message: "Game completed — session ended" });
        }

        const query = `
            UPDATE user_sessions
            SET current_level = ?, lives_remaining = ?, attempts_remaining = ?, 
                updated_at = NOW()
            WHERE id = ?
        `;

        pool.query(
            query,
            [current_level, lives_remaining, attempts_remaining, session_id],
            (err) => {
                if (err) {
                    console.error("Error updating session:", err);
                    return res.status(500).json({ error: "Failed to update session" });
                }
                res.json({ message: "Sessions updated" });
            }
        );
    } catch (err) {
        console.error("Update session error:", err);
        res.status(500).json({ error: "Server error updating session" });
    }
};


// Manual logout -> ends session
export const endSession = async (req, res) => {
    const { session_id } = req.body;

    if (!session_id) {
        return res.status(400).json({ error: "session_id is required" });
    }

    try {
        await markSessionInactive(session_id);
        res.json({ message: "Session ended (by logout)" });
    } catch (err) {
        console.error("Error ending session:", err);
        res.status(500).json({ error: "Failed to end session" });
    }
};


// Auto-expire inactive sessions > 60 min
export const expireOldSessions = (req, res) => {
    const query = `
        UPDATE user_sessions
        SET is_active = FALSE
        WHERE is_active = TRUE
        AND updated_at < NOW() - INTERVAL 60 MINUTE
    `;

    pool.query(query, (err, result) => {
        if (err) {
            console.error("Error expiring sessions:", err);
            return res.status(500).json({ error: "Failed to expire old sessions" });
        }

        res.json({
            message: "Old sessions expired",
            affected: result.affectedRows
        });
    });
};

// // End session
// export const endSession = (req, res) => {
//     const { session_id } = req.body;

//     if (!session_id) {
//         return res.status(400).json({ error: "session_id is required" });
//     }

//     const query = `
//         UPDATE user_sessions
//         SET is_active = FALSE, updated_at = NOW()
//         WHERE id = ?
//     `;

//     pool.query(query, [session_id], (err) => {
//         if (err) {
//             console.error("Error ending session:", err);
//             return res.status(500).json({ error: "Failed to end session" });
//         }

//         res.json({ message: "Session ended" });
//     });
// };

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
