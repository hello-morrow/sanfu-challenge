"use client";

import { useEffect, useState } from "react";

/** Ambient heat effects: dust particles + shimmer + sun glow */
export default function HeatOverlay() {
  const [particles, setParticles] = useState<{ id: number; left: number; delay: number; duration: number; size: number }[]>([]);

  useEffect(() => {
    const p = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 8,
      size: 1 + Math.random() * 2,
    }));
    setParticles(p);
  }, []);

  return (
    <>
      {/* Sun glow */}
      <div className="sun-glow" />

      {/* Heat shimmer */}
      <div className="heat-shimmer" />

      {/* Dust particles */}
      <div className="dust-container">
        {particles.map(p => (
          <div
            key={p.id}
            className="dust-particle"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}
