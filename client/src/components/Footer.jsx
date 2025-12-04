import "../styles/Footer.css";
import SocialIcons from "./SocialsIcons";
import { useNavigate, useLocation } from "react-router-dom";   // ⬅️ add useLocation

import InstagramIcon from "../assets/instagram.svg";
import GitHubIcon from "../assets/github.svg";
import LinkedInIcon from "../assets/linkedin.svg";
import TikTokIcon from "../assets/tiktok.svg";

function Footer({ holidayMode, onToggleHoliday }) {
  const navigate = useNavigate();
  const location = useLocation();                     // ⬅️ use it here

  const username = localStorage.getItem("username");
  const sessionId = localStorage.getItem("session_id");

  // Only show Admin when NO username / session
  const showAdminButton = !username && !sessionId;

  // Only show toggle on Home ("/")
  const onHome = location.pathname === "/";
  const showToggle = onHome && typeof onToggleHoliday === "function";

  return (
    <footer>
      <div className="footer-container d-flex align-items-center">
        {showToggle && (
          <button
            className="holiday-btn"
            onClick={onToggleHoliday}
          >
            {holidayMode ? "Disable Snow" : "Enable Snow"}
          </button>
        )}

    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Left Section - Mission & Socials */}
                <div className="footer-section footer-left">
                    <h3 className="footer-brand">ShadowStack</h3>
                    <p className="mission-statement">
                        Master cybersecurity through challenges and real-world scenarios. 
                        Level up your skills, one hack at a time.
                    </p>
                    <div className="social-icons">
                        <SocialIcons
                            href="https://www.instagram.com/"
                            icon={InstagramIcon}
                            label="Instagram"
                        />
                        <SocialIcons
                            href="https://github.com/KaiaBryant/shadow-stack"
                            icon={GitHubIcon}
                            label="GitHub"
                        />
                        <SocialIcons
                            href="https://www.linkedin.com"
                            icon={LinkedInIcon}
                            label="LinkedIn"
                        />
                        <SocialIcons
                            href="https://www.tiktok.com"
                            icon={TikTokIcon}
                            label="TikTok"
                        />
                    </div>
                </div>

                {/* Center Section - Quick Links */}
                <div className="footer-section footer-center">
                    <h4 className="footer-title">Quick Links</h4>
                    <ul className="footer-links">
                        <li>
                            <a onClick={() => navigate("/")} className="footer-link">Home</a>
                        </li>
                        <li>
                            <a onClick={() => navigate("/levels")} className="footer-link">Levels</a>
                        </li>
                        <li>
                            <a onClick={() => navigate("/leaderboard")} className="footer-link">Leaderboard</a>
                        </li>
                    </ul>
                </div>

                {/* Right Section - Copyright & Admin */}
                <div className="footer-section footer-right">
                    <div className="copyright">
                        <p>&copy; {new Date().getFullYear()} ShadowStack</p>
                        <p className="copyright-subtext">All rights reserved</p>
                    </div>
                    {showAdminButton && (
                        <button className="admin-btn" onClick={() => navigate("/login")}>
                            Admin Login
                        </button>
                    )}
                </div>
            </div>
        </footer>
    );
}

export default Footer;