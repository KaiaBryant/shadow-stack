import "../styles/Footer.css";
import SocialIcons from "./SocialsIcons";

import InstagramIcon from "../assets/instagram.svg";
import GitHubIcon from "../assets/github.svg";
import LinkedInIcon from "../assets/linkedin.svg";
import TikTokIcon from "../assets/tiktok.svg";

function Footer() {
    return (
        <footer className="">
            <div className="footer-container">
                <div className="d-flex justify-content-center align-items-center gap-3">
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
            </div>
        </footer>
    );
}

export default Footer;
