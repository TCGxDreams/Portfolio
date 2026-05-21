import React, { useState, useEffect, useRef } from "react";

// Residue data representing a simulated protein-ligand binding pocket
const RESIDUE_NODES = [
  { id: "Cys145", label: "CYS-145", baseX: 160, baseY: 110, affinity: 0.96, dist: 2.84, electrostatic: -14.2, category: "ACTIVE_SITE", layer: 1 },
  { id: "His41", label: "HIS-41", baseX: 340, baseY: 110, affinity: 0.92, dist: 3.12, electrostatic: -11.5, category: "ACTIVE_SITE", layer: 1 },
  { id: "Glu166", label: "GLU-166", baseX: 140, baseY: 240, affinity: 0.94, dist: 2.91, electrostatic: -15.8, category: "HYDROGEN_BOND", layer: 1 },
  { id: "Asp187", label: "ASP-187", baseX: 360, baseY: 240, affinity: 0.84, dist: 3.84, electrostatic: -8.4, category: "SALT_BRIDGE", layer: 2 },
  { id: "Gly143", label: "GLY-143", baseX: 250, baseY: 70, affinity: 0.78, dist: 3.42, electrostatic: -5.2, category: "VAN_DER_WAALS", layer: 2 },
  { id: "Met49", label: "MET-49", baseX: 250, baseY: 280, affinity: 0.70, dist: 4.10, electrostatic: -3.1, category: "HYDROPHOBIC", layer: 3 },
  { id: "Pro168", label: "PRO-168", baseX: 80, baseY: 175, affinity: 0.55, dist: 5.20, electrostatic: -1.2, category: "PERIPHERAL", layer: 4 },
  { id: "Gln189", label: "GLN-189", baseX: 420, baseY: 175, affinity: 0.48, dist: 5.80, electrostatic: -0.8, category: "PERIPHERAL", layer: 5 }
];

