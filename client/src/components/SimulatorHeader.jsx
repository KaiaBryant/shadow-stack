function SimulatorHeader({ 
    correctAnswers, 
    questionsToComplete, 
    sessionScore, 
    pointsPerQuestion,
    onBackToLevels 
}) {
    return (
        <div className="text-center mb-5">
            <h1 className="main-title text-white fw-bold">Simulator</h1>
            <p className="main-subtitle">
                Test your cybersecurity knowledge and defend against real-world attacks
            </p>

            <button className="back-button" onClick={onBackToLevels}>
                ← Back to Levels
            </button>

            <div className="level-progress">
                <span className="progress-text">
                    Progress: {correctAnswers}/{questionsToComplete}
                </span>
                <span className="score-text fw-bold">
                    Score: {sessionScore} pts
                </span>
                <span className="points-per-question">
                    (+{pointsPerQuestion} pts per correct answer)
                </span>
            </div>
        </div>
    );
}

export default SimulatorHeader;