import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/levels.css";

export default function LevelsMenu() {
  const [open, setOpen] = useState(false);
  const [maxUnlocked, setMaxUnlocked] = useState(1);
  const navigate = useNavigate();

  // Load max unlocked level from localStorage when this component mounts
  useEffect(() => {
    const stored = localStorage.getItem("maxUnlockedLevel");
    if (stored) {
      setMaxUnlocked(parseInt(stored, 10));
    }
  }, []);

  const toggleMenu = () => setOpen((o) => !o);

  const handleLevelSelect = (level) => {
    // ignore clicks on locked levels just in case
    if (level > maxUnlocked) return;

    navigate("/simulator", { state: { level } });
  };

  return (
    <div className="background-levels">
      <div className="levels-wrapper d-flex justify-content-center align-items-center">
        {/* center circle */}
        <button
          className={`levels-center custom-btn btn-primary ${open ? "open" : ""}`}
          onClick={toggleMenu}
        >
          LEVELS
        </button>

        {/* level 1 */}
        <button
          className={`levels-option option-1 custom-btn btn-outline-light ${open ? "show" : ""
            } ${maxUnlocked < 1 ? "locked" : ""}`}
          disabled={maxUnlocked < 1}
          onClick={() => handleLevelSelect(1)}
        >
          ★
        </button>

        {/* level 7 */}
        <button
          className={`levels-option option-7 custom-btn btn-outline-light ${open ? "show" : ""
            } ${maxUnlocked < 7 ? "locked" : ""}`}
          disabled={maxUnlocked < 7}
          onClick={() => handleLevelSelect(7)}
        >
          ★★★★★★★
        </button>

        {/* level 6 */}
        <button
          className={`levels-option option-2 custom-btn btn-outline-light ${open ? "show" : ""
            } ${maxUnlocked < 6 ? "locked" : ""}`}
          disabled={maxUnlocked < 6}
          onClick={() => handleLevelSelect(6)}
        >
          ★★★★★★
        </button>

        {/* level 5 */}
        <button
          className={`levels-option option-3 custom-btn btn-outline-light ${open ? "show" : ""
            } ${maxUnlocked < 5 ? "locked" : ""}`}
          disabled={maxUnlocked < 5}
          onClick={() => handleLevelSelect(5)}
        >
          ★★★★★
        </button>

        {/* level 4 */}
        <button
          className={`levels-option option-4 custom-btn btn-outline-light ${open ? "show" : ""
            } ${maxUnlocked < 4 ? "locked" : ""}`}
          disabled={maxUnlocked < 4}
          onClick={() => handleLevelSelect(4)}
        >
          ★★★★
        </button>

        {/* level 3 */}
        <button
          className={`levels-option option-5 custom-btn btn-outline-light ${open ? "show" : ""
            } ${maxUnlocked < 3 ? "locked" : ""}`}
          disabled={maxUnlocked < 3}
          onClick={() => handleLevelSelect(3)}
        >
          ★★★
        </button>

        {/* level 2 */}
        <button
          className={`levels-option option-6 custom-btn btn-outline-light ${open ? "show" : ""
            } ${maxUnlocked < 2 ? "locked" : ""}`}
          disabled={maxUnlocked < 2}
          onClick={() => handleLevelSelect(2)}
        >
          ★★
        </button>
      </div>
    </div>
  );
}
