import React, { useState, useEffect } from "react";
import { portfolioConfig } from "../data";
import GlitchText from "./GlitchText";

export default function Header({ isMenuOpen, setIsMenuOpen, isMuted, setIsMuted }) {
  const [timeMode, setTimeMode] = useState("UTC"); // "UTC" or "LOCAL"
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      if (timeMode === "UTC") {
        setCurrentTime(now.toISOString().slice(11, 19) + " UTC");
      } else {
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        setCurrentTime(`${hours}:${minutes}:${seconds} LOC`);
      }
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timeMode]);

  return (
    <nav className="navbar">
      <a href="#home" className="nav-brand">
        <span className="hud-mono">
          <GlitchText text={portfolioConfig.profile.name.toUpperCase()} triggerOnLoad={true} />
        </span>
        <span className="text-lime font-hud" style={{ marginLeft: "6px", marginRight: "6px" }}>//</span>
        <span className="text-secondary font-hud">
          {portfolioConfig.profile.surname.toUpperCase()}
        </span>
        <span className="dot"></span>
      </a>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Comms Radio Switch Badge */}
        <div 
          className="status-badge hud-mono"
          onClick={() => setIsMuted(prev => !prev)}
          style={{ cursor: "pointer", userSelect: "none" }}
          title="Click to toggle UI audio signals"
        >
          <span style={{ fontSize: "0.6rem", color: "var(--text-secondary)" }}>COMMS:</span>
          {isMuted ? (
            <span className="text-red" style={{ fontWeight: 600 }}>MUTED</span>
          ) : (
            <span className="text-lime" style={{ fontWeight: 600 }}>ONLINE</span>
          )}
        </div>

        {/* Telemetry Clock */}
        <div 
          className="status-badge hud-mono" 
          style={{ cursor: "pointer", userSelect: "none" }}
          onClick={() => setTimeMode(prev => prev === "UTC" ? "LOCAL" : "UTC")}
          title="Click to toggle Local/UTC time"
        >
          <span style={{ fontSize: "0.6rem", color: "var(--text-secondary)" }}>TIME:</span>
          <span className="text-cyan" style={{ fontWeight: 600 }}>{currentTime}</span>
        </div>

        {/* Live Status Badge */}
        <div className="status-badge">
          <span className="indicator"></span>
          <span className="hud-mono text-lime" style={{ fontWeight: 600 }}>{portfolioConfig.profile.status}</span>
        </div>

        {/* Hamburger Menu Trigger */}
        <button 
          className={`hamburger-btn ${isMenuOpen ? "open" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
