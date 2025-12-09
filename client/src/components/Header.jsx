import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "../styles/Header.css";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo-new.png";

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const closeMenu = () => {
        setIsMenuOpen(false);
    };


    // User auth
    const username = localStorage.getItem("username");
    const sessionId = localStorage.getItem("session_id");
    const characterId = localStorage.getItem("character_id");

    // Ensure admin auth does not trigger
    const adminToken = localStorage.getItem("admin_token");

    // Show logout only for users
    const showLogout = username || sessionId;

    // Show Levels link only after username AND character are selected
    const showLevels = username && characterId;

    const handleLogout = async () => {
        try {
            const sessionId = localStorage.getItem("session_id");

            // 1. Always notify backend FIRST
            if (sessionId) {
                await fetch("https://shadow-stack.onrender.com/api/session/end", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ session_id: sessionId })
                });
            }

        } catch (err) {
            console.error("Logout API failed:", err);
        } finally {
            localStorage.clear();
            sessionStorage.clear();
            setIsMenuOpen(false);
            window.location.href = "/";
        }
    };


    return (
        <nav className="navbar">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand"><img src={Logo} id="ss-logo"></img></Link>

                {/* Hamburger Icon */}
                <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                    <span className={isMenuOpen ? "active" : ""}></span>
                    <span className={isMenuOpen ? "active" : ""}></span>
                    <span className={isMenuOpen ? "active" : ""}></span>
                </button>

                {/* Desktop Menu */}
                <div className="nav-menu desktop-menu">
                    <NavLink to="/" className="nav-link fw-semibold fs-5 text-white">
                        Home
                    </NavLink>

                    {showLevels && (
                        <NavLink to="/levels" className="nav-link fw-semibold fs-5 text-white">
                            Levels
                        </NavLink>
                    )}

                    <NavLink to="/leaderboard" className="nav-link fw-semibold fs-5 text-white">
                        Leaderboard
                    </NavLink>

                    {showLogout && !adminToken && (
                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    )}
                </div>

                {/* Mobile Menu */}
                <div className={`nav-menu mobile-menu ${isMenuOpen ? "open" : ""}`}>
                    <NavLink to="/" className="nav-link fw-semibold fs-5 text-white" onClick={closeMenu}>
                        Home
                    </NavLink>

                    {showLevels && (
                        <NavLink to="/levels" className="nav-link fw-semibold fs-5 text-white" onClick={closeMenu}>
                            Levels
                        </NavLink>
                    )}

                    <NavLink to="/leaderboard" className="nav-link fw-semibold fs-5 text-white" onClick={closeMenu}>
                        Leaderboard
                    </NavLink>

                    {showLogout && !adminToken && (
                        <button className="logout-btn mobile-logout" onClick={handleLogout}>
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Header;