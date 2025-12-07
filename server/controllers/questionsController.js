import pool from "../db.js";

// Store recently asked questions per session
const recentQuestions = new Map();

export const getQuestionByLevel = async (req, res) => {
    const { level } = req.params;
    const sessionId = req.query.sessionId || 'default';

    try {
        // Get list of recently asked questions for this session
        const askedQuestions = recentQuestions.get(`${sessionId}-${level}`) || [];

        // Build exclusion clause
        let excludeClause = '';
        if (askedQuestions.length > 0) {
            excludeClause = `AND id NOT IN (${askedQuestions.join(',')})`;
        }

        const query = `
            SELECT 
                id,
                level,
                question_text,
                correct_answer,
                wrong_answer_1,
                wrong_answer_2,
                wrong_answer_3,
                explanation
            FROM questions 
            WHERE level = ? ${excludeClause}
            ORDER BY RAND() 
            LIMIT 1
        `;

        pool.query(query, [level], (error, results) => {
            if (error) {
                console.error("Database error:", error);
                return res.status(500).json({
                    error: "Failed to fetch question",
                    details: error.message
                });
            }

            // If no questions found (all have been asked), reset the list
            if (results.length === 0) {
                recentQuestions.delete(`${sessionId}-${level}`);

                // Try again without exclusions
                const retryQuery = `
                    SELECT 
                        id,
                        level,
                        question_text,
                        correct_answer,
                        wrong_answer_1,
                        wrong_answer_2,
                        wrong_answer_3,
                        explanation
                    FROM questions 
                    WHERE level = ?
                    ORDER BY RAND() 
                    LIMIT 1
                `;

                pool.query(retryQuery, [level], (retryError, retryResults) => {
                    if (retryError || retryResults.length === 0) {
                        return res.status(404).json({
                            error: "No questions found for this level"
                        });
                    }

                    const question = retryResults[0];
                    sendFormattedQuestion(question, sessionId, level, res);
                });
                return;
            }

            const question = results[0];
            sendFormattedQuestion(question, sessionId, level, res);
        });

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({
            error: "Server error",
            details: error.message
        });
    }
};

function sendFormattedQuestion(question, sessionId, level, res) {
    // Add this question to the recent questions list IMMEDIATELY
    const key = `${sessionId}-${level}`;
    const askedQuestions = recentQuestions.get(key) || [];
    
    // Only add if not already in the list
    if (!askedQuestions.includes(question.id)) {
        askedQuestions.push(question.id);
    }

    // Keep only last 10 questions to avoid memory issues
    if (askedQuestions.length > 10) {
        askedQuestions.shift();
    }

    recentQuestions.set(key, askedQuestions);

    // Create array of all answers
    const answers = [
        { text: question.correct_answer, isCorrect: true },
        { text: question.wrong_answer_1, isCorrect: false },
        { text: question.wrong_answer_2, isCorrect: false },
        { text: question.wrong_answer_3, isCorrect: false }
    ];

    // Shuffle answers 
    for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
    }

    // Find which position has the correct answer
    let correctAnswerLetter = '';
    const options = ['A', 'B', 'C', 'D'];

    answers.forEach((answer, index) => {
        if (answer.isCorrect) {
            correctAnswerLetter = options[index];
        }
    });

    // Send properly formatted response
    res.json({
        id: question.id,
        level: question.level,
        question_text: question.question_text,
        option_a: answers[0].text,
        option_b: answers[1].text,
        option_c: answers[2].text,
        option_d: answers[3].text,
        correct_answer: correctAnswerLetter,
        explanation: question.explanation
    });
}