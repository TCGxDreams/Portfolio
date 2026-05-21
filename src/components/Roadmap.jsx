import React from "react";
import { portfolioConfig } from "../data";

export default function Roadmap() {
  const { roadmap } = portfolioConfig;

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "var(--accent-lime)";
      case "IN PROGRESS":
        return "var(--accent-cyan)";
      default:
        return "var(--text-secondary)";
    }
  };

  return (
    <section id="roadmap" className="section-padding" style={{ backgroundColor: "rgba(13, 15, 20, 0.2)" }}>
      <div className="container">
        
        <div className="section-header">
          <div className="section-info">
            <h2 className="text-cyan">SYSTEM ROADMAP</h2>
            <p>
              Strategic timeline for integrating real-time telemetry systems, experimental libraries, and virtual sim-rig portals.
            </p>
          </div>
          <div className="hud-mono text-secondary" style={{ fontSize: "0.75rem", letterSpacing: "0.15em" }}>
            PHASE: 2026_V2
          </div>
        </div>

        <div className="hud-panel" style={{ padding: "2rem" }}>
          <div className="roadmap-timeline">
            {roadmap.map((item, idx) => (
              <div 
                key={idx} 
                className={`roadmap-item ${item.status === "COMPLETED" ? "completed" : ""}`}
              >
                <div className="roadmap-header">
                  <div className="roadmap-q text-lime">{item.quarter}</div>
                  <div 
                    className="roadmap-status hud-mono"
                    style={{ 
                      color: getStatusColor(item.status),
                      borderColor: getStatusColor(item.status) + "22",
                      border: "1px solid"
                    }}
                  >
                    {item.status}
                  </div>
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#fff", marginBottom: "0.5rem" }}>
                  {item.title}
                </h3>
                <p className="roadmap-body">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
