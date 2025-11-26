import React from "react";
import "../styles/Footer.css";
import SocialIcons from "./SocialsIcons";

import InstagramIcon from "../assets/instagram.svg";
import GitHubIcon from "../assets/github.svg";
import LinkedInIcon from "../assets/linkedin.svg";
import TikTokIcon from "../assets/tiktok.svg";

function Footer() {
    return (
        <footer className="full-footer-container">
            <div className="footer-inner-container">

                {/* Social Media Links */}
                <div className="footer-socials">
                    <div className="socials-container">
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
                            href="https://twitter.com/"
                            icon={LinkedInIcon}
                            label="LinkedIn"
                        />
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
