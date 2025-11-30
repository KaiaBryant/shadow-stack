import { useState } from 'react';
import '../styles/Leaderboard.css';
import { leaderboardData } from '../data/leaderboardData';

function Leaderboard() {
    const topThree = leaderboardData.slice(0, 3);
    const restOfLeaderboard = leaderboardData.slice(3);

    return (
        <div className="leaderboard-container">

            {/* Top 3 Podium */}
            <div className="container mt-5 mb-5">
                <div className="row justify-content-center align-items-end podium-container">
                    {/* 2nd Place */}
                    <div className="col-md-3">
                        <div className="podium-card">
                            <div className="rank-badge d-flex align-items-center justify-content-center fs-3 fw-bold text-white" style={{ backgroundColor: topThree[1].color }}>
                                ★<span className="rank-number">2</span>
                            </div>
                            <div className="podium-avatar">{topThree[1].avatar}</div>
                            <p className="podium-username">{topThree[1].username}</p>
                            <h3 className="podium-points podium-points-other" style={{ color: topThree[1].color }}>
                                {topThree[1].points} pts
                            </h3>
                        </div>
                    </div>

                    {/* 1st Place */}
                    <div className="col-md-3">
                        <div className="podium-card podium-card-first">
                            <div className="rank-badge d-flex align-items-center justify-content-center fs-3 fw-bold text-white" style={{ backgroundColor: topThree[0].color }}>
                                ★<span className="rank-number">1</span>
                            </div>
                            <div className="podium-avatar podium-avatar-first">{topThree[0].avatar}</div>
                            <p className="podium-username">{topThree[0].username}</p>
                            <h2 className="podium-points podium-points-first" style={{ color: topThree[0].color }}>
                                {topThree[0].points} pts
                            </h2>
                        </div>
                    </div>

                    {/* 3rd Place */}
                    <div className="col-md-3">
                        <div className="podium-card">
                            <div className="rank-badge d-flex align-items-center justify-content-center fs-3 fw-bold text-white" style={{ backgroundColor: topThree[2].color }}>
                                ★<span className="rank-number">3</span>
                            </div>
                            <div className="podium-avatar">{topThree[2].avatar}</div>
                            <p className="podium-username">{topThree[2].username}</p>
                            <h3 className="podium-points podium-points-other" style={{ color: topThree[2].color }}>
                                {topThree[2].points} pts
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rest of Leaderboard */}
            <div className="container leaderboard-list">
                {restOfLeaderboard.map((player) => (
                    <div key={player.id} className="leaderboard-item">
                        <div className="item-left">
                            <div className="item-rank-badge" style={{ backgroundColor: player.color }}>
                                <span className="item-rank-number fs-3">{player.rank}</span>
                            </div>
                            <div className="item-avatar">{player.avatar}</div>
                            <div>
                                <p className="item-username">{player.username}</p>
                            </div>
                        </div>
                        <div className="item-right">
                            <h5 className="item-points">{player.points} pts</h5>
                            <div className="progress-bar-container">
                                <div
                                    className="progress-bar-fill"
                                    style={{ width: `${(player.points / 3045) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Leaderboard;