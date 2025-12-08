import pool from "../db.js";

// Get multiple random questions at once (batch)
export const getQuestionsBatch = async (req, res) => {
    const { level } = req.params;
    const count = parseInt(req.query.count) || 7;

    try {
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
            WHERE level = ?
            ORDER BY RAND() 
            LIMIT ?
        `;

        pool.query(query, [level, count], (error, results) => {
            if (error) {
                console.error("Database error:", error);
                return res.status(500).json({
                    error: "Failed to fetch questions",
                    details: error.message
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    error: "No questions found for this level"
                });
            }

            // Format each question with shuffled answers
            const formattedQuestions = results.map(question => formatQuestion(question));

            res.json({
                questions: formattedQuestions,
                count: formattedQuestions.length
            });
        });

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({
            error: "Server error",
            details: error.message
        });
    }
};

// Original single question endpoint (kept for backward compatibility)
export const getQuestionByLevel = async (req, res) => {
    const { level } = req.params;

    try {
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
            WHERE level = ?
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

            if (results.length === 0) {
                return res.status(404).json({
                    error: "No questions found for this level"
                });
            }

            const question = results[0];
            res.json(formatQuestion(question));
        });

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({
            error: "Server error",
            details: error.message
        });
    }
};

// Helper function to format a question with shuffled answers
function formatQuestion(question) {
    // Create array of all answers
    const answers = [
        { text: question.correct_answer, isCorrect: true },
        { text: question.wrong_answer_1, isCorrect: false },
        { text: question.wrong_answer_2, isCorrect: false },
        { text: question.wrong_answer_3, isCorrect: false }
    ];

    // Shuffle answers using Fisher-Yates algorithm
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

    // Return formatted question
    return {
        id: question.id,
        level: question.level,
        question_text: question.question_text,
        option_a: answers[0].text,
        option_b: answers[1].text,
        option_c: answers[2].text,
        option_d: answers[3].text,
        correct_answer: correctAnswerLetter,
        explanation: question.explanation
    };
}