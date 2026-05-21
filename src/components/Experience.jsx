import React, { useEffect, useRef, useState } from "react";
import { portfolioConfig } from "../data";

function ExperienceStint({ stint, index }) {
  const [inView, setInView] = useState(false);
  const stintRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (stintRef.current) {
      observer.observe(stintRef.current);
    }

    return () => {
      if (stintRef.current) observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={stintRef} 
      className={`stint-node ${inView ? "stint-active" : ""}`}
    >
      {/* Visual Timeline Node */}
      <div className="stint-indicator">
        <div className="stint-dot"></div>
        <div className="stint-line"></div>
      </div>

      {/* Telemetry Card Content */}
      <div className="hud-panel stint-card">
        <div className="hud-header-bar">
          <span className="text-lime font-hud">STINT_{String(index + 1).padStart(2, "0")} // {stint.company}</span>
          <span className="hud-mono">{stint.period}</span>
        </div>

        <div className="hud-content">
          <div className="stint-meta-row">
            <div>
              <h3 className="stint-role" style={{ margin: 0, fontSize: "1.15rem", color: "#fff" }}>
                {stint.role.toUpperCase()}
              </h3>
              <div className="hud-mono text-secondary" style={{ fontSize: "0.7rem", marginTop: "0.25rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2a8 8 0 00-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 00-8-8z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {stint.location.toUpperCase()}
              </div>
            </div>

            {/* F1 HUD Spec Box */}
            <div className="stint-specs hud-mono">
              <div className="spec-item" title="Simulated engineering CPU load">
                <span className="spec-lbl">LOAD:</span>
                <span className="spec-val text-cyan">{stint.stintSpecs.compLoad}</span>
              </div>
              <div className="spec-item" title="Development energy heat index">
                <span className="spec-lbl">TEMP:</span>
                <span className="spec-val text-red">{stint.stintSpecs.temp}</span>
              </div>
              <div className="spec-item" title="Duration of stint">
                <span className="spec-lbl">LAP:</span>
                <span className="spec-val text-lime">{stint.stintSpecs.lapTime}</span>
              </div>
            </div>
          </div>

          <ul className="stint-highlights" style={{ marginTop: "1.5rem" }}>
            {stint.highlights.map((highlight, idx) => (
              <li key={idx}>
                <svg className="bullet-chevron" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="var(--accent-lime)" strokeWidth="4">
                  <path d="M9 18l6-6-6-6" />
                </svg>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  const { experience } = portfolioConfig;

  return (
    <section id="experience" className="section-padding" style={{ position: "relative", backgroundColor: "rgba(6, 7, 10, 0.2)" }}>
      <div className="container">
        
        <div className="section-header">
          <div className="section-info">
            <h2 className="text-lime">PIT STOP LOGS // PROFESSIONAL STINTS</h2>
            <p>
              Timeline logs of software development, data pipelines, and analytical engineering internships compiled under operational environments.
            </p>
          </div>
          <div className="hud-mono text-secondary" style={{ fontSize: "0.75rem", letterSpacing: "0.15em" }}>
            STINTS_RESOLVED: {experience.length}
          </div>
        </div>

        <div className="stints-timeline-container">
          <div className="stints-track-line"></div>
          {experience.map((stint, idx) => (
            <ExperienceStint key={idx} stint={stint} index={idx} />
          ))}
        </div>

      </div>
    </section>
  );
}
