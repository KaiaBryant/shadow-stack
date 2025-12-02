import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../styles/Simulator.css"
import axios from 'axios';

function Simulator() {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedLevel = location.state?.level || 1;

    // State management
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [threatLevel, setThreatLevel] = useState(0);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [currentLevelNumber, setCurrentLevelNumber] = useState(selectedLevel);
    // Creates unique session id
    // Helps backend track which questions have alraedy been shown to the user
    // Without it, the backend won't remember which questions and will repeat itself
    const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

    const QUESTIONS_TO_COMPLETE = 5;

    // Initialize the simulator when component mounts or level changes
    // Fetches the first question for the selected level
    useEffect(() => {
        if (selectedLevel) {
            fetchQuestion(selectedLevel);
            setCurrentLevelNumber(selectedLevel);
        }
    }, [selectedLevel]);

    // Fetches a random question from the backend for the specified level
    // level - The difficulty level (1-7)
    const fetchQuestion = async (level) => {
        setLoading(true);
        setError(null);
        setSelectedAnswer(null);
        setShowExplanation(false);

        try {
            const response = await axios.get(`http://localhost:5000/api/questions/${level}?sessionId=${sessionId}`);
            setCurrentQuestion(response.data);
        } catch (err) {
            console.error("Error fetching question:", err);
            setError("Failed to load question. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handles user's answer selection
    // Updates threat level if incorrect, increments correct answers if correct
    // answer - The selected answer option ('A', 'B', 'C', or 'D')
    const handleAnswerSelect = (answer) => {
        setSelectedAnswer(answer);
        setShowExplanation(true);
        setQuestionsAnswered(prev => prev + 1);

        const isCorrect = answer === currentQuestion.correct_answer;

        if (isCorrect) {
            setCorrectAnswers(prev => prev + 1);
        } else {
            setThreatLevel(prev => Math.min(3, prev + 1));
        }
    };

    // Unlocks the next level in localStorage if conditions are met
    // currentLevel - The level that was just completed
    // True if a new level was unlocked, false otherwise
    const unlockNextLevel = (currentLevel) => {
        const maxUnlocked = parseInt(localStorage.getItem('maxUnlockedLevel') || '1', 10);
        const nextLevel = currentLevel + 1;

        if (nextLevel > maxUnlocked && nextLevel <= 7) {
            localStorage.setItem('maxUnlockedLevel', nextLevel.toString());
            return true;
        }
        return false;
    };

    // Advances to the next question if the game is not over and level is not complete
    // Prevents progression if threat level is at maximum or level is completed
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
    // Either progresses to next level automatically or returns to level menu
    const handleCompleteLevel = () => {
        const unlocked = unlockNextLevel(currentLevelNumber);

        // If there's a next level, go to it; otherwise return to levels menu
        if (unlocked && currentLevelNumber < 7) {
            const nextLevel = currentLevelNumber + 1;

            // Reset all game states for new level
            setThreatLevel(0);
            setQuestionsAnswered(0);
            setCorrectAnswers(0);
            setSelectedAnswer(null);
            setShowExplanation(false);
            setCurrentLevelNumber(nextLevel);

            // Fetch first question of next level
            fetchQuestion(nextLevel);
        } else {
            // Return to level selection menu
            navigate('/levels');
        }
    };

    // Navigates back to the level selection menu
    const handleBackToLevels = () => {
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
    // Displays current threat level with visual progress bar
    const renderThreatMeter = () => {
        const threatStatus = getThreatStatus();
        const percentage = (threatLevel / 3) * 100;

        // Helper func that returns JSX not the main 
        return (
            <div className="threat-meter-container">
                <div className="threat-meter-label">
                    <span className="threat-icon">🛡️</span>
                    <span className="threat-status fw-bold" style={{ color: threatStatus.color }}>
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
                            <span className="threat-meter-text fw-bold">{threatLevel}/3</span>
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
                        Test your cybersecurity knowledge and defend against real-world attacks
                    </p>

                    <button className="back-button" onClick={handleBackToLevels}>
                        ← Back to Levels
                    </button>

                    <div className="level-progress">
                        <span className="progress-text">
                            Progress: {questionsAnswered}/{QUESTIONS_TO_COMPLETE}
                        </span>
                    </div>
                </div>

                {currentQuestion && !loading && (
                    <div className="question-display">
                        <div className="question-card">
                            <div className="question-header d-flex justify-content-between">
                                <div className="question-header-left">
                                    <h2 className="question-title text-primary">
                                        Level {currentQuestion.level} {'⭐'.repeat(currentQuestion.level)}
                                    </h2>
                                    {currentQuestion.category && (
                                        <span className="question-category">
                                            {currentQuestion.category}
                                        </span>
                                    )}
                                </div>
                                <div className="progress-bar">
                                    {renderThreatMeter()}
                                </div>
                            </div>

                            <p className="question-text fs-4">{currentQuestion.question_text}</p>

                            <div className="answer-options">
                                {currentQuestion.option_a && (
                                    <button
                                        className={`option-button ${selectedAnswer === 'A'
                                            ? currentQuestion.correct_answer === 'A'
                                                ? 'correct'
                                                : 'incorrect'
                                            : ''
                                            } ${showExplanation && currentQuestion.correct_answer === 'A' ? 'correct' : ''}`}
                                        onClick={() => handleAnswerSelect('A')}
                                        disabled={selectedAnswer !== null}
                                    >
                                        A) {currentQuestion.option_a}
                                    </button>
                                )}
                                {currentQuestion.option_b && (
                                    <button
                                        className={`option-button ${selectedAnswer === 'B'
                                            ? currentQuestion.correct_answer === 'B'
                                                ? 'correct'
                                                : 'incorrect'
                                            : ''
                                            } ${showExplanation && currentQuestion.correct_answer === 'B' ? 'correct' : ''}`}
                                        onClick={() => handleAnswerSelect('B')}
                                        disabled={selectedAnswer !== null}
                                    >
                                        B) {currentQuestion.option_b}
                                    </button>
                                )}
                                {currentQuestion.option_c && (
                                    <button
                                        className={`option-button ${selectedAnswer === 'C'
                                            ? currentQuestion.correct_answer === 'C'
                                                ? 'correct'
                                                : 'incorrect'
                                            : ''
                                            } ${showExplanation && currentQuestion.correct_answer === 'C' ? 'correct' : ''}`}
                                        onClick={() => handleAnswerSelect('C')}
                                        disabled={selectedAnswer !== null}
                                    >
                                        C) {currentQuestion.option_c}
                                    </button>
                                )}
                                {currentQuestion.option_d && (
                                    <button
                                        className={`option-button ${selectedAnswer === 'D'
                                            ? currentQuestion.correct_answer === 'D'
                                                ? 'correct'
                                                : 'incorrect'
                                            : ''
                                            } ${showExplanation && currentQuestion.correct_answer === 'D' ? 'correct' : ''}`}
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
                                        <div className="result-banner completion-banner d-flex align-items-center">
                                            <span className="result-text">
                                                🎉 Congratulations! You've completed Level {currentQuestion.level}!
                                                {currentLevelNumber < 7 ? ' Moving to next level...' : ' You completed all levels!'}
                                            </span>
                                        </div>
                                    ) : threatLevel === 3 ? (
                                        <div className="result-banner game-over-banner d-flex align-items-center">
                                            <span className="result-text">
                                                ⚠️ Maximum Threat Level Reached! Game Over.
                                            </span>
                                        </div>
                                    ) : (
                                        <div className={`result-banner d-flex align-items-center ${selectedAnswer === currentQuestion.correct_answer
                                            ? 'correct-banner'
                                            : 'incorrect-banner'
                                            }`}>
                                            {selectedAnswer === currentQuestion.correct_answer ? (
                                                <span className="result-text">✅ Correct! Well done!</span>
                                            ) : (
                                                <span className="result-text">
                                                    ❌ Incorrect. The correct answer is {currentQuestion.correct_answer}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {currentQuestion.explanation && (
                                        <div className="explanation-content">
                                            <h4 className="explanation-title">Explanation:</h4>
                                            <p className="explanation-text">
                                                {currentQuestion.explanation}
                                            </p>
                                        </div>
                                    )}

                                    <div className="action-buttons d-flex">
                                        {correctAnswers >= QUESTIONS_TO_COMPLETE ? (
                                            currentLevelNumber < 7 ? (
                                                <button className="next-question-button completion-button" onClick={handleCompleteLevel}>
                                                    Continue to Next Level →
                                                </button>
                                            ) : (
                                                <button className="next-question-button completion-button" onClick={handleBackToLevels}>
                                                    Return to Levels Menu →
                                                </button>
                                            )
                                        ) : threatLevel === 3 ? (
                                            <button className="next-question-button game-over-button" onClick={handleBackToLevels}>
                                                Game Over - Return to Levels
                                            </button>
                                        ) : (
                                            <button className="next-question-button" onClick={handleNextQuestion}>
                                                Next Question →
                                            </button>
                                        )}
                                        <button className="change-level-button" onClick={handleBackToLevels}>
                                            Change Level
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Simulator;