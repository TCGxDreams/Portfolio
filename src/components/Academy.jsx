import React, { useEffect, useRef, useState } from "react";
import { portfolioConfig } from "../data";

export default function Academy() {
  const { education, certifications, languages } = portfolioConfig;
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.disconnect();
    };
  }, []);

  return (
    <section id="academy" ref={sectionRef} className="section-padding" style={{ backgroundColor: "rgba(13, 15, 20, 0.4)" }}>
      <div className="container">

        <div className="section-header">
          <div className="section-info">
            <h2 className="text-cyan">DRIVERS ACADEMY // TRAINING & EDUCATION</h2>
            <p>
              Academic progression logs, specialised certifications, and linguistic telemetry feeds validating core research competencies.
            </p>
          </div>
          <div className="hud-mono text-secondary" style={{ fontSize: "0.75rem", letterSpacing: "0.15em" }}>
            ACADEMY_REF: GRAD_PENDING
          </div>
        </div>

        <div className="academy-dashboard">
          {/* Column 1: Academy Log (Education) */}
          <div className="hud-panel academy-education">
            <div className="hud-header-bar">
              <span>ACADEMY RECORDS // EDUCATION LOGS</span>
              <span className="text-lime">PTNK_COLETTE</span>
            </div>
            
            <div className="hud-content" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {education.map((edu, idx) => (
                <div key={idx} className="edu-card">
                  <div className="edu-card-header">
                    <span className="hud-mono text-cyan" style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                      [{edu.period}]
                    </span>
                    <span className="hud-mono text-lime" style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                      {edu.gpa}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.1rem", color: "#fff", margin: "0.5rem 0 0.25rem 0", textTransform: "uppercase" }}>
                    {edu.institution}
                  </h3>
                  
                  <div className="hud-mono text-secondary" style={{ fontSize: "0.7rem", marginBottom: "0.75rem" }}>
                    {edu.track.toUpperCase()} // {edu.location.toUpperCase()}
                  </div>

                  <ul className="edu-highlights">
                    {edu.highlights.map((highlight, hIdx) => (
                      <li key={hIdx}>
                        <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="4" style={{ marginRight: "0.5rem" }}>
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Stacked Certs & Languages */}
          <div className="academy-sidebar">
            {/* Certifications (Sim-Licenses) */}
            <div className="hud-panel sim-licenses">
              <div className="hud-header-bar">
                <span>SIMULATOR LICENSES // CERTIFICATIONS</span>
                <span className="text-cyan">QUALIFIED</span>
              </div>
              <div className="hud-content">
                <div className="certs-list">
                  {certifications.map((cert, idx) => (
                    <div key={idx} className="cert-item">
                      <div className="cert-badge hud-mono">
                        LIC_{String(idx + 1).padStart(2, "0")}
                      </div>
                      <div className="cert-info">
                        <div className="cert-title">{cert.title}</div>
                        <div className="cert-issuer hud-mono">{cert.issuer.toUpperCase()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Languages (Language Telemetry Mtrs) */}
            <div className="hud-panel language-telemetry">
              <div className="hud-header-bar">
                <span>LANGUAGE TELEMETRY FEEDS</span>
                <span className="text-lime">SIGNAL_GAIN</span>
              </div>
              <div className="hud-content" style={{ padding: "1.5rem" }}>
                <div className="lang-metrics-stack">
                  {languages.map((lang, idx) => (
                    <div key={idx} className="lang-metric-row">
                      <div className="lang-info hud-mono">
                        <span className="lang-name">{lang.name.toUpperCase()}</span>
                        <span className="lang-level text-secondary">[{lang.level.toUpperCase()}]</span>
                      </div>
                      <div className="lang-bar-track">
                        <div 
                          className="lang-bar-fill"
                          style={{ 
                            width: inView ? `${lang.value}%` : "0%",
                            backgroundColor: idx === 0 ? "var(--accent-lime)" : "var(--accent-cyan)"
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
