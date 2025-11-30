import React from "react";

// Accept properies 
export default function SocialIcons({ href, icon, label }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="social-icon"
        >
            <img src={icon} alt={label} />
        </a>
    );
}
