import React, { useState, useEffect, useRef } from "react";
import { portfolioConfig } from "../data";
import GForceRadar from "./GForceRadar";
import GlitchText from "./GlitchText";

export default function Hero() {
  const { profile, sprintCountdown } = portfolioConfig;
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const pathRef = useRef(null);
  const [carTransform, setCarTransform] = useState({ x: 30, y: 80, angle: 0 });

  // 1. Countdown logic
  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(sprintCountdown.targetDate) - +new Date();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [sprintCountdown.targetDate]);

  // 2. Scroll-driven track car animator
  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const currentScroll = window.scrollY;
      const progress = docHeight > 0 ? currentScroll / docHeight : 0;
      setScrollProgress(progress);

      if (pathRef.current) {
        const totalLength = pathRef.current.getTotalLength();
        const currentLength = totalLength * progress;
        
        // Car position
        const point = pathRef.current.getPointAtLength(currentLength);
        
        // Orientation angle calculations
        const delta = Math.min(totalLength, currentLength + 3);
        const lookAheadPoint = pathRef.current.getPointAtLength(delta);
        const angle = Math.atan2(lookAheadPoint.y - point.y, lookAheadPoint.x - point.x) * (180 / Math.PI);
        
        setCarTransform({ x: point.x, y: point.y, angle });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial call
    setTimeout(handleScroll, 100);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const formatNum = (num) => String(num).padStart(2, "0");

  return (
    <section id="home" className="hero-section">
      <div className="container">
        <div className="hero-grid">
          
          {/* Left panel: Info */}
          <div>
            <div className="hero-subtitle">
              <span className="hud-mono">[{profile.sector}]</span>
              <span>{profile.gridRef}</span>
            </div>
            <h1 className="hero-title" style={{ minHeight: "140px" }}>
              <GlitchText text={profile.name.toUpperCase()} triggerOnLoad={true} /> <br />
              <span className="text-lime">
                <GlitchText text={profile.surname.toUpperCase()} triggerOnLoad={true} />
              </span>
            </h1>
            <p className="hero-desc">{profile.bio}</p>
            
            <div className="btn-container">
              <button 
                className="btn-telemetry"
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              >
                <span>ENTER TELEMETRY</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              
              <button 
                className="btn-telemetry-outline"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              >
                <span>SEND TRANSMISSION</span>
              </button>
            </div>
          </div>

          {/* Right panel: Telemetry widgets */}
          <div className="hero-widget-panel">
            {/* Sprint Status Widgets */}
            <div className="sprint-stats">
              <div className="hud-panel sprint-card">
                <div className="label">TOP SPRINT SPEED</div>
                <div className="value hud-mono">{sprintCountdown.sprintSpeed}</div>
              </div>
              <div className="hud-panel sprint-card">
                <div className="label">ACTIVE TYRE COMPOUND</div>
                <div className="value hud-mono text-cyan">{sprintCountdown.tyreCompound}</div>
              </div>
            </div>

            {/* VIP G-Force Radar simulation */}
            <GForceRadar />

            {/* Countdown Widget */}
            <div className="hud-panel">
              <div className="hud-header-bar">
                <span>SYSTEM TARGETS COUNTDOWN</span>
                <span className="text-cyan">LIVE</span>
              </div>
              <div className="hud-content">
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>
                  EVENT: {sprintCountdown.eventName}
                </div>
                <div className="countdown-container">
                  <div className="countdown-item">
                    <span className="num hud-mono">{formatNum(timeLeft.days)}</span>
                    <span className="label">Days</span>
                  </div>
                  <div className="countdown-item">
                    <span className="num hud-mono text-lime">{formatNum(timeLeft.hours)}</span>
                    <span className="label">Hours</span>
                  </div>
                  <div className="countdown-item">
                    <span className="num hud-mono">{formatNum(timeLeft.minutes)}</span>
                    <span className="label">Mins</span>
                  </div>
                  <div className="countdown-item">
                    <span className="num hud-mono text-cyan">{formatNum(timeLeft.seconds)}</span>
                    <span className="label">Secs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Circuit Track Panel */}
            <div className="hud-panel">
              <div className="hud-header-bar">
                <span>CIRCUIT PROGRESS GRAPH</span>
                <span>{Math.round(scrollProgress * 100)}% LAPPED</span>
              </div>
              <div className="hud-content" style={{ padding: "0.5rem 1rem 1rem 1rem" }}>
                <div className="track-panel">
                  <svg viewBox="0 0 500 350" style={{ width: "100%", height: "100%" }}>
                    {/* Background circuit path */}
                    <path
                      ref={pathRef}
                      className="circuit-path"
                      d="M 60,100 C 140,30 250,30 320,100 C 360,140 420,160 450,130 C 480,100 480,220 440,250 C 370,300 300,220 220,300 C 140,380 50,300 50,220 C 50,150 20,140 60,100 Z"
                    />
                    
                    {/* Highlighting progressive stroke */}
                    <path
                      className="circuit-progress"
                      d="M 60,100 C 140,30 250,30 320,100 C 360,140 420,160 450,130 C 480,100 480,220 440,250 C 370,300 300,220 220,300 C 140,380 50,300 50,220 C 50,150 20,140 60,100 Z"
                      style={{
                        strokeDasharray: pathRef.current ? pathRef.current.getTotalLength() : 1200,
                        strokeDashoffset: pathRef.current ? pathRef.current.getTotalLength() * (1 - scrollProgress) : 1200
                      }}
                    />

                    {/* Scrolling Car marker */}
                    <g transform={`translate(${carTransform.x}, ${carTransform.y}) rotate(${carTransform.angle})`}>
                      <path 
                        d="M -10,-5 L 12,0 L -10,5 Z" 
                        className="circuit-car" 
                      />
                      <circle cx="12" cy="0" r="3" fill="#ffffff" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
