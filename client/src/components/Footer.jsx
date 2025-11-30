import "../styles/Footer.css";
import SocialIcons from "./SocialsIcons";

import InstagramIcon from "../assets/instagram.svg";
import GitHubIcon from "../assets/github.svg";
import LinkedInIcon from "../assets/linkedin.svg";
import TikTokIcon from "../assets/tiktok.svg";

import { useNavigate } from "react-router-dom";

function Footer() {
    const navigate = useNavigate();

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

                <button className="admin-btn ms-3" onClick={() => navigate('/admin')}>Admin</button>
            </div>
        </footer>
    );
}

export default Footer;
