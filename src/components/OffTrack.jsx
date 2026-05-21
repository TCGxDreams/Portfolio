import React, { useState } from "react";
import { portfolioConfig } from "../data";

export default function OffTrack() {
  const { offTrackLogs, leadership } = portfolioConfig;
  const [activeTab, setActiveTab] = useState("AWARDS"); // "AWARDS" | "LEADERSHIP"

  return (
    <section id="offtrack" className="section-padding" style={{ backgroundColor: "rgba(13, 15, 20, 0.2)" }}>
      <div className="container">
        
        <div className="section-header" style={{ alignItems: "center" }}>
          <div className="section-info">
            <h2 className="text-cyan">OFF-TRACK DIAGNOSTICS // LEAGUE & INITIATIVES</h2>
            <p>
              Achievements, national AI contests, robotics leagues, and student-led scientific communities outside the core professional workspace.
            </p>
          </div>

          {/* Navigation Cockpit Tabs */}
          <div className="telemetry-tab-selector hud-mono">
            <button 
              className={`telemetry-tab ${activeTab === "AWARDS" ? "active" : ""}`}
              onClick={() => setActiveTab("AWARDS")}
            >
              <span>AWARDS & LEAGUE</span>
            </button>
            <button 
              className={`telemetry-tab ${activeTab === "LEADERSHIP" ? "active" : ""}`}
              onClick={() => setActiveTab("LEADERSHIP")}
            >
              <span>LEADERSHIP & COMMS</span>
            </button>
          </div>
        </div>

        {activeTab === "AWARDS" ? (
          <div className="offtrack-grid">
            {offTrackLogs.map((log, idx) => (
              <div key={idx} className="hud-panel offtrack-card">
                <div className="hud-header-bar">
                  <span className="log-date">{log.date}</span>
                  <span className="text-lime">{log.category.toUpperCase()}</span>
                </div>
                <div className="hud-content" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "calc(100% - 37px)", padding: "1.25rem" }}>
                  <h4 className="log-title" style={{ fontSize: "1rem", color: "#fff", fontWeight: 600, marginTop: 0, marginBottom: "0.5rem" }}>
                    {log.title}
                  </h4>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", lineHeight: 1.4, margin: 0 }}>
                    {log.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="leadership-grid">
            {leadership.map((item, idx) => (
              <div key={idx} className="hud-panel leadership-card">
                <div className="hud-header-bar">
                  <span className="text-cyan font-hud">{item.role.toUpperCase()}</span>
                  <span className="hud-mono text-lime">{item.period}</span>
                </div>
                
                <div className="hud-content">
                  <h4 style={{ fontSize: "1.1rem", color: "#fff", fontWeight: 700, margin: "0 0 0.25rem 0", textTransform: "uppercase" }}>
                    {item.organization}
                  </h4>
                  <p className="hud-mono text-secondary" style={{ fontSize: "0.7rem", marginBottom: "1rem", letterSpacing: "0.05em" }}>
                    {item.description.toUpperCase()}
                  </p>

                  <ul className="stint-highlights" style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
                    {item.points.map((pt, pIdx) => (
                      <li key={pIdx} style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", alignItems: "flex-start", gap: "0.4rem", marginBottom: "0.4rem", lineHeight: 1.45 }}>
                        <svg className="bullet-chevron" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="var(--accent-lime)" strokeWidth="4" style={{ flexShrink: 0, marginTop: "0.25rem" }}>
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
