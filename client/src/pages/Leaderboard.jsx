import { useState, useEffect } from 'react';
import '../styles/Leaderboard.css';

function Leaderboard() {
    const [leaders, setLeaders] = useState([]);
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data function
    const fetchLeaderboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch characters and leaderboard in parallel
            const [charactersRes, leaderboardRes] = await Promise.all([
                fetch("https://shadow-stack.onrender.com/api/characters"),
                fetch("https://shadow-stack.onrender.com/api/leaderboard")
            ]);

            if (!charactersRes.ok || !leaderboardRes.ok) {
                throw new Error('Failed to fetch data');
            }

            const charactersData = await charactersRes.json();
            const leaderboardData = await leaderboardRes.json();

            // console.log('Fetched leaderboard data:', leaderboardData);
            // console.log('Fetched characters data:', charactersData);

            setCharacters(charactersData);
            setLeaders(leaderboardData);
        } catch (err) {
            console.error("Error loading leaderboard:", err);
            setError("Failed to load leaderboard data");
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch on mount
    useEffect(() => {
        fetchLeaderboardData();
    }, []);

    // Auto-refresh every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchLeaderboardData();
        }, 10000); // Refresh every 10 seconds

        return () => clearInterval(interval);
    }, []);

    // Enrich leaderboard data with character info
    const enriched = leaders.map((player, index) => {
        const character = characters.find(c => c.id === player.character_id);

        return {
            ...player,
            rank: index + 1,
            points: player.score,
            avatar: character?.avatar,
            profileImage: character?.url,
            color: character?.color,
        };
    });

    const topThree = enriched.slice(0, 3);
    const rest = enriched.slice(3);

    if (loading && leaders.length === 0) {
        return (
            <div className="leaderboard-container">
                <div className="container mt-5">
                    <div className="text-center text-white">
                        <h2>Loading Leaderboard...</h2>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="leaderboard-container">
                <div className="container mt-5">
                    <div className="alert alert-danger text-center">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    if (enriched.length === 0) {
        return (
            <div className="leaderboard-container">
                <div className="container mt-5">
                    <div className="text-center text-white">
                        <h2>No players on the leaderboard yet!</h2>
                        <p>Be the first to complete a level and claim your spot!</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="leaderboard-container">

            {/* Top 3 Podium */}
            {topThree.length === 3 && (
                <div className="container mt-5 mb-5">
                    <div className="row justify-content-center align-items-end podium-container">

                        {/* 2nd */}
                        <div className="col-md-3">
                            <div className="podium-card podium-card-second">
                                <div className="rank-badge fs-1" style={{ backgroundColor: topThree[1].color }}>★2</div>
                                <div className="podium-avatar podium-avatar-second">
                                    {topThree[1].profileImage ? (
                                        <img src={topThree[1].profileImage} alt={topThree[1].username} className="podium-avatar-img"/>
                                    ) : (
                                        topThree[1].avatar
                                    )}
                                </div>
                                <p className="podium-username">{topThree[1].username}</p>
                                <h3 className="podium-points-second">{topThree[1].points} pts</h3>
                            </div>
                        </div>

                        {/* 1st */}
                        <div className="col-md-3">
                            <div className="podium-card podium-card-first">
                                <div className="rank-badge fs-1">★1</div>
                                <div className="podium-avatar podium-avatar-first">
                                    {topThree[0].profileImage ? (
                                        <img src={topThree[0].profileImage} alt={topThree[0].username} className="podium-avatar-img"/>
                                    ) : (
                                        topThree[0].avatar
                                    )}
                                </div>
                                <p className="podium-username">{topThree[0].username}</p>
                                <h2 className="podium-points-first">{topThree[0].points} pts</h2>
                            </div>
                        </div>

                        {/* 3rd */}
                        <div className="col-md-3">
                            <div className="podium-card podium-card-third">
                                <div className="rank-badge fs-1">★3</div>
                                <div className="podium-avatar podium-avatar-third">
                                    {topThree[2].profileImage ? (
                                        <img src={topThree[2].profileImage} alt={topThree[2].username} className="podium-avatar-img"/>
                                    ) : (
                                        topThree[2].avatar
                                    )}
                                </div>
                                <p className="podium-username">{topThree[2].username}</p>
                                <h3 className="podium-points-third">{topThree[2].points} pts</h3>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* Top 2 players (if less than 3) */}
            {topThree.length === 2 && (
                <div className="container mt-5 mb-5">
                    <div className="row justify-content-center align-items-end podium-container">
                        <div className="col-md-3">
                            <div className="podium-card podium-card-second">
                                <div className="rank-badge fs-1" style={{ backgroundColor: topThree[1].color }}>★2</div>
                                <div className="podium-avatar podium-avatar-second">
                                    {topThree[1].profileImage ? (
                                        <img src={topThree[1].profileImage} alt={topThree[1].username} className="podium-avatar-img"/>
                                    ) : (
                                        topThree[1].avatar
                                    )}
                                </div>
                                <p className="podium-username">{topThree[1].username}</p>
                                <h3 className="podium-points-second">{topThree[1].points} pts</h3>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="podium-card podium-card-first">
                                <div className="rank-badge fs-1">★1</div>
                                <div className="podium-avatar podium-avatar-first">
                                    {topThree[0].profileImage ? (
                                        <img src={topThree[0].profileImage} alt={topThree[0].username} className="podium-avatar-img"/>
                                    ) : (
                                        topThree[0].avatar
                                    )}
                                </div>
                                <p className="podium-username">{topThree[0].username}</p>
                                <h2 className="podium-points-first">{topThree[0].points} pts</h2>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Single player */}
            {topThree.length === 1 && (
                <div className="container mt-5 mb-5">
                    <div className="row justify-content-center align-items-end podium-container">
                        <div className="col-md-3">
                            <div className="podium-card podium-card-first">
                                <div className="rank-badge fs-1">★1</div>
                                <div className="podium-avatar podium-avatar-first">
                                    {topThree[0].profileImage ? (
                                        <img src={topThree[0].profileImage} alt={topThree[0].username} className="podium-avatar-img"/>
                                    ) : (
                                        topThree[0].avatar
                                    )}
                                </div>
                                <p className="podium-username">{topThree[0].username}</p>
                                <h2 className="podium-points-first">{topThree[0].points} pts</h2>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Remaining Players */}
            {rest.length > 0 && (
                <div className="container leaderboard-list">
                    {rest.map((player) => (
                        <div key={player.id} className="leaderboard-item">
                            <div className="item-left">
                                <div className="item-rank-badge" style={{ backgroundColor: player.color }}>
                                    <span className="item-rank-number">{player.rank}</span>
                                </div>
                                <div className="item-avatar">
                                    {player.profileImage ? (
                                        <img src={player.profileImage} alt={player.username} className="item-avatar-img"/>
                                    ) : (
                                        player.avatar
                                    )}
                                </div>
                                <p className="item-username">{player.username}</p>
                            </div>

                            <div className="item-right">
                                <h5 className="item-points">{player.points} pts</h5>
                                <div className="progress-bar-container">
                                    <div
                                        className="progress-bar-fill"
                                        style={{ width: `${Math.min((player.points / 31750) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Refresh indicator */}
            {loading && leaders.length > 0 && (
                <div className="text-center text-white-50 mt-3 mb-3">
                    <small>Refreshing...</small>
                </div>
            )}
        </div>
    );
}

export default Leaderboard;