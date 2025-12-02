import { Link } from "react-router-dom";
import "../styles/Header.css";

import { useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();

    // User auth
    const username = localStorage.getItem("username");
    const sessionId = localStorage.getItem("session_id");

    // Ensure admin auth does not trigger
    const adminToken = localStorage.getItem("admin_token")

    // Show logout only for users
    const showLogout = username || sessionId;

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
                    <Link to="/" className="nav-link fw-semibold fs-5 text-white">Home</Link>
                    <Link to="/leaderboard" className="nav-link fw-semibold fs-5 text-white">Leaderboard</Link>
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
    )
}

export default Header;