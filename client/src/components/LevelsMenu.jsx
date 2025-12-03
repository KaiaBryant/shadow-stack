import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/levels.css";

export default function LevelsMenu() {
  const navigate = useNavigate();
  const [maxUnlocked, setMaxUnlocked] = useState(1);
  const levels = [1, 2, 3, 4, 5, 6, 7];
  const TOTAL_STARS = 7;

  useEffect(() => {
    const username = localStorage.getItem("username");
    const userId = localStorage.getItem("user_id");
    const STORAGE_KEY = username
      ? `maxUnlockedLevel_${username}`
      : "maxUnlockedLevel_guest";

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
    //    (using the same /check-completion endpoint Simulator uses)
    const syncWithDatabase = async () => {
      if (!userId) return; // unauthenticated / guest: just rely on local cache

      try {
        let highestCompletedFromDB = 0;

        // Check each level 1–7; see if DB marks it as completed
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

        // If DB says you've completed up to level N,
        // then unlocked levels = N + 1 (capped at 7, but at least 1)
        const dbMaxUnlocked =
          highestCompletedFromDB > 0
            ? Math.min(7, highestCompletedFromDB + 1)
            : 1;

        const finalMax = Math.max(localMax, dbMaxUnlocked);

        setMaxUnlocked(finalMax);

        // Keep localStorage in sync with DB so future loads are fast
        localStorage.setItem(STORAGE_KEY, String(finalMax));
      } catch (err) {
        console.error("Error syncing levels with database:", err);
        // If the DB call fails, we just fall back to localMax
      }
    };

    syncWithDatabase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLevelSelect = (level) => {
    if (level > maxUnlocked) return; // still block locked levels
    navigate("/simulator", { state: { level } });
  };

  return (
    <section className="levels-page position-relative">
      {/* floating background blobs */}
      <div className="background-blob blob-1" />
      <div className="background-blob blob-2" />

      <div className="container py-5">
        {/* Top row: title + mini HUD cards */}
        <div className="row align-items-center mb-5 gy-4">
          <div className="col-lg-6">
            <p className="levels-kicker text-uppercase mb-2">
              ShadowStack Training Module
            </p>
            <h1 className="levels-title mb-3">Select Your Level</h1>
            <p className="levels-subtitle mb-0">
              Unlock new cyber missions as you earn stars.
              Each level increases in difficulty. Click a level to begin.
            </p>
          </div>

          <div className="col-lg-6">
            <div className="row g-3">
              <div className="col-6 col-md-4">
                <div className="levels-hud-card h-100">
                  <span className="hud-label">Unlocked</span>
                  <span className="hud-value">
                    {maxUnlocked} / {levels.length}
                  </span>
                  <span className="hud-pill">Levels</span>
                </div>
              </div>
              <div className="col-6 col-md-4">
                <div className="levels-hud-card h-100">
                  <span className="hud-label">Difficulty</span>
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
              </div>
              <div className="col-12 col-md-4">
                <div className="levels-hud-card h-100">
                  <span className="hud-label">Tip</span>
                  <span className="hud-value hud-value-small">
                    Hover levels to preview. Locked ones are greyed out. 
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center: horizontal “tab” style menu */}
        <div className="d-flex justify-content-center mb-4">
          <div className="levels-wrapper">
            {/* Static LEVELS pill – no more floating/open state */}
            <button
              type="button"
              className="levels-center btn btn-primary levels-center-static"
              disabled
            >
              LEVELS
            </button>

            {levels.map((level) => {
              const locked = level > maxUnlocked;

              // ★ = filled, ☆ = empty, total always 7 chars
              const stars =
                "★".repeat(level) + "☆".repeat(TOTAL_STARS - level);

              return (
                <button
                  key={level}
                  type="button"
                  className={`
                    levels-option
                    option-${level}
                    show
                    ${locked ? "locked" : ""}
                  rounded`}
                  onClick={() => handleLevelSelect(level)}
                  disabled={locked}
                >
                  <span className="level-pill-label">L{level}</span>
                  <span className="level-stars">{stars}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend / helper text */}
        <div className="levels-legend text-center mt-4">
          <span className="legend-item me-3">
            <span className="legend-dot legend-dot-complete" /> Completed
          </span>
          <span className="legend-item me-3">
            <span className="legend-dot legend-dot-active" /> Unlocked
          </span>
          <span className="legend-item">
            <span className="legend-dot legend-dot-locked" /> Locked
          </span>
        </div>
      </div>
    </section>
  );
}
