import React, { useState } from "react";
import { portfolioConfig } from "../data";

export default function Footer() {
  const { profile } = portfolioConfig;
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Quick validation check
    if (!e.target.checkValidity()) {
      return;
    }

    setSending(true);
    // Simulate telemetry radio signal upload
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      setFormState({ name: "", email: "", message: "" });
    }, 1500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  return (
    <footer id="contact" className="footer">
      <div className="container">
        
        <div className="footer-grid">
          {/* Column 1: System info & social handles */}
          <div>
            <div style={{ marginBottom: "2rem" }}>
              <div className="hud-mono" style={{ fontSize: "0.75rem", color: "var(--accent-lime)", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>
                TRANSMISSION TERMINAL
              </div>
              <h2 className="hud-title" style={{ fontSize: "2rem", color: "#fff" }}>
                CONNECT TO <br />
                THE GRID
              </h2>
            </div>
            
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "2.5rem", maxWidth: "450px" }}>
              Establishing connection feeds to downstream engineering networks. Send a secure telemetry packet to initiate synchronization.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem 1rem" }}>
              <div>
                <div className="hud-mono" style={{ fontSize: "0.6rem", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                  LOCAL STATION LOGS
                </div>
                <div className="hud-mono" style={{ fontSize: "0.85rem", color: "#fff", fontWeight: 600 }}>
                  {profile.location.toUpperCase()}
                </div>
              </div>
              <div>
                <div className="hud-mono" style={{ fontSize: "0.6rem", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                  DIRECT COMMS
                </div>
                <div className="hud-mono">
                  <a href={`mailto:${portfolioConfig.contacts.email}`} className="footer-link" style={{ fontSize: "0.85rem", color: "var(--accent-cyan)", fontWeight: 600, textDecoration: "none" }}>
                    {portfolioConfig.contacts.email}
                  </a>
                </div>
              </div>
              <div>
                <div className="hud-mono" style={{ fontSize: "0.6rem", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                  SPEED DIAL
                </div>
                <div className="hud-mono" style={{ fontSize: "0.85rem", color: "#fff", fontWeight: 600 }}>
                  {portfolioConfig.contacts.phone}
                </div>
              </div>
              <div>
                <div className="hud-mono" style={{ fontSize: "0.6rem", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                  SECURE CHANNELS
                </div>
                <div className="hud-mono" style={{ fontSize: "0.85rem", color: "var(--accent-lime)", fontWeight: 600 }}>
                  TLS_V1.3 // GCM_256
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Validation Form or Success State */}
          <div className="hud-panel" style={{ minHeight: "350px" }}>
            <div className="hud-header-bar">
              <span>COMMUNICATION TELEMETRY CHANNEL</span>
              <span className="text-lime">STATUS: READY</span>
            </div>

            <div className="hud-content">
              {submitted ? (
                <div 
                  style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    height: "260px",
                    textAlign: "center" 
                  }}
                >
                  <div className="indicator" style={{ width: "16px", height: "16px", backgroundColor: "var(--accent-lime)", borderRadius: "50%", marginBottom: "1rem", boxShadow: "0 0 15px var(--accent-lime)" }}></div>
                  <h3 className="hud-title text-lime" style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                    TRANSMISSION SENT
                  </h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", maxWidth: "320px", lineHeight: 1.5 }}>
                    Signal packets uploaded successfully. Connection pipeline established with terminal logs.
                  </p>
                  <button 
                    className="btn-telemetry-outline" 
                    onClick={() => setSubmitted(false)}
                    style={{ marginTop: "1.5rem", padding: "0.5rem 1.5rem" }}
                  >
                    <span>RESET TERMINAL</span>
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  <div className="form-group">
                    <label htmlFor="form-name">CALLSIGN / NAME</label>
                    <input 
                      type="text" 
                      id="form-name" 
                      name="name"
                      required
                      placeholder="e.g. MCLAREN_TECH"
                      value={formState.name}
                      onChange={handleInputChange}
                      className="form-input" 
                    />
                    <span className="form-error">Required field *</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="form-email">ROUTING ENDPOINT / EMAIL</label>
                    <input 
                      type="email" 
                      id="form-email" 
                      name="email"
                      required
                      placeholder="e.g. dev@endpoint.com"
                      value={formState.email}
                      onChange={handleInputChange}
                      className="form-input" 
                    />
                    <span className="form-error">Enter a valid telemetry routing address *</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="form-message">MESSAGE DATA</label>
                    <textarea 
                      id="form-message" 
                      name="message"
                      required
                      rows="4"
                      placeholder="Input secure packets description here..."
                      value={formState.message}
                      onChange={handleInputChange}
                      className="form-input" 
                      style={{ resize: "none" }}
                    ></textarea>
                    <span className="form-error">Message packets empty *</span>
                  </div>

                  <button 
                    type="submit" 
                    className="btn-telemetry" 
                    disabled={sending}
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    <span>{sending ? "UPLOADING PACKETS..." : "TRANSMIT DATA PACKETS"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Footer Base bar */}
        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} {profile.name.toUpperCase()} {profile.surname.toUpperCase()}. ALL SYSTEMS NOMINAL.
          </div>
          <div className="footer-links">
            <a href={portfolioConfig.contacts.github} target="_blank" rel="noopener noreferrer" className="footer-link">GITHUB (BILL)</a>
            <a href={portfolioConfig.contacts.githubDreams} target="_blank" rel="noopener noreferrer" className="footer-link">GITHUB (DREAMS)</a>
            <a href={portfolioConfig.contacts.linkedin} target="_blank" rel="noopener noreferrer" className="footer-link">LINKEDIN</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
