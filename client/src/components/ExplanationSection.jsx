function ExplanationSection({
    correctAnswers,
    questionsToComplete,
    threatLevel,
    levelAlreadyCompleted,
    currentLevel,
    maxLevel,
    selectedAnswer,
    correctAnswer,
    explanation,
    onNextQuestion,
    onCompleteLevel,
    onBackToLevels
}) {
    const renderStatusBanner = () => {
        if (correctAnswers >= questionsToComplete) {
            if (levelAlreadyCompleted) {
                return (
                    <div
                        className="result-banner completion-banner d-flex align-items-center text-white"
                        style={{ backgroundColor: '#f59e0b' }}
                    >
                        <span className="result-text">
                            ⚠️ You have already completed this level. No points awarded.
                        </span>
                    </div>
                );
            }
            return (
                <div className="result-banner completion-banner d-flex align-items-center text-white celebration-banner">
                    <span className="result-text">
                        🎉 Congratulations! You've completed Level {currentLevel}!
                        {currentLevel < maxLevel
                            ? ' Moving to next level...'
                            : ' You completed all levels!'}
                    </span>
                </div>
            );
        }

        if (threatLevel === 3) {
            return (
                <div className="result-banner game-over-banner d-flex align-items-center text-white">
                    <span className="result-text">
                        ⚠️ Maximum Threat Level Reached! Game Over.
                    </span>
                </div>
            );
        }

        if (selectedAnswer !== correctAnswer) {
            return (
                <div className="result-banner d-flex align-items-center incorrect-banner">
                    <span className="result-text">
                        ❌ Incorrect. The correct answer is {correctAnswer}
                    </span>
                </div>
            );
        }

        return null;
    };

    const renderActionButtons = () => {
        if (correctAnswers >= questionsToComplete) {
            if (currentLevel < maxLevel && !levelAlreadyCompleted) {
                return (
                    <button
                        className="next-question-button completion-button"
                        onClick={onCompleteLevel}
                    >
                        Continue to Next Level →
                    </button>
                );
            }
            return (
                <button
                    className="next-question-button completion-button"
                    onClick={onBackToLevels}
                >
                    Return to Levels Menu →
                </button>
            );
        }

        if (threatLevel === 3) {
            return (
                <button
                    className="next-question-button game-over-button"
                    onClick={onBackToLevels}
                >
                    Game Over - Return to Levels
                </button>
            );
        }

        return (
            <button
                className="next-question-button"
                onClick={onNextQuestion}
            >
                Next Question →
            </button>
        );
    };

    return (
        <div className="explanation-section">
            {renderStatusBanner()}

            {explanation && (
                <div className="explanation-content">
                    <h4 className="explanation-title">Explanation:</h4>
                    <p className="explanation-text">{explanation}</p>
                </div>
            )}

            <div className="action-buttons d-flex">
                {renderActionButtons()}
                <button
                    className="change-level-button"
                    onClick={onBackToLevels}
                >
                    Change Level
                </button>
            </div>
        </div>
    );
}

export default ExplanationSection;