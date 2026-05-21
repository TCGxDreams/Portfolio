import React, { useState } from "react";
import { portfolioConfig } from "../data";

export default function MenuOverlay({ isOpen, setIsOpen }) {
  const [activeImage, setActiveImage] = useState(null);

  const handleLinkClick = (e, targetId) => {
    e.preventDefault();
    setIsOpen(false);
    
    const element = document.getElementById(targetId);
    if (element) {
      // Small delay for smooth closing transition before scrolling
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  return (
    <div className={`menu-overlay ${isOpen ? "open" : ""}`}>
      {/* Background Grids */}
      <div className="hud-grid-overlay"></div>

      {/* Left side Navigation Panel */}
      <div className="menu-left">
        <div style={{ marginBottom: "2rem" }}>
          <div className="hud-mono" style={{ fontSize: "0.75rem", color: "var(--text-secondary)", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>
            SYSTEM MENU NAVIGATION
          </div>
          <div style={{ width: "40px", height: "2px", backgroundColor: "var(--accent-lime)" }}></div>
        </div>

        <ul className="menu-links">
          {portfolioConfig.navigation.map((item, idx) => (
            <li key={item.id}>
              <a 
                href={`#${item.id}`} 
                className="menu-link"
                onClick={(e) => handleLinkClick(e, item.id)}
                onMouseEnter={() => setActiveImage(item.previewImage)}
                onMouseLeave={() => setActiveImage(null)}
              >
                <span className="hud-mono">0{idx + 1}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Right side Image Preview Panel */}
      <div className="menu-right">
        {portfolioConfig.navigation.map((item) => (
          <img
            key={item.id}
            src={item.previewImage}
            alt={item.label}
            className={`menu-preview-img ${activeImage === item.previewImage ? "active" : ""}`}
          />
        ))}

        {/* Ambient watermark inside overlay */}
        <div 
          className="hud-mono"
          style={{ 
            position: "absolute", 
            bottom: "2rem", 
            right: "2rem", 
            fontSize: "4rem", 
            opacity: 0.03, 
            fontWeight: 800,
            pointerEvents: "none"
          }}
        >
          {portfolioConfig.profile.sector}
        </div>
      </div>
    </div>
  );
}
