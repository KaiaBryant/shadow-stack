// Game Intro introduces the game objective right before the simulation begins
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Objective.css";

function GameIntro() {
    const navigate = useNavigate();
return (
        <div className="d-flex align-items-center justify-content-center min-vh-100">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10 col-xl-8 text-center">
                        <h1 className="display-3 fw-bold mb-4 custom-header">
                            Game Objective
                        </h1>
                        <p className="lead fs-4 mb-5 custom-desc">
                            You will answer a series of questions to test and develop your knowledge in cybersecurity. 
                            Out of 7 levels, each level will have a series of 5 questions
                            for a total of 35 questions. Answer the 5 questions in each level
                            to move on to the next level. Collect points to make it on the top of the leaderboard.
                             Good luck!
                        </p>
                        <button className="btn custom-btn-primary btn-lg px-5 py-3 fw-semibold" onClick={() => navigate('/levels')}>
                            Understood!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GameIntro;