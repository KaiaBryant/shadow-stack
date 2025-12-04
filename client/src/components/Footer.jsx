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

        <div className="flex-grow-1 d-flex justify-content-center align-items-center gap-3">
          <div className="social-icon-wrapper">
            <SocialIcons
              href="https://www.instagram.com/"
              icon={InstagramIcon}
              label="Instagram"
            />
          </div>
          <div className="social-icon-wrapper">
            <SocialIcons
              href="https://github.com/KaiaBryant/shadow-stack"
              icon={GitHubIcon}
              label="GitHub"
            />
          </div>
          <div className="social-icon-wrapper">
            <SocialIcons
              href="https://linkedin.com/"
              icon={LinkedInIcon}
              label="LinkedIn"
            />
          </div>
          <div className="social-icon-wrapper">
            <SocialIcons
              href="https://www.tiktok.com/"
              icon={TikTokIcon}
              label="TikTok"
            />
          </div>
        </div>

        {showAdminButton && (
          <button
            className="admin-btn"
            onClick={() => navigate("/login")}
          >
            Admin
          </button>
        )}
      </div>
    </footer>
  );
}

export default Footer;
