import React, { useEffect, useRef, useState } from "react";
import { portfolioConfig } from "../data";

function ProjectCard({ project, index }) {
  const [inView, setInView] = useState(false);
  const cardRef = useRef(null);

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

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) observer.disconnect();
    };
  }, []);

  return (
    <div ref={cardRef} className="hud-panel project-card">
      <div className="hud-header-bar">
        <span>PROJECT_{String(index + 1).padStart(2, "0")}</span>
        <span className="text-cyan">LATENCY: {project.stats.latency}</span>
      </div>

      <div className="project-thumbnail">
        <img src={project.image} alt={project.title} loading="lazy" />
        <div className="project-tags">
          {project.tags.map((tag) => (
            <span key={tag} className="project-tag">{tag}</span>
          ))}
        </div>
      </div>

      <div className="hud-content">
        <h3 className="log-title" style={{ marginTop: 0 }}>{project.title}</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "1.5rem", minHeight: "68px" }}>
          {project.description}
        </p>

        <div className="telemetry-row">
          <span>THROUGHPUT RATIO</span>
          <span className="hud-mono text-lime">{project.stats.throughput}</span>
        </div>

        <div className="telemetry-row">
          <span>EFFICIENCY COEFFICIENT</span>
          <span className="hud-mono text-cyan">{project.stats.efficiency}%</span>
        </div>

        {/* Dynamic scroll-filled telemetry bar */}
        <div className="bar-track">
          <div 
            className="bar-fill" 
            style={{ width: inView ? `${project.stats.efficiency}%` : "0%" }}
          ></div>
        </div>

        <a 
          href={project.link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-telemetry-outline"
          style={{ width: "100%", justifyContent: "center", padding: "0.6rem" }}
        >
          <span>VIEW REPOSITORY</span>
        </a>
      </div>
    </div>
  );
}

export default function OnTrack() {
  return (
    <section id="projects" className="section-padding">
      <div className="container">
        
        <div className="section-header">
          <div className="section-info">
            <h2 className="text-lime">ON-TRACK TELEMETRY</h2>
            <p>
              High-performance systems and interactive deployments validated under peak load. Select a card to inspect source code metrics.
            </p>
          </div>
          <div className="hud-mono text-secondary" style={{ fontSize: "0.75rem", letterSpacing: "0.15em" }}>
            SYSTEM_STATUS: STABLE
          </div>
        </div>

        <div className="projects-grid">
          {portfolioConfig.projects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx} />
          ))}
        </div>

      </div>
    </section>
  );
}
