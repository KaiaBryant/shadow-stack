import pool from "../db.js";

// GET /api/leaderboard
export const getLeaderboard = (req, res) => {
    const query = `
        SELECT id, user_id, username, character_id, score, level_completed, created_at
        FROM leaderboard
        ORDER BY score DESC
        LIMIT 20
    `;

    pool.query(query, (err, rows) => {
        if (err) {
            console.error("Leaderboard SQL Error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        res.json(rows);
    });
};

// POST /api/leaderboard
export const submitScore = (req, res) => {
    const { user_id, username, score, level_completed, character_id } = req.body;

    // Validation
    if (!username || score === undefined || level_completed === undefined) {
        return res.status(400).json({ 
            error: "Username, score, and level_completed are required" 
        });
    }

    // If no user_id, we can't track level completions reliably
    if (!user_id) {
        console.warn('No user_id provided - cannot prevent point farming');
        handleScoreUpdate(null, username, score, level_completed, character_id, res);
        return;
    }

    // CRITICAL: Check if user has already completed this level
    const checkLevelQuery = `
        SELECT id FROM user_level_completions
        WHERE user_id = ? AND level = ?
        LIMIT 1
    `;

    pool.query(checkLevelQuery, [user_id, level_completed], (checkErr, levelRows) => {
        if (checkErr) {
            console.error("Error checking level completion:", checkErr);
            return res.status(500).json({ error: "Failed to check level completion" });
        }

        if (levelRows.length > 0) {
            // User has already completed this level - DON'T AWARD POINTS
            console.log(`User ${user_id} already completed level ${level_completed}`);
            return res.json({
                message: "Level already completed. No points awarded.",
                already_completed: true,
                level: level_completed,
                username
            });
        }

        // Level NOT completed yet - mark it as completed FIRST
        const markCompleteQuery = `
            INSERT INTO user_level_completions (user_id, level)
            VALUES (?, ?)
        `;

        pool.query(markCompleteQuery, [user_id, level_completed], (markErr) => {
            if (markErr) {
                console.error("Error marking level as complete:", markErr);
                return res.status(500).json({ error: "Failed to mark level as complete" });
            }

            console.log(`Marked level ${level_completed} as complete for user ${user_id}`);

            // NOW update the score
            handleScoreUpdate(user_id, username, score, level_completed, character_id, res);
        });
    });
};

// Helper function to handle score update/insert
function handleScoreUpdate(user_id, username, score, level_completed, character_id, res) {
    // Check if user already has an entry in the leaderboard
    const checkQuery = user_id 
        ? `SELECT id, score, level_completed FROM leaderboard WHERE user_id = ? LIMIT 1`
        : `SELECT id, score, level_completed FROM leaderboard WHERE username = ? LIMIT 1`;

    const checkValue = user_id || username;

    pool.query(checkQuery, [checkValue], (checkErr, existingRows) => {
        if (checkErr) {
            console.error("Error checking existing score:", checkErr);
            return res.status(500).json({ error: "Failed to check existing score" });
        }

        if (existingRows.length > 0) {
            // User exists - UPDATE their score by ADDING the new score
            const existingEntry = existingRows[0];
            const newTotalScore = existingEntry.score + score;
            const newLevelCompleted = Math.max(existingEntry.level_completed, level_completed);

            const updateQuery = `
                UPDATE leaderboard
                SET score = ?, level_completed = ?, character_id = ?
                WHERE id = ?
            `;

            pool.query(updateQuery, [newTotalScore, newLevelCompleted, character_id || 1, existingEntry.id], (updateErr) => {
                if (updateErr) {
                    console.error("Error updating score:", updateErr);
                    return res.status(500).json({ error: "Failed to update score" });
                }

                console.log(`Updated score for user ${username}: ${existingEntry.score} + ${score} = ${newTotalScore}`);

                return res.json({
                    message: "Score updated successfully",
                    id: existingEntry.id,
                    user_id,
                    username,
                    score: newTotalScore,
                    score_added: score,
                    previous_score: existingEntry.score,
                    level_completed: newLevelCompleted,
                    character_id: character_id || 1
                });
            });
        } else {
            // User doesn't exist - INSERT new entry
            const insertQuery = `
                INSERT INTO leaderboard (user_id, username, score, level_completed, character_id)
                VALUES (?, ?, ?, ?, ?)
            `;

            const values = [
                user_id || null,
                username,
                score,
                level_completed,
                character_id || 1
            ];

            pool.query(insertQuery, values, (insertErr, result) => {
                if (insertErr) {
                    console.error("Error inserting score:", insertErr);
                    return res.status(500).json({ error: "Failed to insert score" });
                }

                console.log(`Created new leaderboard entry for ${username} with ${score} points`);

                return res.json({
                    message: "Score submitted successfully",
                    id: result.insertId,
                    user_id,
                    username,
                    score,
                    level_completed,
                    character_id: character_id || 1
                });
            });
        }
    });
}