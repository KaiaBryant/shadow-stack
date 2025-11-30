import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../styles/Simulator.css"
import { difficultyCards } from '../data/simulatorData';
import axios from 'axios';

function Simulator() {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedLevel = location.state?.level || 1;

    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [username, setUsername] = useState('');
    const [health, setHealth] = useState(3);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);
    const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }

        if (selectedLevel) {
            fetchQuestion(selectedLevel);
        }
    }, [selectedLevel]);

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

    const handleCardClick = (card) => {
        setSelectedQuestion(card);
        fetchQuestion(card.id);
        setHealth(3);
        setQuestionsAnswered(0);
    };

    const handleAnswerSelect = (answer) => {
        setSelectedAnswer(answer);
        setShowExplanation(true);
        setQuestionsAnswered(prev => prev + 1);

        if (answer !== currentQuestion.correct_answer) {
            setHealth(prev => Math.max(0, prev - 1));
        }
    };

    const handleNextQuestion = () => {
        if (health === 0) {
            alert('Game Over! Returning to level selection.');
            navigate('/levels');
            return;
        }

        const levelToFetch = selectedQuestion ? selectedQuestion.id : selectedLevel;
        fetchQuestion(levelToFetch);
    };

    const handleBackToLevels = () => {
        navigate('/levels');
    };

    const renderHearts = () => {
        const hearts = [];
        for (let i = 0; i < 3; i++) {
            hearts.push(
                <span key={i} className="heart-icon">
                    {i < health ? '❤️' : '🖤'}
                </span>
            );
        }
        return hearts;
    };

    return (
        <div className="simulator-container">
            <div className="background-blob blob-1"></div>
            <div className="background-blob blob-2"></div>

            <div className="container content-wrapper">
                <div className="text-center mb-5">
                    <h1 className="main-title">Simulator</h1>
                    <p className="main-subtitle">
                        Test your cybersecurity knowledge and defend against real-world attacks
                    </p>
                    
                    <button className="back-button" onClick={handleBackToLevels}>
                        ← Back to Levels
                    </button>
                </div>

                <div className="row g-4 position-relative mb-5">
                    <div className="col-md-6">
                        <div
                            className={`simulator-card ${selectedQuestion?.id === 1 || (!selectedQuestion && selectedLevel === 1) ? 'active' : ''}`}
                            onClick={() => handleCardClick(difficultyCards[0])}
                        >
                            <div className="card-header-section">
                                <div className="card-icon">
                                    {difficultyCards[0].icon}
                                </div>
                                <h2 className="card-number">
                                    {difficultyCards[0].number}
                                </h2>
                            </div>
                            <h3 className="card-title text-primary">
                                {difficultyCards[0].stars} {difficultyCards[0].title}
                            </h3>
                            <p className="card-description">
                                {difficultyCards[0].description}
                            </p>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div
                            className={`simulator-card ${selectedQuestion?.id === 2 || (!selectedQuestion && selectedLevel === 2) ? 'active' : ''}`}
                            onClick={() => handleCardClick(difficultyCards[1])}
                        >
                            <div className="card-header-section">
                                <div className="card-icon">
                                    {difficultyCards[1].icon}
                                </div>
                                <h2 className="card-number">
                                    {difficultyCards[1].number}
                                </h2>
                            </div>
                            <h3 className="card-title text-primary">
                                {difficultyCards[1].stars} {difficultyCards[1].title}
                            </h3>
                            <p className="card-description">
                                {difficultyCards[1].description}
                            </p>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div
                            className={`simulator-card ${selectedQuestion?.id === 4 || (!selectedQuestion && selectedLevel === 4) ? 'active' : ''}`}
                            onClick={() => handleCardClick(difficultyCards[2])}
                        >
                            <div className="card-header-section">
                                <div className="card-icon">
                                    {difficultyCards[2].icon}
                                </div>
                                <h2 className="card-number">
                                    {difficultyCards[2].number}
                                </h2>
                            </div>
                            <h3 className="card-title text-primary">
                                {difficultyCards[2].stars} {difficultyCards[2].title}
                            </h3>
                            <p className="card-description">
                                {difficultyCards[2].description}
                            </p>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div
                            className={`simulator-card ${selectedQuestion?.id === 7 || (!selectedQuestion && selectedLevel === 7) ? 'active' : ''}`}
                            onClick={() => handleCardClick(difficultyCards[3])}
                        >
                            <div className="card-header-section">
                                <div className="card-icon">
                                    {difficultyCards[3].icon}
                                </div>
                                <h2 className="card-number">
                                    {difficultyCards[3].number}
                                </h2>
                            </div>
                            <h3 className="card-title text-primary">
                                {difficultyCards[3].stars} {difficultyCards[3].title}
                            </h3>
                            <p className="card-description">
                                {difficultyCards[3].description}
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="status-indicator error-indicator">
                        <p className="status-text">
                            ⚠️ {error}
                        </p>
                    </div>
                )}

                {currentQuestion && !loading && (
                    <div className="question-display">
                        <div className="question-card">
                            <div className="question-header">
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
                                <div className="health-container">
                                    {renderHearts()}
                                </div>
                            </div>

                            <p className="question-text">{currentQuestion.question_text}</p>

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
                                    <div className={`result-banner ${selectedAnswer === currentQuestion.correct_answer
                                        ? 'correct-banner'
                                        : 'incorrect-banner'
                                        }`}>
                                        {selectedAnswer === currentQuestion.correct_answer ? (
                                            <>
                                                <span className="result-text">✅ Correct! Well done!</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="result-text">
                                                    ❌ Incorrect. The correct answer is {currentQuestion.correct_answer}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {currentQuestion.explanation && (
                                        <div className="explanation-content">
                                            <h4 className="explanation-title">Explanation:</h4>
                                            <p className="explanation-text">
                                                {currentQuestion.explanation}
                                            </p>
                                        </div>
                                    )}

                                    <div className="action-buttons">
                                        {health > 0 ? (
                                            <button
                                                className="next-question-button"
                                                onClick={handleNextQuestion}
                                            >
                                                Next Question →
                                            </button>
                                        ) : (
                                            <button
                                                className="next-question-button game-over-button"
                                                onClick={handleBackToLevels}
                                            >
                                                Game Over - Return to Levels
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
            </div>
        </div>
    );
}

export default Simulator;