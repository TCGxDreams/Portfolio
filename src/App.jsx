import React, { useState, useEffect, useRef } from "react";
import "./styles/main.css";
import "./styles/telemetry.css";

import Header from "./components/Header";
import MenuOverlay from "./components/MenuOverlay";
import Hero from "./components/Hero";
import OnTrack from "./components/OnTrack";
import Experience from "./components/Experience";
import Telemetry from "./components/Telemetry";
import Academy from "./components/Academy";
import OffTrack from "./components/OffTrack";
import Roadmap from "./components/Roadmap";
import Footer from "./components/Footer";

// VIP Upgrades: Background Canvas & Live Telemetry Marquee Stream
import TelemetryMesh from "./components/TelemetryMesh";
import LiveTelemetryStream from "./components/LiveTelemetryStream";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // Custom cursor refs
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);
  
  const mouse = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });

  // 1. Synthesize F1 Telemetry Audio blips (Web Audio API)
  const playSound = (type = "click") => {
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
        // High-tech confirm beep
        osc.type = "sine";
        osc.frequency.setValueAtTime(950, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.08);
        
        gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === "hover") {
        // Minimal digital trigger click
        osc.type = "triangle";
        osc.frequency.setValueAtTime(1600, ctx.currentTime);
        
        gainNode.gain.setValueAtTime(0.015, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.015);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.015);
      } else if (type === "menu-toggle") {
        // Double pitch transition for menu
        osc.type = "sine";
        osc.frequency.setValueAtTime(isMenuOpen ? 700 : 1100, ctx.currentTime);
        osc.frequency.setValueAtTime(isMenuOpen ? 500 : 1300, ctx.currentTime + 0.05);
        
        gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      }
    } catch (e) {
      // Fallback silently if blocked by user permissions
    }
  };

  // 2. Manage Body scroll lock on menu state change
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMenuOpen]);

  // 3. Custom Cursor Lerp & Pointer Spotlight Tracker
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      
      // Update ambient spot glow position
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
      }
      
      // Update lead cursor dot instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Smooth Lerp loops for outer cursor rings
    let animationFrameId;
    const updateCursorRing = () => {
      const lerpFactor = 0.12; // Dampened factor
      ring.current.x += (mouse.current.x - ring.current.x) * lerpFactor;
      ring.current.y += (mouse.current.y - ring.current.y) * lerpFactor;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(updateCursorRing);
    };
    updateCursorRing();

    // Global listener to scale cursor ring on interactive hover tags & play digital sounds
    const handleMouseOver = (e) => {
      const isInteractive = 
        e.target.tagName === "A" || 
        e.target.tagName === "BUTTON" || 
        e.target.closest("a") || 
        e.target.closest("button") ||
        e.target.classList.contains("form-input");

      if (isInteractive) {
        if (!document.body.classList.contains("hovering-link")) {
          // Play click blip on hover transition
          playSound("hover");
        }
        document.body.classList.add("hovering-link");
      } else {
        document.body.classList.remove("hovering-link");
      }
    };

    const handleGlobalClick = (e) => {
      const isInteractive = 
        e.target.tagName === "A" || 
        e.target.tagName === "BUTTON" || 
        e.target.closest("a") || 
        e.target.closest("button");
        
      if (isInteractive) {
        playSound("click");
      }
    };

    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("click", handleGlobalClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("click", handleGlobalClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* 1. Custom Telemetry Cursors */}
      <div ref={dotRef} className="custom-cursor"></div>
      <div ref={ringRef} className="custom-cursor-ring"></div>

      {/* 2. Ambient Spot Glow Following Cursor */}
      <div ref={glowRef} className="ambient-glow"></div>

      {/* 3. Dynamic Warp Particle Canvas Mesh */}
      <TelemetryMesh />

      {/* 4. Global HUD Scanlines */}
      <div className="hud-grid-overlay"></div>

      {/* 5. Page Header */}
      <Header 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={(state) => {
          playSound("menu-toggle");
          setIsMenuOpen(state);
        }} 
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />

      {/* 6. Fullscreen Overlay Navigation */}
      <MenuOverlay isOpen={isMenuOpen} setIsOpen={setIsOpen => {
        playSound("menu-toggle");
        setIsMenuOpen(setIsOpen);
      }} />

      {/* 7. Layout Main Content Sections */}
      <main>
        <Hero />
        <OnTrack />
        <Experience />
        <Telemetry isMuted={isMuted} />
        <Academy />
        <OffTrack />
        <Roadmap />
        <Footer />
      </main>

      {/* 8. Live Scrolling Telemetry Bar */}
      <LiveTelemetryStream />
    </>
  );
}
