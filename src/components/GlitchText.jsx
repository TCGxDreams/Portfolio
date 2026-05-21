import React, { useState, useEffect, useRef } from "react";

export default function GlitchText({ text, speed = 30, triggerOnLoad = true }) {
  const [displayText, setDisplayText] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%@$_*+=[{]}|";
  const intervalRef = useRef(null);

  const triggerGlitch = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    let iterations = 0;
    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iterations) {
              return text[index];
            }
            if (char === " ") return " ";
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iterations >= text.length) {
        clearInterval(intervalRef.current);
      }
      iterations += 1 / 2; // Scramble speed factor
    }, speed);
  };

  useEffect(() => {
    if (triggerOnLoad) {
      triggerGlitch();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  return (
    <span 
      onMouseEnter={triggerGlitch}
      className="glitch-text-hud"
      style={{ display: "inline-block" }}
    >
      {displayText}
    </span>
  );
}
