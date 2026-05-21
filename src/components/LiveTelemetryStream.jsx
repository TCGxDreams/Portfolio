import React, { useState, useEffect, useRef } from "react";

export default function LiveTelemetryStream() {
  const [metrics, setMetrics] = useState({
    speed: 280,
    rpm: 9500,
    throttle: 30,
    brake: 0,
    gear: 6,
    gForce: 1.1,
    drs: "CLOSED"
  });

  const lastScrollY = useRef(0);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    // 1. Simulation loop (gentle noise when idle)
    const interval = setInterval(() => {
      setMetrics((prev) => {
        if (prev.throttle > 35) {
          // Decelerate slowly back to idle metrics if not scrolling
          const nextThrottle = Math.max(30, prev.throttle - 5);
          const nextBrake = nextThrottle === 30 ? 10 : 0;
          const nextSpeed = Math.max(280, prev.speed - 3);
          const nextRpm = Math.max(9500, prev.rpm - 150);
          const nextGear = nextSpeed > 300 ? 8 : nextSpeed > 290 ? 7 : 6;
          const nextG = parseFloat((1.0 + Math.random() * 0.2).toFixed(2));
          return {
            speed: nextSpeed,
            rpm: nextRpm,
            throttle: nextThrottle,
            brake: nextBrake,
            gear: nextGear,
            gForce: nextG,
            drs: nextSpeed > 310 ? "ACTIVE" : "CLOSED"
          };
        } else {
          // Idle state jitters
          return {
            ...prev,
            rpm: 9500 + Math.floor(Math.sin(Date.now() * 0.01) * 80),
            gForce: parseFloat((1.0 + Math.sin(Date.now() * 0.005) * 0.1).toFixed(2)),
            brake: Math.sin(Date.now() * 0.002) > 0.5 ? 5 : 0
          };
        }
      });
    }, 100);

    // 2. Scroll velocity listener to trigger acceleration
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - lastScrollY.current);
      lastScrollY.current = currentScrollY;

      if (delta > 2) {
        setMetrics((prev) => {
          const targetSpeed = Math.min(348, prev.speed + Math.floor(delta / 4) + 1);
          const targetRpm = Math.min(13200, prev.rpm + Math.floor(delta * 25) + 200);
          const targetGear = targetSpeed > 330 ? 8 : targetSpeed > 300 ? 7 : 6;
          const targetG = parseFloat((2.5 + (delta * 0.08)).toFixed(2));
          return {
            speed: targetSpeed,
            rpm: targetRpm,
            throttle: Math.min(100, 80 + Math.floor(delta * 2)),
            brake: 0,
            gear: targetGear,
            gForce: Math.min(4.8, targetG),
            drs: targetSpeed > 310 ? "ACTIVE" : "CLOSED"
          };
        });
      }

      // Reset scroll timeout
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        // Drop throttle back down
        setMetrics(prev => ({ ...prev, throttle: 30, brake: 15 }));
      }, 250);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  return (
    <div className="live-telemetry-bar hud-mono">
      <div className="stream-wrapper">
        <div className="stream-group">
          <span className="label">SPEED</span>
          <span className="value text-lime">{metrics.speed} KM/H</span>
        </div>
        <div className="stream-divider">|</div>
        
        <div className="stream-group">
          <span className="label">RPM</span>
          <span className="value">{metrics.rpm.toLocaleString()}</span>
        </div>
        <div className="stream-divider">|</div>

        <div className="stream-group">
          <span className="label">GEAR</span>
          <span className="value text-cyan">N_{metrics.gear}</span>
        </div>
        <div className="stream-divider">|</div>

        <div className="stream-group">
          <span className="label">THROTTLE</span>
          <span className="value" style={{ color: "var(--accent-lime)" }}>{metrics.throttle}%</span>
        </div>
        <div className="stream-divider">|</div>

        <div className="stream-group">
          <span className="label">BRAKE</span>
          <span className="value" style={{ color: metrics.brake > 0 ? "var(--accent-red)" : "var(--text-secondary)" }}>
            {metrics.brake}%
          </span>
        </div>
        <div className="stream-divider">|</div>

        <div className="stream-group">
          <span className="label">G-FORCE</span>
          <span className="value text-cyan">{metrics.gForce}G</span>
        </div>
        <div className="stream-divider">|</div>

        <div className="stream-group">
          <span className="label">DRS STATUS</span>
          <span className={`value ${metrics.drs === "ACTIVE" ? "text-lime" : ""}`} style={{ fontWeight: 600 }}>
            {metrics.drs}
          </span>
        </div>
        <div className="stream-divider">|</div>

        <div className="stream-group">
          <span className="label">BIOMETRIC FEED</span>
          <span className="value text-lime">STABLE</span>
        </div>
      </div>
    </div>
  );
}
