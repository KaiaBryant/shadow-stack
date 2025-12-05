import ThreatMeter from './ThreatMeter';

function QuestionCard({ 
    question, 
    selectedAnswer, 
    showExplanation, 
    threatLevel,
    onAnswerSelect 
}) {
    const renderAnswerButton = (option, letter) => {
        if (!option) return null;

        const isSelected = selectedAnswer === letter;
        const isCorrect = question.correct_answer === letter;
        
        let buttonClass = 'option-button';
        if (isSelected) {
            buttonClass += isCorrect ? ' correct' : ' incorrect';
        }
        if (showExplanation && isCorrect) {
            buttonClass += ' correct';
        }

        return (
            <button
                className={buttonClass}
                onClick={() => onAnswerSelect(letter)}
                disabled={selectedAnswer !== null}
            >
                {letter}) {option}
            </button>
        );
    };

    return (
        <div className="question-card">
            <div className="question-header d-flex justify-content-between">
                <div className="question-header-left">
                    <h2 className="question-title text-primary">
                        Level {question.level} {'⭐'.repeat(question.level)}
                    </h2>
                    {question.category && (
                        <span className="question-category">
                            {question.category}
                        </span>
                    )}
                </div>
                <div className="progress-bar">
                    <ThreatMeter threatLevel={threatLevel} />
                </div>
            </div>

            <p className="question-text fs-4">{question.question_text}</p>

            <div className="answer-options">
                {renderAnswerButton(question.option_a, 'A')}
                {renderAnswerButton(question.option_b, 'B')}
                {renderAnswerButton(question.option_c, 'C')}
                {renderAnswerButton(question.option_d, 'D')}
            </div>
        </div>
    );
}

export default QuestionCard;