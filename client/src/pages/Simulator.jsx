import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../styles/Simulator.css";
import axios from 'axios';
import Effects from '../components/Effects';
import SimulatorHeader from '../components/SimulatorHeader';
import QuestionCard from '../components/QuestionCard';
import ExplanationSection from '../components/ExplanationSection';

function Simulator() {
    const location = useLocation();
    const navigate = useNavigate();
    const level = location.state?.level ?? 1;

    // State management
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [threatLevel, setThreatLevel] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [currentLevelNumber, setCurrentLevelNumber] = useState(level);
    const [sessionScore, setSessionScore] = useState(0);
    const [levelAlreadyCompleted, setLevelAlreadyCompleted] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showCorrectAnimation, setShowCorrectAnimation] = useState(false);

    // Constants
    const QUESTIONS_TO_COMPLETE = 5;
    const MAX_LEVEL = 7;
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Calculate points per question based on level
    const pointsPerQuestion = 50 * Math.pow(2, currentLevelNumber - 1);

    // Confetti effect
    useEffect(() => {
        if (showConfetti) {
            const timer = setTimeout(() => setShowConfetti(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [showConfetti]);

    // Correct answer animation
    useEffect(() => {
        if (showCorrectAnimation) {
            const timer = setTimeout(() => setShowCorrectAnimation(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [showCorrectAnimation]);

    // Initialize the simulator when component mounts or level changes
    useEffect(() => {
        const checkLevelCompletion = async () => {
            if (level) {
                fetchQuestion(level);
                setCurrentLevelNumber(level);

                // Check if level was already completed before
                const userId = localStorage.getItem('user_id');
                if (userId) {
                    try {
                        const response = await axios.get(
                            `https://shadow-stack.onrender.com/api/leaderboard/check-completion?user_id=${userId}&level=${level}`
                        );
                        setLevelAlreadyCompleted(response.data.completed || false);
                    } catch (err) {
                        console.error('Error checking completion:', err);
                        setLevelAlreadyCompleted(false);
                    }
                } else {
                    setLevelAlreadyCompleted(false);
                }
            }
        };

        checkLevelCompletion();
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

        const isCorrect = answer === currentQuestion.correct_answer;

        if (isCorrect) {
            setShowCorrectAnimation(true);
            const newCorrectAnswers = correctAnswers + 1;
            setCorrectAnswers(newCorrectAnswers);

            // Only add points if level wasn't already completed
            if (!levelAlreadyCompleted) {
                setSessionScore((prev) => prev + pointsPerQuestion);
            }

            // Check if level completed (5 questions answered correctly)
            if (newCorrectAnswers >= QUESTIONS_TO_COMPLETE) {
                // Only show confetti if this is a fresh completion
                if (!levelAlreadyCompleted) {
                    setShowConfetti(true);
                }
            }
        } else {
            setThreatLevel((prev) => Math.min(3, prev + 1));
        }
    };

    // Unlocks the next level in localStorage if conditions are met
    const unlockNextLevel = (currentLevel) => {
        const username = localStorage.getItem('username');
        const STORAGE_KEY = username
            ? `maxUnlockedLevel_${username}`
            : 'maxUnlockedLevel_guest';

        const maxUnlocked = parseInt(localStorage.getItem(STORAGE_KEY) || '1', 10);
        const nextLevel = currentLevel + 1;

        if (nextLevel > maxUnlocked && nextLevel <= MAX_LEVEL) {
            localStorage.setItem(STORAGE_KEY, nextLevel.toString());
            return true;
        }
        return false;
    };

    // Submit score to leaderboard
    const submitScoreToLeaderboard = async (isLevelComplete = false) => {
        const username = localStorage.getItem('username');
        const userId = localStorage.getItem('user_id');
        const characterId = localStorage.getItem('selected_character_id') || 1;

        if (!username || sessionScore === 0) {
            return { already_completed: false };
        }

        try {
            const payload = {
                user_id: userId ? parseInt(userId) : null,
                username: username,
                score: sessionScore,
                level_completed: isLevelComplete ? currentLevelNumber : null,
                character_id: characterId ? parseInt(characterId) : 1
            };

            const response = await axios.post(
                'https://shadow-stack.onrender.com/api/leaderboard',
                payload
            );

            return {
                already_completed: response.data.already_completed || false
            };
        } catch (err) {
            console.error('Error submitting score:', err.response?.data || err.message);
            return { already_completed: false };
        }
    };

    // Advances to the next question
    const handleNextQuestion = () => {
        if (threatLevel === 3 || correctAnswers >= QUESTIONS_TO_COMPLETE) {
            return;
        }
        fetchQuestion(currentLevelNumber);
    };

    // Handles level completion logic
    const handleCompleteLevel = async () => {
        if (levelAlreadyCompleted) {
            navigate('/levels');
            return;
        }

        const result = await submitScoreToLeaderboard(true);

        if (result.already_completed) {
            return;
        }

        const unlocked = unlockNextLevel(currentLevelNumber);

        if (unlocked && currentLevelNumber < MAX_LEVEL) {
            const nextLevel = currentLevelNumber + 1;
            setThreatLevel(0);
            setCorrectAnswers(0);
            setSelectedAnswer(null);
            setShowExplanation(false);
            setCurrentLevelNumber(nextLevel);
            setSessionScore(0);
            setLevelAlreadyCompleted(false);
            fetchQuestion(nextLevel);
        } else {
            navigate('/levels');
        }
    };

    // Navigates back to the level selection menu
    const handleBackToLevels = async () => {
        if (correctAnswers >= QUESTIONS_TO_COMPLETE && !levelAlreadyCompleted) {
            const result = await submitScoreToLeaderboard(true);
            if (!result.already_completed) {
                unlockNextLevel(currentLevelNumber);
            }
        } else if (sessionScore > 0 && correctAnswers < QUESTIONS_TO_COMPLETE && !levelAlreadyCompleted) {
            await submitScoreToLeaderboard(false);
        }
        navigate('/levels');
    };

    // Main UI return
    return (
        <div className="simulator-container">
            <div className="background-blob blob-1"></div>
            <div className="background-blob blob-2"></div>

            <Effects
                showConfetti={showConfetti}
                showCorrectAnimation={showCorrectAnimation}
                points={pointsPerQuestion}
                levelAlreadyCompleted={levelAlreadyCompleted}
            />

            <div className="container">
                <SimulatorHeader
                    correctAnswers={correctAnswers}
                    questionsToComplete={QUESTIONS_TO_COMPLETE}
                    sessionScore={sessionScore}
                    pointsPerQuestion={pointsPerQuestion}
                    onBackToLevels={handleBackToLevels}
                />

                {currentQuestion && !loading && (
                    <div className="question-display">
                        <QuestionCard
                            question={currentQuestion}
                            selectedAnswer={selectedAnswer}
                            showExplanation={showExplanation}
                            threatLevel={threatLevel}
                            onAnswerSelect={handleAnswerSelect}
                        />

                        {showExplanation && (
                            <ExplanationSection
                                correctAnswers={correctAnswers}
                                questionsToComplete={QUESTIONS_TO_COMPLETE}
                                threatLevel={threatLevel}
                                levelAlreadyCompleted={levelAlreadyCompleted}
                                currentLevel={currentLevelNumber}
                                maxLevel={MAX_LEVEL}
                                selectedAnswer={selectedAnswer}
                                correctAnswer={currentQuestion.correct_answer}
                                explanation={currentQuestion.explanation}
                                onNextQuestion={handleNextQuestion}
                                onCompleteLevel={handleCompleteLevel}
                                onBackToLevels={handleBackToLevels}
                            />
                        )}
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