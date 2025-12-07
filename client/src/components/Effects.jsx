import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import '../styles/Effects.css';

function Effects({ showConfetti, showCorrectAnimation, points, levelAlreadyCompleted }) {
    const confettiTriggered = useRef(false);

    useEffect(() => {
        if (showConfetti && !confettiTriggered.current) {
            confettiTriggered.current = true;

            // Fire multiple bursts for a more dramatic effect
            const count = 200;
            const defaults = {
                origin: { y: 0.7 }
            };

            function fire(particleRatio, opts) {
                confetti({
                    ...defaults,
                    ...opts,
                    particleCount: Math.floor(count * particleRatio)
                });
            }

            // Multiple bursts with different spreads and speeds
            fire(0.25, {
                spread: 26,
                startVelocity: 55,
            });

            fire(0.2, {
                spread: 60,
            });

            fire(0.35, {
                spread: 100,
                decay: 0.91,
                scalar: 0.8
            });

            fire(0.1, {
                spread: 120,
                startVelocity: 25,
                decay: 0.92,
                scalar: 1.2
            });

            fire(0.1, {
                spread: 120,
                startVelocity: 45,
            });
        }

        if (!showConfetti) {
            confettiTriggered.current = false;
        }
    }, [showConfetti]);

    // Correct answer popup
    const renderCorrectPopup = () => {
        if (!showCorrectAnimation) return null;

        return (
            <div className="correct-answer-overlay">
                <div className="correct-answer-popup">
                    <div className="popup-main">✨ Correct! ✨</div>
                    {points && !levelAlreadyCompleted && (
                        <div className="popup-points">+{points} pts</div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            {renderCorrectPopup()}
        </>
    );
}

export default Effects;