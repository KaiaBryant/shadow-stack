import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../styles/Simulator.css";
import axios from 'axios';

function Simulator() {
    const location = useLocation();
    const navigate = useNavigate();
    const level = location.state?.level ?? 1; // level passed from LevelsMenu

    // State management for Questions Tracker
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [threatLevel, setThreatLevel] = useState(0);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);

    // State Management for Level Tracker
    const [currentLevelNumber, setCurrentLevelNumber] = useState(level);

    // Creates unique session id
    const [sessionId] = useState(
        () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    );

    // State Management for Score Tracker
    const [score, setScore] = useState(0);
    const [sessionScore, setSessionScore] = useState(0); // Score for current session

    // Track if level was already completed (for anti-farming message)
    const [levelAlreadyCompleted, setLevelAlreadyCompleted] = useState(false);

    const QUESTIONS_TO_COMPLETE = 5;

    // Calculate points per question based on level (50 * 2^(level-1))
    const getPointsForLevel = (level) => {
        return 50 * Math.pow(2, level - 1);
    };

    // Initialize the simulator when component mounts or level changes
    useEffect(() => {
        if (level) {
            fetchQuestion(level);
            setCurrentLevelNumber(level);
            setLevelAlreadyCompleted(false); // Reset for new level
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [level]);

    // Fetches a random question from the backend for the specified level
    const fetchQuestion = async (level) => {
        setLoading(true);
        setError(null);
        setSelectedAnswer(null);
        setShowExplanation(false);

        try {
            const response = await axios.get(
                `https://shadow-stack.onrender.com/api/questions/${level}?sessionId=${sessionId}`
            );
            setCurrentQuestion(response.data);
        } catch (err) {
            console.error("Error fetching question:", err);
            setError("Failed to load question. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handles user's answer selection
    const handleAnswerSelect = async (answer) => {
        setSelectedAnswer(answer);
        setShowExplanation(true);
        setQuestionsAnswered((prev) => prev + 1);

        const isCorrect = answer === currentQuestion.correct_answer;

        if (isCorrect) {
            const newCorrectAnswers = correctAnswers + 1;
            setCorrectAnswers(newCorrectAnswers);

            // Add points for correct answer
            const points = getPointsForLevel(currentLevelNumber);
            setScore((prev) => prev + points);
            setSessionScore((prev) => prev + points);

            // Check if this is the 5th correct answer (level completion)
            if (newCorrectAnswers >= QUESTIONS_TO_COMPLETE) {
                // Check if level was already completed
                const userId = localStorage.getItem('user_id');
                if (userId) {
                    try {
                        const response = await axios.get(
                            `https://shadow-stack.onrender.com/api/leaderboard/check-completion?user_id=${userId}&level=${currentLevelNumber}`
                        );

                        if (response.data.completed) {
                            console.log('ℹ️ Level already completed - setting flag');
                            setLevelAlreadyCompleted(true);
                        }
                    } catch (err) {
                        console.error('Error checking completion:', err);
                    }
                }
            }
        } else {
            setThreatLevel((prev) => Math.min(3, prev + 1));
        }
    };

    // Unlocks the next level in localStorage if conditions are met (per user)
    const unlockNextLevel = (currentLevel) => {
        const username = localStorage.getItem('username');
        const STORAGE_KEY = username
            ? `maxUnlockedLevel_${username}`
            : 'maxUnlockedLevel_guest';

        const maxUnlocked = parseInt(localStorage.getItem(STORAGE_KEY) || '1', 10);
        const nextLevel = currentLevel + 1;

        if (nextLevel > maxUnlocked && nextLevel <= 7) {
            localStorage.setItem(STORAGE_KEY, nextLevel.toString());
            return true;
        }
        return false;
    };

    // Submit score to leaderboard - returns completion status
    const submitScoreToLeaderboard = async () => {
        // Get user info from localStorage
        const username = localStorage.getItem('username');
        const userId = localStorage.getItem('user_id');
        const characterId = localStorage.getItem('selected_character_id') || 1;

        console.log('=== SUBMITTING TO LEADERBOARD ===');
        console.log('Username:', username);
        console.log('User ID:', userId);
        console.log('Character ID:', characterId);
        console.log('Session Score:', sessionScore);
        console.log('Current Level:', currentLevelNumber);

        if (!username) {
            console.error('No username found in localStorage');
            return { already_completed: false };
        }

        // Don't submit if score is 0
        if (sessionScore === 0) {
            console.log('No score to submit (0 points)');
            return { already_completed: false };
        }

        try {
            const payload = {
                user_id: userId ? parseInt(userId) : null,
                username: username,
                score: sessionScore,
                level_completed: currentLevelNumber,
                character_id: characterId ? parseInt(characterId) : 1
            };

            console.log('Payload being sent:', payload);

            const response = await axios.post(
                'https://shadow-stack.onrender.com/api/leaderboard',
                payload
            );

            console.log('✅ Score submitted successfully:', response.data);

            // Return whether level was already completed
            return {
                already_completed: response.data.already_completed || false
            };
        } catch (err) {
            console.error(
                '❌ Error submitting score:',
                err.response?.data || err.message
            );
            return { already_completed: false };
        }
    };

    // Advances to the next question if the game is not over and level is not complete
    const handleNextQuestion = () => {
        // Game over condition
        if (threatLevel === 3) {
            return;
        }

        // Level complete condition
        if (correctAnswers >= QUESTIONS_TO_COMPLETE) {
            return;
        }

        fetchQuestion(currentLevelNumber);
    };

    // Handles level completion logic
    const handleCompleteLevel = async () => {
        // If already completed flag is set, just return to menu
        if (levelAlreadyCompleted) {
            navigate('/levels');
            return;
        }

        // Submit score to leaderboard and get completion status
        const result = await submitScoreToLeaderboard();

        // If level was already completed, don't proceed to next level
        if (result.already_completed) {
            console.log('ℹ️ Level already completed - not unlocking next level');
            return; // Stay on current screen - user will see the warning message
        }

        // Level is newly completed - proceed with unlocking
        const unlocked = unlockNextLevel(currentLevelNumber);

        // If there's a next level, go to it; otherwise return to levels menu
        if (unlocked && currentLevelNumber < 7) {
            const nextLevel = currentLevelNumber + 1;

            // Reset game states for new level but keep cumulative score
            setThreatLevel(0);
            setQuestionsAnswered(0);
            setCorrectAnswers(0);
            setSelectedAnswer(null);
            setShowExplanation(false);
            setCurrentLevelNumber(nextLevel);
            setSessionScore(0); // Reset session score for new level
            setLevelAlreadyCompleted(false); // Reset flag for new level

            // Fetch first question of next level
            fetchQuestion(nextLevel);
        } else {
            // Return to level selection menu
            navigate('/levels');
        }
    };

    // Navigates back to the level selection menu
    const handleBackToLevels = async () => {
        // Submit score if user completed at least one question
        if (sessionScore > 0 && !levelAlreadyCompleted) {
            await submitScoreToLeaderboard();
        }
        navigate('/levels');
    };

    // Gets the threat status label and color based on current threat level
    const getThreatStatus = () => {
        switch (threatLevel) {
            case 0:
                return { label: 'SECURE', color: '#22c55e' };
            case 1:
                return { label: 'LOW THREAT', color: '#eab308' };
            case 2:
                return { label: 'HIGH THREAT', color: '#f97316' };
            case 3:
                return { label: 'CRITICAL', color: '#ef4444' };
            default:
                return { label: 'SECURE', color: '#22c55e' };
        }
    };

    // Renders the threat meter UI component
    const renderThreatMeter = () => {
        const threatStatus = getThreatStatus();
        const percentage = (threatLevel / 3) * 100;

        return (
            <div className="threat-meter-container">
                <div className="threat-meter-label">
                    <span className="threat-icon">🛡️</span>
                    <span
                        className="threat-status fw-bold"
                        style={{ color: threatStatus.color }}
                    >
                        {threatStatus.label}
                    </span>
                </div>
                <div className="threat-meter-bar">
                    <div
                        className={`threat-meter-fill d-flex align-items-center justify-content-center threat-level-${threatLevel}`}
                        style={{
                            width: `${percentage}%`,
                            backgroundColor: threatStatus.color
                        }}
                    >
                        {threatLevel > 0 && (
                            <span className="threat-meter-text fw-bold">
                                {threatLevel}/3
                            </span>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Main UI return
    return (
        <div className="simulator-container">
            <div className="background-blob blob-1"></div>
            <div className="background-blob blob-2"></div>

            <div className="container">
                <div className="text-center mb-5">
                    <h1 className="main-title text-white fw-bold">Simulator</h1>
                    <p className="main-subtitle">
                        Test your cybersecurity knowledge and defend against real-world
                        attacks
                    </p>

                    <button className="back-button" onClick={handleBackToLevels}>
                        ← Back to Levels
                    </button>

                    <div className="level-progress">
                        <span className="progress-text">
                            Progress: {questionsAnswered}/{QUESTIONS_TO_COMPLETE}
                        </span>
                        <span className="score-text fw-bold">
                            Score: {sessionScore} pts
                        </span>
                        <span className="points-per-question">
                            (+{getPointsForLevel(currentLevelNumber)} pts per correct
                            answer)
                        </span>
                    </div>
                </div>

                {currentQuestion && !loading && (
                    <div className="question-display">
                        <div className="question-card">
                            <div className="question-header d-flex justify-content-between">
                                <div className="question-header-left">
                                    <h2 className="question-title text-primary">
                                        Level {currentQuestion.level}{' '}
                                        {'⭐'.repeat(currentQuestion.level)}
                                    </h2>
                                    {currentQuestion.category && (
                                        <span className="question-category">
                                            {currentQuestion.category}
                                        </span>
                                    )}
                                </div>
                                <div className="progress-bar">{renderThreatMeter()}</div>
                            </div>

                            <p className="question-text fs-4">
                                {currentQuestion.question_text}
                            </p>

                            <div className="answer-options">
                                {currentQuestion.option_a && (
                                    <button
                                        className={`option-button ${
                                            selectedAnswer === 'A'
                                                ? currentQuestion.correct_answer === 'A'
                                                    ? 'correct'
                                                    : 'incorrect'
                                                : ''
                                        } ${
                                            showExplanation &&
                                            currentQuestion.correct_answer === 'A'
                                                ? 'correct'
                                                : ''
                                        }`}
                                        onClick={() => handleAnswerSelect('A')}
                                        disabled={selectedAnswer !== null}
                                    >
                                        A) {currentQuestion.option_a}
                                    </button>
                                )}
                                {currentQuestion.option_b && (
                                    <button
                                        className={`option-button ${
                                            selectedAnswer === 'B'
                                                ? currentQuestion.correct_answer === 'B'
                                                    ? 'correct'
                                                    : 'incorrect'
                                                : ''
                                        } ${
                                            showExplanation &&
                                            currentQuestion.correct_answer === 'B'
                                                ? 'correct'
                                                : ''
                                        }`}
                                        onClick={() => handleAnswerSelect('B')}
                                        disabled={selectedAnswer !== null}
                                    >
                                        B) {currentQuestion.option_b}
                                    </button>
                                )}
                                {currentQuestion.option_c && (
                                    <button
                                        className={`option-button ${
                                            selectedAnswer === 'C'
                                                ? currentQuestion.correct_answer === 'C'
                                                    ? 'correct'
                                                    : 'incorrect'
                                                : ''
                                        } ${
                                            showExplanation &&
                                            currentQuestion.correct_answer === 'C'
                                                ? 'correct'
                                                : ''
                                        }`}
                                        onClick={() => handleAnswerSelect('C')}
                                        disabled={selectedAnswer !== null}
                                    >
                                        C) {currentQuestion.option_c}
                                    </button>
                                )}
                                {currentQuestion.option_d && (
                                    <button
                                        className={`option-button ${
                                            selectedAnswer === 'D'
                                                ? currentQuestion.correct_answer === 'D'
                                                    ? 'correct'
                                                    : 'incorrect'
                                                : ''
                                        } ${
                                            showExplanation &&
                                            currentQuestion.correct_answer === 'D'
                                                ? 'correct'
                                                : ''
                                        }`}
                                        onClick={() => handleAnswerSelect('D')}
                                        disabled={selectedAnswer !== null}
                                    >
                                        D) {currentQuestion.option_d}
                                    </button>
                                )}
                            </div>

                            {showExplanation && (
                                <div className="explanation-section">
                                    {correctAnswers >= QUESTIONS_TO_COMPLETE ? (
                                        levelAlreadyCompleted ? (
                                            <div
                                                className="result-banner completion-banner d-flex align-items-center text-white"
                                                style={{ backgroundColor: '#f59e0b' }}
                                            >
                                                <span className="result-text">
                                                    ⚠️ You have already completed this
                                                    level. No points awarded.
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="result-banner completion-banner d-flex align-items-center text-white">
                                                <span className="result-text">
                                                    🎉 Congratulations! You've completed
                                                    Level {currentQuestion.level}!
                                                    {currentLevelNumber < 7
                                                        ? ' Moving to next level...'
                                                        : ' You completed all levels!'}
                                                </span>
                                            </div>
                                        )
                                    ) : threatLevel === 3 ? (
                                        <div className="result-banner game-over-banner d-flex align-items-center text-white">
                                            <span className="result-text">
                                                ⚠️ Maximum Threat Level Reached! Game
                                                Over.
                                            </span>
                                        </div>
                                    ) : (
                                        <div
                                            className={`result-banner d-flex align-items-center ${
                                                selectedAnswer ===
                                                currentQuestion.correct_answer
                                                    ? 'correct-banner'
                                                    : 'incorrect-banner'
                                            }`}
                                        >
                                            {selectedAnswer ===
                                            currentQuestion.correct_answer ? (
                                                <span className="result-text">
                                                    ✅ Correct! +
                                                    {getPointsForLevel(
                                                        currentLevelNumber
                                                    )}{' '}
                                                    pts
                                                </span>
                                            ) : (
                                                <span className="result-text">
                                                    ❌ Incorrect. The correct answer is{' '}
                                                    {currentQuestion.correct_answer}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {currentQuestion.explanation && (
                                        <div className="explanation-content">
                                            <h4 className="explanation-title">
                                                Explanation:
                                            </h4>
                                            <p className="explanation-text">
                                                {currentQuestion.explanation}
                                            </p>
                                        </div>
                                    )}

                                    <div className="action-buttons d-flex">
                                        {correctAnswers >= QUESTIONS_TO_COMPLETE ? (
                                            currentLevelNumber < 7 &&
                                            !levelAlreadyCompleted ? (
                                                <button
                                                    className="next-question-button completion-button"
                                                    onClick={handleCompleteLevel}
                                                >
                                                    Continue to Next Level →
                                                </button>
                                            ) : (
                                                <button
                                                    className="next-question-button completion-button"
                                                    onClick={handleBackToLevels}
                                                >
                                                    Return to Levels Menu →
                                                </button>
                                            )
                                        ) : threatLevel === 3 ? (
                                            <button
                                                className="next-question-button game-over-button"
                                                onClick={handleBackToLevels}
                                            >
                                                Game Over - Return to Levels
                                            </button>
                                        ) : (
                                            <button
                                                className="next-question-button"
                                                onClick={handleNextQuestion}
                                            >
                                                Next Question →
                                            </button>
                                        )}
                                        <button
                                            className="change-level-button"
                                            onClick={handleBackToLevels}
                                        >
                                            Change Level
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger mt-3 text-center">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Simulator;
