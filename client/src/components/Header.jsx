import { Link } from "react-router-dom";
import "../styles/Header.css";

function Header() {
    return (
        <nav className="navbar">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">Logo</Link>
                <div className="ms-auto d-flex gap-5">
                    <Link to="/" className="nav-link fw-semibold fs-5">Home</Link>
                    <Link to="/leaderboard" className="nav-link fw-semibold fs-5">Leaderboard</Link>
                </div>
            </div>
        </nav>
    )
}

export default Header;