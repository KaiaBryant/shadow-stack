import { Link, useLocation } from "react-router-dom";
import "../styles/Header.css";

function Header() {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">Logo</Link>
                <div className="ms-auto d-flex gap-5">
                    <Link to="/" className={`nav-link fw-semibold fs-5 text-white ${location.pathname === '/' ? 'active' : ''}`}>
                        Home
                    </Link>
                    <Link to="/leaderboard" className={`nav-link fw-semibold fs-5 text-white ${location.pathname === '/leaderboard' ? 'active' : ''}`}>
                        Leaderboard
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default Header;