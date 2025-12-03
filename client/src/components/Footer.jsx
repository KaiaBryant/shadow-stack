import "../styles/Footer.css";
import SocialIcons from "./SocialsIcons";
import { useNavigate } from "react-router-dom";


import InstagramIcon from "../assets/instagram.svg";
import GitHubIcon from "../assets/github.svg";
import LinkedInIcon from "../assets/linkedin.svg";
import TikTokIcon from "../assets/tiktok.svg";


function Footer() {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");
    const sessionId = localStorage.getItem("session_id");
    const adminToken = localStorage.getItem("admin_token");

    // Admin button should show ONLY when NO username
    const showAdminButton = !username && !sessionId;


    return (
        <footer>
            <div className="footer-container d-flex align-items-center">
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
                            href="https://twitter.com/"
                            icon={LinkedInIcon}
                            label="LinkedIn"
                        />
                    </div>
                    <div className="social-icon-wrapper">
                        <SocialIcons
                            href="https://www.youtube.com/"
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
