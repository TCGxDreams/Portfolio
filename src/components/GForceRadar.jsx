import React, { useEffect, useRef, useState } from "react";

export default function GForceRadar() {
  const [liveG, setLiveG] = useState({ lat: 0, lon: 0 });
  const containerRef = useRef(null);
  
  const targetG = useRef({ x: 0, y: 0 });
  const currentG = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Calculate cursor offset percentage from center of the viewport
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      
      // Target offset scaled to max 3.5 Gs
      targetG.current.x = ((e.clientX - cx) / cx) * 3.5;
      targetG.current.y = -((e.clientY - cy) / cy) * 3.5; // Invert Y for G-Force standard
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Spring physics render loop
    let animId;
    const stiffness = 0.06;
    const damping = 0.82;

    const tick = () => {
      // Acceleration force toward target
      const ax = (targetG.current.x - currentG.current.x) * stiffness;
      const ay = (targetG.current.y - currentG.current.y) * stiffness;
      
      // Update velocity with damping friction
      velocity.current.x = (velocity.current.x + ax) * damping;
      velocity.current.y = (velocity.current.y + ay) * damping;
      
      // Update coordinates
      currentG.current.x += velocity.current.x;
      currentG.current.y += velocity.current.y;

      setLiveG({
        lat: parseFloat(currentG.current.x.toFixed(2)),
        lon: parseFloat(currentG.current.y.toFixed(2))
      });

      animId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Map G-Force coordinates to SVG pixel space (radar is 120px wide, max G is 4.0)
  const dotX = 60 + (liveG.lat / 4.0) * 50;
  const dotY = 60 - (liveG.lon / 4.0) * 50; // Invert SVG coordinates

  return (
    <div className="hud-panel" style={{ padding: "1rem", display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="hud-header-bar" style={{ padding: "0 0 0.5rem 0", marginBottom: "0.75rem" }}>
        <span>G-FORCE REALTIME SIMULATOR</span>
        <span className="text-red">ACTIVE</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "1rem", alignItems: "center", flexGrow: 1 }}>
        {/* Left: Interactive Radar SVG */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg width="120" height="120" viewBox="0 0 120 120" style={{ filter: "drop-shadow(0 0 4px rgba(255, 42, 95, 0.1))" }}>
            {/* Concentric Grid lines */}
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
            <circle cx="60" cy="60" r="35" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" strokeDasharray="3,3" />
            <circle cx="60" cy="60" r="20" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
            
            {/* Grid Crosshair */}
            <line x1="60" y1="5" x2="60" y2="115" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
            <line x1="5" y1="60" x2="115" y2="60" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
            
            {/* Center cross dot */}
            <circle cx="60" cy="60" r="2" fill="var(--text-secondary)" />

            {/* Glowing physics G-Force tracking dot */}
            <circle 
              cx={dotX} 
              cy={dotY} 
              r="4.5" 
              fill="var(--accent-red)" 
              filter="drop-shadow(0 0 5px var(--accent-red))"
              style={{ transition: "cx 0.05s linear, cy 0.05s linear" }}
            />
            {/* Lead trailing shadow ring */}
            <circle 
              cx={dotX} 
              cy={dotY} 
              r="8" 
              fill="none"
              stroke="var(--accent-red)"
              strokeWidth="1"
              style={{ opacity: 0.3, transition: "cx 0.05s linear, cy 0.05s linear" }}
            />
          </svg>
        </div>

        {/* Right: Telemetry data values */}
        <div className="hud-mono" style={{ fontSize: "0.7rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div>
            <span style={{ color: "var(--text-secondary)" }}>LATERAL G: </span>
            <span className={liveG.lat >= 0 ? "text-lime" : "text-cyan"} style={{ fontWeight: 700 }}>
              {liveG.lat >= 0 ? `+${liveG.lat}` : liveG.lat}G
            </span>
          </div>
          <div>
            <span style={{ color: "var(--text-secondary)" }}>LONGITUDINAL: </span>
            <span className={liveG.lon >= 0 ? "text-lime" : "text-cyan"} style={{ fontWeight: 700 }}>
              {liveG.lon >= 0 ? `+${liveG.lon}` : liveG.lon}G
            </span>
          </div>
          <div style={{ borderTop: "1px solid var(--border-dim)", paddingTop: "0.4rem", marginTop: "0.2rem" }}>
            <span style={{ color: "var(--text-secondary)" }}>COMBINED: </span>
            <span className="text-red" style={{ fontWeight: 700 }}>
              {Math.sqrt(liveG.lat*liveG.lat + liveG.lon*liveG.lon).toFixed(2)}G
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