export default function GnnSimulator({ isMuted }) {
  const [activeTab, setActiveTab] = useState("GNN_RESOLVE"); // GNN_RESOLVE | LIGAND_AFFINITY | MUTATION_ANALYSIS
  
  // Interactive control parameters
  const [layerDepth, setLayerDepth] = useState(3);
  const [signalSpeed, setSignalSpeed] = useState(40);
  const [probThreshold, setProbThreshold] = useState(0.5);
  
  // Docking steps slider (only for affinity graph view)
  const [dockingStep, setDockingStep] = useState(25);
  
  // Spring positions of residues
  const [nodePositions, setNodePositions] = useState(() => 
    RESIDUE_NODES.map(node => ({ ...node, x: node.baseX, y: node.baseY }))
  );
  
  // Hovered residue state
  const [hoveredNode, setHoveredNode] = useState(null);
  
  const svgRef = useRef(null);
  const mousePos = useRef({ x: -1000, y: -1000 });
  const velocities = useRef(RESIDUE_NODES.map(() => ({ x: 0, y: 0 })));
  const currentPositions = useRef(RESIDUE_NODES.map(node => ({ x: node.baseX, y: node.baseY })));

  // Sound generator
  const playLocalSound = (type = "hover") => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      if (type === "click") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.05);
        gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else {
        // Subtle digital cursor blip
        osc.type = "sine";
        osc.frequency.setValueAtTime(1480, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.008, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.01);
        osc.start();
        osc.stop(ctx.currentTime + 0.01);
      }
    } catch (e) {}
  };

  // Convert mouse screen coordinates into local SVG coordinate space
  const handleMouseMove = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    mousePos.current = {
      x: ((e.clientX - rect.left) / rect.width) * 500,
      y: ((e.clientY - rect.top) / rect.height) * 350
    };
  };

  const handleMouseLeave = () => {
    mousePos.current = { x: -1000, y: -1000 };
    setHoveredNode(null);
  };

  // spring physics simulation loop
  useEffect(() => {
    let animId;
    const stiffness = 0.08;
    const damping = 0.75;
    const repulsionRadius = 90;

    const updatePhysics = () => {
      const updated = RESIDUE_NODES.map((node, idx) => {
        const curr = currentPositions.current[idx];
        const vel = velocities.current[idx];

        // 1. Calculate base position and mouse repulsion force
        let targetX = node.baseX;
        let targetY = node.baseY;

        const dx = mousePos.current.x - node.baseX;
        const dy = mousePos.current.y - node.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < repulsionRadius) {
          const force = (repulsionRadius - dist) / repulsionRadius;
          const angle = Math.atan2(dy, dx);
          // Push away from mouse
          targetX += -Math.cos(angle) * force * 24;
          targetY += -Math.sin(angle) * force * 24;
        }

        // 2. Spring formula: Hooke's law with velocity damping
        const ax = (targetX - curr.x) * stiffness;
        const ay = (targetY - curr.y) * stiffness;

        vel.x = (vel.x + ax) * damping;
        vel.y = (vel.y + ay) * damping;

        curr.x += vel.x;
        curr.y += vel.y;

        return {
          ...node,
          x: curr.x,
          y: curr.y
        };
      });

      setNodePositions(updated);
      animId = requestAnimationFrame(updatePhysics);
    };

    updatePhysics();

    return () => cancelAnimationFrame(animId);
  }, []);

  const handleTabChange = (tabName) => {
    playLocalSound("click");
    setActiveTab(tabName);
  };

  // Filter residues based on UI criteria
  const activeResidues = nodePositions.filter(
    node => node.layer <= layerDepth && node.affinity >= probThreshold
  );

  // Simulated Free Energy minimization values (50 steps)
  const bindingEnergyData = Array.from({ length: 51 }, (_, step) => {
    // Docking energy drops exponentially and fluctuates towards the end
    const progress = step / 50;
    const baseEnergy = -2.0 - 7.5 * (1 - Math.exp(-step * 0.12));
    const noise = Math.sin(step * 0.8) * 0.25 * Math.max(0, 1 - progress);
    return { step, energy: parseFloat((baseEnergy + noise).toFixed(2)) };
  });

  return (
    <div className="gnn-simulator-wrapper" style={{ marginTop: "2rem" }}>
      {/* 1. Steering Dials Selector Panel */}
      <div className="steering-dials-container">
        <button 
          onClick={() => handleTabChange("GNN_RESOLVE")}
          className={`dial-btn ${activeTab === "GNN_RESOLVE" ? "active" : ""}`}
        >
          <div className="dial-notch"></div>
          <span className="hud-mono">GNN_RESOLVE</span>
        </button>
        <button 
          onClick={() => handleTabChange("LIGAND_AFFINITY")}
          className={`dial-btn ${activeTab === "LIGAND_AFFINITY" ? "active" : ""}`}
        >
          <div className="dial-notch"></div>
          <span className="hud-mono">LIGAND_AFFINITY</span>
        </button>
        <button 
          onClick={() => handleTabChange("MUTATION_ANALYSIS")}
          className={`dial-btn ${activeTab === "MUTATION_ANALYSIS" ? "active" : ""}`}
        >
          <div className="dial-notch"></div>
          <span className="hud-mono">MUTATION_ANALYSIS</span>
        </button>
      </div>

      <div className="gnn-dashboard-layout">
        {/* Left Side: SVG Visualization Viewport */}
        <div 
          className="hud-panel visualizer-viewport"
          style={{ height: "420px", display: "flex", flexDirection: "column" }}
        >
          <div className="hud-header-bar">
            <span>GRAPH INTERACTION HUD</span>
            <span className="text-lime">{activeTab}</span>
          </div>

          <div style={{ position: "relative", flexGrow: 1, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {activeTab === "GNN_RESOLVE" && (
              <svg 
                ref={svgRef}
                viewBox="0 0 500 350" 
                style={{ width: "100%", height: "100%", cursor: "crosshair" }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {/* Defs for gradients & filters */}
                <defs>
                  <radialGradient id="ligandGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity="0" />
                  </radialGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Central Ligand Glow Ring */}
                <circle cx="250" cy="175" r="45" fill="url(#ligandGlow)" />

                {/* Connection lines (edges) with pulsing animation */}
                {activeResidues.map((node) => {
                  // Stroke density/opacity corresponds to affinity strength
                  const opacity = 0.15 + (node.affinity - probThreshold) * 0.8;
                  const speedSec = (100 - signalSpeed) * 0.1; // lower speed = higher delay in animation
                  return (
                    <line
                      key={`edge-${node.id}`}
                      x1="250"
                      y1="175"
                      x2={node.x}
                      y2={node.y}
                      stroke={node.affinity > 0.8 ? "var(--accent-lime)" : "var(--accent-cyan)"}
                      strokeWidth={1.5 + (node.affinity * 1.5)}
                      strokeOpacity={Math.max(0.1, opacity)}
                      strokeDasharray={node.affinity > 0.8 ? "6, 4" : "4, 6"}
                      style={{
                        animation: signalSpeed > 0 ? `dash-flow ${speedSec}s linear infinite` : "none"
                      }}
                    />
                  );
                })}

                {/* Central Ligand Node */}
                <g transform="translate(250, 175)" filter="url(#glow)">
                  <circle cx="0" cy="0" r="14" fill="#000" stroke="var(--accent-cyan)" strokeWidth="2.5" />
                  <circle cx="0" cy="0" r="5" fill="var(--accent-cyan)" />
                  {/* Outer mechanical gear rings */}
                  <circle cx="0" cy="0" r="22" fill="none" stroke="var(--border-dim)" strokeWidth="1" strokeDasharray="3, 3" />
                </g>
                <text x="250" y="210" textAnchor="middle" fill="#fff" className="hud-mono" style={{ fontSize: "0.6rem", letterSpacing: "0.05em" }}>
                  LIGAND_734B
                </text>

                {/* Residue Nodes */}
                {activeResidues.map((node) => {
                  const isHovered = hoveredNode?.id === node.id;
                  const nodeColor = node.affinity > 0.9 
                    ? "var(--accent-lime)" 
                    : node.affinity > 0.7 
                      ? "var(--accent-cyan)" 
                      : "var(--text-secondary)";

                  return (
                    <g 
                      key={node.id} 
                      transform={`translate(${node.x}, ${node.y})`}
                      style={{ cursor: "pointer" }}
                      onMouseEnter={() => {
                        playLocalSound("hover");
                        setHoveredNode(node);
                      }}
                    >
                      {/* Active glowing ring on hover */}
                      <circle 
                        cx="0" 
                        cy="0" 
                        r={isHovered ? 16 : 10} 
                        fill="none" 
                        stroke={nodeColor} 
                        strokeWidth="1" 
                        strokeOpacity={isHovered ? 0.8 : 0.2}
                        style={{ transition: "r 0.15s ease" }}
                      />
                      <circle 
                        cx="0" 
                        cy="0" 
                        r="6" 
                        fill={isHovered ? nodeColor : "#0d172e"} 
                        stroke={nodeColor} 
                        strokeWidth="2" 
                        style={{ transition: "fill 0.15s ease" }}
                      />
                      {/* Residue text tag */}
                      <text 
                        y="-12" 
                        textAnchor="middle" 
                        fill={isHovered ? "#fff" : "var(--text-secondary)"} 
                        className="hud-mono" 
                        style={{ fontSize: "0.65rem", fontWeight: isHovered ? 700 : 500 }}
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            )}

            {activeTab === "LIGAND_AFFINITY" && (
              <div style={{ width: "85%", height: "80%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <svg viewBox="0 0 450 200" style={{ overflow: "visible" }}>
                  {/* Energy grid bounds */}
                  <line x1="40" y1="20" x2="40" y2="180" stroke="var(--border-dim)" strokeWidth="1" />
                  <line x1="40" y1="180" x2="430" y2="180" stroke="var(--border-dim)" strokeWidth="1" />
                  
                  {/* Grid dashlines */}
                  {[60, 100, 140].map((y, idx) => (
                    <line key={idx} x1="40" y1={y} x2="430" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3,3" />
                  ))}

                  {/* Graph Label Axes */}
                  <text x="35" y="25" textAnchor="end" fill="var(--text-secondary)" className="hud-mono" style={{ fontSize: "0.55rem" }}>0.0</text>
                  <text x="35" y="100" textAnchor="end" fill="var(--text-secondary)" className="hud-mono" style={{ fontSize: "0.55rem" }}>-6.0</text>
                  <text x="35" y="180" textAnchor="end" fill="var(--text-secondary)" className="hud-mono" style={{ fontSize: "0.55rem" }}>-12.0</text>
                  <text x="15" y="100" textAnchor="middle" transform="rotate(-90 15 100)" fill="var(--accent-red)" className="hud-mono" style={{ fontSize: "0.6rem" }}>FREE ENERGY (kcal/mol)</text>
                  
                  <text x="40" y="192" textAnchor="middle" fill="var(--text-secondary)" className="hud-mono" style={{ fontSize: "0.55rem" }}>STEP 0</text>
                  <text x="235" y="192" textAnchor="middle" fill="var(--text-secondary)" className="hud-mono" style={{ fontSize: "0.55rem" }}>STEP 25</text>
                  <text x="430" y="192" textAnchor="middle" fill="var(--text-secondary)" className="hud-mono" style={{ fontSize: "0.55rem" }}>STEP 50</text>
                  <text x="235" y="208" textAnchor="middle" fill="var(--accent-cyan)" className="hud-mono" style={{ fontSize: "0.6rem" }}>DOCKING MINIMIZATION ITERATIONS</text>

                  {/* SVG Energy Line graph */}
                  <path
                    d={bindingEnergyData
                      .filter(d => d.step <= dockingStep)
                      .map((d, i) => {
                        const x = 40 + (d.step / 50) * 390;
                        // Map energy range [-2, -10] to pixel height [40, 170]
                        const y = 40 + ((d.energy + 2) / -8) * 130;
                        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                      })
                      .join(" ")}
                    fill="none"
                    stroke="var(--accent-cyan)"
                    strokeWidth="2.5"
                    filter="url(#glow)"
                  />

                  {/* Highlight current point dot */}
                  {dockingStep >= 0 && (() => {
                    const currentData = bindingEnergyData[dockingStep];
                    const x = 40 + (currentData.step / 50) * 390;
                    const y = 40 + ((currentData.energy + 2) / -8) * 130;
                    return (
                      <g>
                        <circle cx={x} cy={y} r="6" fill="var(--accent-lime)" />
                        <line x1={x} y1={y} x2={x} y2="180" stroke="var(--accent-lime)" strokeWidth="0.8" strokeDasharray="2,2" />
                        <line x1="40" y1={y} x2={x} y2={y} stroke="var(--accent-lime)" strokeWidth="0.8" strokeDasharray="2,2" />
                      </g>
                    );
                  })()}
                </svg>

                {/* Slide interactive optimizer steps */}
                <div style={{ marginTop: "1rem", padding: "0 0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem", fontSize: "0.65rem" }}>
                    <span className="hud-mono text-secondary">ACTIVE ITERATION: STEP {dockingStep}/50</span>
                    <span className="hud-mono text-lime">ENERGY: {bindingEnergyData[dockingStep].energy} kcal/mol</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={dockingStep}
                    onChange={(e) => {
                      playLocalSound("hover");
                      setDockingStep(parseInt(e.target.value));
                    }}
                    style={{ width: "100%", accentColor: "var(--accent-lime)" }}
                  />
                </div>
              </div>
            )}

            {activeTab === "MUTATION_ANALYSIS" && (
              <div style={{ width: "85%", height: "80%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: "0.85rem", justifyContent: "center" }}>
                  <div className="hud-mono" style={{ fontSize: "0.6rem", color: "var(--text-secondary)", marginBottom: "0.2rem" }}>
                    SENSITIVITY LOSS RATIO (ΔΔG kcal/mol)
                  </div>
                  {RESIDUE_NODES.map((res) => {
                    // Normalize sensitivity: affinity * scale
                    const energyShift = parseFloat((res.affinity * 4.2).toFixed(1));
                    const widthPercent = (res.affinity * 100).toFixed(0);
                    return (
                      <div key={res.id} style={{ display: "grid", gridTemplateColumns: "70px 1fr 50px", alignItems: "center", gap: "1rem" }}>
                        <span className="hud-mono" style={{ fontSize: "0.7rem", color: "#fff" }}>{res.id}</span>
                        <div style={{ height: "6px", backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "3px", overflow: "hidden" }}>
                          <div 
                            style={{ 
                              height: "100%", 
                              width: `${widthPercent}%`, 
                              backgroundColor: res.affinity > 0.9 ? "var(--accent-lime)" : "var(--accent-cyan)",
                              borderRadius: "3px"
                            }}
                          ></div>
                        </div>
                        <span className="hud-mono text-right" style={{ fontSize: "0.7rem", color: "var(--accent-red)", textAlign: "right" }}>
                          +{energyShift}G
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Float Node details popup card overlay */}
            {activeTab === "GNN_RESOLVE" && hoveredNode && (
              <div 
                className="hud-panel node-detail-popover hud-mono"
                style={{ 
                  position: "absolute", 
                  bottom: "1rem", 
                  left: "1rem", 
                  width: "230px", 
                  padding: "0.75rem",
                  backgroundColor: "rgba(18, 21, 28, 0.95)",
                  border: "1px solid var(--accent-cyan)",
                  fontSize: "0.65rem",
                  lineHeight: "1.4"
                }}
              >
                <div style={{ borderBottom: "1px solid var(--accent-cyan)", paddingBottom: "0.25rem", marginBottom: "0.4rem", fontWeight: 700, color: "var(--accent-cyan)" }}>
                  RESIDUE DIAGNOSTICS: {hoveredNode.label}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>CLASSIFICATION:</span>
                  <span className="text-lime">{hoveredNode.category}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>POCKET DISTANCE:</span>
                  <span style={{ color: "#fff" }}>{hoveredNode.dist} Å</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>ELECTROSTATIC POT:</span>
                  <span className="text-red">{hoveredNode.electrostatic} kJ/mol</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.2rem", borderTop: "1px solid var(--border-dim)", paddingTop: "0.2rem" }}>
                  <span>BINDING PROBABILITY:</span>
                  <span className="text-lime" style={{ fontWeight: 700 }}>{(hoveredNode.affinity * 100).toFixed(0)}%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Telemetry Adjustments Panel */}
        <div className="hud-panel controls-panel" style={{ height: "420px", display: "flex", flexDirection: "column" }}>
          <div className="hud-header-bar">
            <span>MODEL TELEMETRY CALIBRATION</span>
            <span>SET_V4.2</span>
          </div>
          
          <div className="hud-content" style={{ display: "flex", flexDirection: "column", gap: "1.5rem", justifyContent: "center", flexGrow: 1 }}>
            
            {/* Slider 1: Layer Depth */}
            <div className="control-group">
              <div className="control-label-row hud-mono">
                <span>GNN LAYER DEPTH</span>
                <span className="text-lime">L_{layerDepth} LAYER</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={layerDepth} 
                onChange={(e) => {
                  playLocalSound("hover");
                  setLayerDepth(parseInt(e.target.value));
                }}
                className="slider-input"
              />
              <div className="control-desc">
                Adjusts total message-passing steps resolving outer residue graphs.
              </div>
            </div>

            {/* Slider 2: Signal Speed */}
            <div className="control-group">
              <div className="control-label-row hud-mono">
                <span>SIGNAL EXPANSION RATE</span>
                <span className="text-cyan">{signalSpeed} Hz</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={signalSpeed} 
                onChange={(e) => {
                  playLocalSound("hover");
                  setSignalSpeed(parseInt(e.target.value));
                }}
                className="slider-input"
              />
              <div className="control-desc">
                Speeds up/slows down training step vector pulses along connection edges.
              </div>
            </div>

            {/* Slider 3: Probability Threshold */}
            <div className="control-group">
              <div className="control-label-row hud-mono">
                <span>CONFIDENCE THRESHOLD</span>
                <span className="text-red">P &gt;= {probThreshold.toFixed(2)}</span>
              </div>
              <input 
                type="range" 
                min="0.4" 
                max="0.95" 
                step="0.05"
                value={probThreshold} 
                onChange={(e) => {
                  playLocalSound("hover");
                  setProbThreshold(parseFloat(e.target.value));
                }}
                className="slider-input"
              />
              <div className="control-desc">
                Filters residues falling below prediction threshold to isolate pocket center.
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
