import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "../styles/Header.css";
import { useNavigate } from "react-router-dom";

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

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
            // End active gameplay session if stored
            if (sessionId) {
                await fetch("http://localhost:5000/api/session/end", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ session_id: sessionId })
                });
            }

            // Clear gameplay + user info
            localStorage.removeItem("username");
            localStorage.removeItem("session_id");
            localStorage.removeItem("character_id");
            setIsMenuOpen(false);
            navigate("/");
        } catch (err) {
            console.error("Logout error:", err);
            navigate("/");
        }
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">Logo</Link>
                
                {/* Hamburger Icon */}
                <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}aria-label="Toggle menu">
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