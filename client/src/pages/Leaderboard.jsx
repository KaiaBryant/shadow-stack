import { useState, useEffect } from 'react';
import '../styles/Leaderboard.css';
import { characters } from "../data/characters";

// import { leaderboardData } from '../data/leaderboardData';

function Leaderboard() {
    // State Management for Score Tracker
    const [score, setScore] = useState(0);
    
    // const [timeFilter, setTimeFilter] = useState('This Week');
    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        // May need to change the link of deployment link later after 5000
        fetch("http://localhost:5000/api/leaderboard")
            .then((res) => res.json())
            .then((data) => setLeaders(data))
            .catch((err) => console.error("Error loading leaderboard:", err));
    }, []);

    const enriched = leaders.map((player, index) => {
        const character = characters.find(c => c.id === player.character_id);

        return {
            ...player,
            rank: index + 1,
            points: player.score,
            avatar: character?.avatar,
            color: character?.color,
        };
    });

    const topThree = enriched.slice(0, 3);
    const rest = enriched.slice(3);


    return (
        <div className="leaderboard-container">

            {/* Top 3 Podium */}
            {topThree.length === 3 && (
                <div className="container mt-5 mb-5">
                    <div className="row justify-content-center align-items-end podium-container">

                        {/* 2nd */}
                        <div className="col-md-3">
                            <div className="podium-card">
                                <div className="rank-badge" style={{ backgroundColor: topThree[1].color }}>★2</div>
                                <div className="podium-avatar">{topThree[1].avatar}</div>
                                <p className="podium-username">{topThree[1].username}</p>
                                <h3 className="podium-points">{topThree[1].points} pts</h3>
                            </div>
                        </div>

                        {/* 1st */}
                        <div className="col-md-3">
                            <div className="podium-card podium-card-first">
                                <div className="rank-badge" style={{ backgroundColor: topThree[0].color }}>★1</div>
                                <div className="podium-avatar podium-avatar-first">{topThree[0].avatar}</div>
                                <p className="podium-username">{topThree[0].username}</p>
                                <h2 className="podium-points-first">{topThree[0].points} pts</h2>
                            </div>
                        </div>

                        {/* 3rd */}
                        <div className="col-md-3">
                            <div className="podium-card">
                                <div className="rank-badge" style={{ backgroundColor: topThree[2].color }}>★3</div>
                                <div className="podium-avatar">{topThree[2].avatar}</div>
                                <p className="podium-username">{topThree[2].username}</p>
                                <h3 className="podium-points">{topThree[2].points} pts</h3>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* Remaining Players */}
            <div className="container leaderboard-list">
                {rest.map((player) => (
                    <div key={player.id} className="leaderboard-item">
                        <div className="item-left">
                            <div className="item-rank-badge" style={{ backgroundColor: player.color }}>
                                <span className="item-rank-number">{player.rank}</span>
                            </div>
                            <div className="item-avatar">{player.avatar}</div>
                            <p className="item-username">{player.username}</p>
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




