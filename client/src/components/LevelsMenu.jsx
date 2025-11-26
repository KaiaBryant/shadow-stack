import React, { useState } from "react";
import "../styles/levels.css"; // <- create this file

export default function LevelsMenu() {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(o => !o);

  return (
    <div className="background-levels">
    <div className="levels-wrapper d-flex justify-content-center align-items-center">
      {/* circle options */}
      <button
        className={`levels-center custom-btn btn-primary ${open ? "open" : ""}`}
        onClick={toggleMenu}
      >
        LEVELS
      </button>

      {/* each of these is one of the “pill” options */}
      <button
        className={`levels-option option-1 custom-btn btn-outline-light ${
          open ? "show" : ""
        }`}
      >
        ★
      </button>

      <button
        className={`levels-option option-7 custom-btn btn-outline-light ${
          open ? "show" : ""
        }`}
      >
        ★★★★★★★
      </button>


      <button
        className={`levels-option option-2 custom-btn btn-outline-light ${
          open ? "show" : ""
        }`}
      >
        ★★★★★★
      </button>

      <button
        className={`levels-option option-3 custom-btn btn-outline-light ${
          open ? "show" : ""
        }`}
      >
        ★★★★★
      </button>

      <button
        className={`levels-option option-4 custom-btn btn-outline-light ${
          open ? "show" : ""
        }`}
      >
        ★★★★
      </button>

      <button
        className={`levels-option option-5 custom-btn btn-outline-light ${
          open ? "show" : ""
        }`}
      >
        ★★★
      </button>

      <button
        className={`levels-option option-6 custom-btn btn-outline-light ${
          open ? "show" : ""
        }`}
      >
        ★★
      </button>
    </div>
  </div>
  );
}
