import React, { useEffect, useRef, useState } from "react";
import { portfolioConfig } from "../data";
import GnnSimulator from "./GnnSimulator";

// 1. Animated Circle Gauge component
function CircularGauge({ label, targetValue }) {
  const [percent, setPercent] = useState(0);
  const gaugeRef = useRef(null);
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // 251.3

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPercent(targetValue);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (gaugeRef.current) {
      observer.observe(gaugeRef.current);
    }

    return () => {
      if (gaugeRef.current) observer.disconnect();
    };
  }, [targetValue]);

  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div ref={gaugeRef} className="gauge-wrapper">
      <svg width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="50" cy="50" r={radius} className="circle-bg" />
        <circle 
          cx="50" 
          cy="50" 
          r={radius} 
          className="circle-val" 
          style={{ 
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset 
          }}
        />
      </svg>
      <div className="gauge-center-text">{percent}%</div>
      <div className="gauge-label">{label}</div>
    </div>
  );
}

// 2. Count-Up Stat Counter component
function StatCounter({ label, targetValue, format }) {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);

  useEffect(() => {
    let startTimestamp = null;
    const duration = 1500; // 1.5 seconds

    const animateCount = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing out quadratic
      const easeProgress = progress * (2 - progress);
      setCount(easeProgress * targetValue);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(animateCount);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) observer.disconnect();
    };
  }, [targetValue]);

  const displayValue = format === "decimal" 
    ? count.toFixed(1) 
    : Math.floor(count).toLocaleString();

  return (
    <div ref={counterRef} className="stat-item">
      <div className="num hud-mono text-lime">{displayValue}</div>
      <div className="lbl">{label}</div>
    </div>
  );
}

// 3. Dynamic Systems graph bars
function SystemsGraph({ data }) {
  const [inView, setInView] = useState(false);
  const graphRef = useRef(null);

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

    if (graphRef.current) {
      observer.observe(graphRef.current);
    }

    return () => {
      if (graphRef.current) observer.disconnect();
    };
  }, []);

  return (
    <div ref={graphRef} className="hud-panel" style={{ height: "100%" }}>
      <div className="hud-header-bar">
        <span>CORE CPU_LOAD TELEMETRY MATRIX</span>
        <span className="text-lime">100Hz</span>
      </div>
      <div className="hud-content">
        <div className="systems-graph">
          {data.map((val, idx) => (
            <div 
              key={idx} 
              className="graph-bar" 
              style={{ 
                height: inView ? `${val}%` : "5px",
                backgroundColor: idx % 2 === 0 ? "var(--accent-lime)" : "var(--accent-cyan)"
              }}
              title={`Load: ${val}%`}
            ></div>
          ))}
        </div>
        <div className="hud-mono" style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", fontSize: "0.6rem", color: "var(--text-secondary)" }}>
          <span>T - 22s</span>
          <span>T - 11s</span>
          <span>LATEST FEED (0.0ms DELAY)</span>
        </div>
      </div>
    </div>
  );
}

export default function Telemetry({ isMuted }) {
  const { telemetry } = portfolioConfig;
  const [activeView, setActiveView] = useState("DIAGNOSTICS"); // "DIAGNOSTICS" | "SIMULATOR"

  return (
    <section id="telemetry" className="section-padding">
      <div className="container">
        
        <div className="section-header" style={{ alignItems: "center" }}>
          <div className="section-info">
            <h2 className="text-lime">SYSTEM DIAGNOSTICS</h2>
            <p>
              Automated unit and performance checks computed locally. Visualizing layout execution, logic compilation, and physical system load.
            </p>
          </div>
          
          {/* Navigation Cockpit Tabs */}
          <div className="telemetry-tab-selector hud-mono">
            <button 
              className={`telemetry-tab ${activeView === "DIAGNOSTICS" ? "active" : ""}`}
              onClick={() => setActiveView("DIAGNOSTICS")}
            >
              <span>DIAGNOSTICS HUD</span>
            </button>
            <button 
              className={`telemetry-tab ${activeView === "SIMULATOR" ? "active" : ""}`}
              onClick={() => setActiveView("SIMULATOR")}
            >
              <span>GNN BINDING SITE SIMULATOR</span>
            </button>
          </div>
        </div>

        {activeView === "DIAGNOSTICS" ? (
          <div className="telemetry-grid">
            {/* Column 1: Circular Gauges */}
            <div className="hud-panel">
              <div className="hud-header-bar">
                <span>SYSTEM PERFORMANCE SCORES</span>
                <span className="text-cyan">AVG: 90.3%</span>
              </div>
              <div className="hud-content gauges-flex">
                {telemetry.gauges.map((gauge) => (
                  <CircularGauge 
                    key={gauge.id} 
                    label={gauge.label} 
                    targetValue={gauge.value} 
                  />
                ))}
              </div>
            </div>

            {/* Column 2: Count-Up Statistics */}
            <div className="hud-panel">
              <div className="hud-header-bar">
                <span>ACCUMULATED STATISTICAL METRICS</span>
                <span>SUM_SYS</span>
              </div>
              <div className="hud-content" style={{ display: "flex", alignItems: "center", height: "100%" }}>
                <div className="stats-list">
                  {telemetry.counters.map((counter) => (
                    <StatCounter 
                      key={counter.id} 
                      label={counter.label} 
                      targetValue={counter.targetValue} 
                      format={counter.format} 
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Column 3: Telemetry Graph */}
            <div>
              <SystemsGraph data={telemetry.historicalData} />
            </div>
          </div>
        ) : (
          <GnnSimulator isMuted={isMuted} />
        )}

      </div>
    </section>
  );
}
