import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/levels.css";

export default function LevelsMenu() {
  const navigate = useNavigate();
  const [maxUnlocked, setMaxUnlocked] = useState(1);
  const [characterUrl, setCharacterUrl] = useState("https://via.placeholder.com/150");
  const levels = [1, 2, 3, 4, 5, 6, 7];
  const TOTAL_STARS = 7;

  useEffect(() => {
    const username = localStorage.getItem("username");
    const userId = localStorage.getItem("user_id");
    const characterId = localStorage.getItem("character_id");
    const STORAGE_KEY = username
      ? `maxUnlockedLevel_${username}`
      : "maxUnlockedLevel_guest";

    // Fetch character image if character_id exists
    const fetchCharacterImage = async () => {
      if (!characterId) return;

      try {
        const response = await axios.get("http://localhost:5000/api/characters");
        const character = response.data.find(c => c.id === parseInt(characterId));
        
        if (character && character.url) {
          setCharacterUrl(character.url);
        }
      } catch (err) {
        console.error("Error fetching character:", err);
      }
    };

    fetchCharacterImage();

    // 1) Start from localStorage (per user)
    const stored = localStorage.getItem(STORAGE_KEY);
    let localMax = 1;

    if (stored) {
      const n = parseInt(stored, 10);
      if (!Number.isNaN(n)) {
        localMax = Math.min(7, Math.max(1, n));
      }
    }

    setMaxUnlocked(localMax);

    // 2) Also ask the backend what levels are completed for this user
    const syncWithDatabase = async () => {
      if (!userId) return;

      try {
        let highestCompletedFromDB = 0;

        for (const level of levels) {
          const res = await axios.get(
            `http://localhost:5000/api/leaderboard/check-completion`,
            {
              params: {
                user_id: userId,
                level,
              },
            }
          );

          if (res.data?.completed) {
            highestCompletedFromDB = Math.max(highestCompletedFromDB, level);
          }
        }

        const dbMaxUnlocked =
          highestCompletedFromDB > 0
            ? Math.min(7, highestCompletedFromDB + 1)
            : 1;

        const finalMax = Math.max(localMax, dbMaxUnlocked);

        setMaxUnlocked(finalMax);
        localStorage.setItem(STORAGE_KEY, String(finalMax));
      } catch (err) {
        console.error("Error syncing levels with database:", err);
      }
    };

    syncWithDatabase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLevelSelect = (level) => {
    if (level > maxUnlocked) return;
    navigate("/simulator", { state: { level } });
  };

  const username = localStorage.getItem("username") || "Guest";

  return (
    <section className="levels-page position-relative">
      {/* floating background blobs */}
      <div className="background-blob blob-1" />
      <div className="background-blob blob-2" />

      <div className="levels-layout">
        {/* Left Sidebar */}
        <div className="left-sidebar">
          <div className="profile-pic">
            <img src={characterUrl} alt="Profile" />
          </div>
          
          <div className="sidebar-username">
            {username}
          </div>

          <div className="sidebar-stats">
            <div className="levels-hud-card">
              <span className="hud-label">Unlocked</span>
              <span className="hud-value">
                {maxUnlocked} / {levels.length}
              </span>
              <span className="hud-pill">Levels</span>
            </div>

            <div className="levels-hud-card">
              <span className="hud-label">Title</span>
              <span className="hud-value">
                {maxUnlocked <= 2
                  ? "Rookie"
                  : maxUnlocked <= 4
                    ? "Analyst"
                    : maxUnlocked <= 6
                      ? "Incident"
                      : "Professional"}
              </span>
              <span className="hud-pill">Profile</span>
            </div>

            <div className="levels-hud-card">
              <span className="hud-label">Tip</span>
              <span className="hud-value hud-value-small">
                Hover levels to preview. Locked ones are greyed out.
              </span>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="right-content">
          <div className="levels-content-box">
            <div className="levels-header">
              <h1 className="hud-value levels-main-title">Training Module</h1>
              <p className="levels-description">
                Unlock new cyber missions as you earn stars.
                Each level increases in difficulty. Click a level to begin.
              </p>
            </div>

            {/* Levels Grid */}
            <div className="levels-grid">
              {levels.map((level) => {
                const locked = level > maxUnlocked;
                const stars = "★".repeat(level) + "☆".repeat(TOTAL_STARS - level);

                return (
                  <button key={level} type="button" className={`level-card ${locked ? "locked" : ""}`} onClick={() => handleLevelSelect(level)} disabled={locked}>
                    <div className="level-card-header">
                      <span className="level-number">Level {level}</span>
                    </div>
                    <div className="level-card-body">
                      <div className="level-stars">{stars}</div>
                      <span className="level-status">
                        {locked ? "🔒 Locked" : "✓ Unlocked"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}