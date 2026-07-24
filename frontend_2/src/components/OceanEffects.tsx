"use client";

import { useEffect, useRef } from "react";

// DOM-level ocean effects: click sonar rings, vignette darkening with depth
export default function OceanEffects() {
  const vignetteRef = useRef<HTMLDivElement>(null);
  const pressureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll handler: darken vignette and pressure lines with depth
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, window.scrollY / (maxScroll || 1)));

      if (vignetteRef.current) {
        // Vignette darkens as we go deeper
        const vigOpacity = 0.3 + progress * 0.6;
        vignetteRef.current.style.opacity = `${vigOpacity}`;
      }
      if (pressureRef.current) {
        // Pressure scan lines appear in deep zones
        const pressureOpacity = Math.max(0, (progress - 0.4) * 1.5);
        pressureRef.current.style.opacity = `${pressureOpacity}`;
      }
    };

    // Click handler: inject sonar ring DOM element at cursor position
    const onClick = (e: MouseEvent) => {
      const ring = document.createElement("div");
      ring.className = "ripple-ring";
      ring.style.left = `${e.clientX - 90}px`;
      ring.style.top = `${e.clientY - 90}px`;
      document.body.appendChild(ring);
      // Clean up after animation
      setTimeout(() => ring.remove(), 850);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("click", onClick);
    onScroll(); // init

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <>
      {/* Depth vignette */}
      <div
        ref={vignetteRef}
        className="depth-vignette"
        style={{ opacity: 0.3 }}
        aria-hidden="true"
      />
      {/* Pressure scan lines */}
      <div
        ref={pressureRef}
        className="pressure-lines"
        style={{ opacity: 0 }}
        aria-hidden="true"
      />
    </>
  );
}
