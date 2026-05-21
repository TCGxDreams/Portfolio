import React, { useEffect, useRef } from "react";

export default function TelemetryMesh() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track window resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Track mouse position globally
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Grid configuration
    const cols = Math.ceil(width / 50) + 1;
    const rows = Math.ceil(height / 50) + 1;
    const particles = [];

    // Initialize particle grid
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        particles.push({
          baseX: x * 50,
          baseY: y * 50,
          x: x * 50,
          y: y * 50,
          angle: Math.random() * Math.PI * 2,
          speed: 0.02 + Math.random() * 0.02,
        });
      }
    }

    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.015;

      particles.forEach((p) => {
        // Dynamic wave movement using sine/cosine
        const waveX = Math.sin(p.baseY * 0.01 + time) * 12;
        const waveY = Math.cos(p.baseX * 0.01 + time) * 12;

        const targetX = p.baseX + waveX;
        const targetY = p.baseY + waveY;

        // Calculate proximity to mouse
        const dx = mouseRef.current.x - targetX;
        const dy = mouseRef.current.y - targetY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        let forceX = 0;
        let forceY = 0;
        const maxDist = 180;

        if (dist < maxDist) {
          // Push particles away from cursor
          const force = (maxDist - dist) / maxDist; // 0 to 1
          const angle = Math.atan2(dy, dx);
          forceX = -Math.cos(angle) * force * 35;
          forceY = -Math.sin(angle) * force * 35;
        }

        // Apply easing towards calculated targets
        p.x += (targetX + forceX - p.x) * 0.1;
        p.y += (targetY + forceY - p.y) * 0.1;

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        
        // Dynamic opacity based on proximity to mouse
        if (dist < maxDist) {
          ctx.fillStyle = `rgba(0, 243, 255, ${0.15 + (1 - dist/maxDist) * 0.25})`;
        } else {
          ctx.fillStyle = "rgba(210, 255, 0, 0.06)";
        }
        ctx.fill();

        // Subtle connection lines on proximity
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.strokeStyle = `rgba(0, 243, 255, ${(1 - dist/100) * 0.04})`;
          ctx.stroke();
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -3,
        pointerEvents: "none",
        backgroundColor: "transparent",
      }}
    />
  );
}
