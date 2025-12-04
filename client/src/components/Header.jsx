import { Link, NavLink } from "react-router-dom";
import "../styles/Header.css";
import { useNavigate } from "react-router-dom";

function Header() {
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
            navigate("/");
        } catch (err) {
            console.error("Logout error:", err);
            navigate("/");
        }
    };

    return (
        <nav className="navbar">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">Logo</Link>
                <div className="ms-auto d-flex gap-5">
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
                    
                    <div className="header-logout">
                        {showLogout && !adminToken && (
                            <button className="logout-btn me-3" onClick={handleLogout}>
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header;