// Fetches one random question for that level
import pool from "../db.js";

// GET /api/questions/:level
export const getQuestionByLevel = (req, res) => {
    const level = Number(req.params.level);

    const query = `
        SELECT * FROM questions
        WHERE level = ?
        ORDER BY RAND()
        LIMIT 1
    `;

    pool.query(query, [level], (err, results) => {
        if (err) {
            console.error("Error fetching question:", err);
            return res.status(500).json({ error: "Failed to fetch question" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "No questions found for this level" });
        }

        return res.json(results[0]);
    });
};
