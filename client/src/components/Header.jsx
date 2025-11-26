import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

function Header() {
    return (
        <div className="full-header">
            <header className="header-container">
                <nav className="navbar">
                    <Link to="/simulator">Simulator</Link>
                    <Link to="/">*Logo*</Link>
                    <Link to="/leaderboard">Leaderboard</Link>
                </nav>
            </header>
        </div>
    )
}

export default Header;