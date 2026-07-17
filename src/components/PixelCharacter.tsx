"use client";

import type { Level } from "@/lib/types";

interface Props {
  level: Level;
  name: string;
}

/**
 * CSS pixel sprite character.
 * Built with box-shadow pixels — no images needed.
 * Level affects color/accessory.
 */
export default function PixelCharacter({ level, name }: Props) {
  const isHighLevel = level >= 4;
  const isMidLevel = level >= 2;

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Sprite */}
      <div className="relative" style={{ animation: "pixel-breathe 3s ease-in-out infinite" }}>
        <div
          className="relative"
          style={{
            width: 32, height: 48,
            imageRendering: "pixelated",
          }}
        >
          {/* Head */}
          <div className="absolute" style={{
            top: 0, left: 10, width: 12, height: 12,
            background: "#FFD5B8",
            boxShadow: isHighLevel
              ? "2px 12px 0 #FF6B35, -2px 12px 0 #FF6B35"
              : "",
          }} />
          {/* Eyes */}
          <div className="absolute" style={{ top: 4, left: 13, width: 2, height: 2, background: "#1A1A1A" }} />
          <div className="absolute" style={{ top: 4, left: 17, width: 2, height: 2, background: "#1A1A1A" }} />
          {/* Body */}
          <div className="absolute" style={{
            top: 12, left: 8, width: 16, height: 14,
            background: isHighLevel ? "#FF6B35" : isMidLevel ? "#5A5A5A" : "#8A8A8A",
          }} />
          {/* Arms */}
          <div className="absolute" style={{
            top: 14, left: 3, width: 5, height: 10,
            background: isHighLevel ? "#FF8C5A" : isMidLevel ? "#4A4A4A" : "#7A7A7A",
          }} />
          <div className="absolute" style={{
            top: 14, left: 24, width: 5, height: 10,
            background: isHighLevel ? "#FF8C5A" : isMidLevel ? "#4A4A4A" : "#7A7A7A",
          }} />
          {/* Legs */}
          <div className="absolute" style={{
            top: 26, left: 10, width: 5, height: 10,
            background: isHighLevel ? "#E55A2B" : isMidLevel ? "#3A3A3A" : "#6A6A6A",
          }} />
          <div className="absolute" style={{
            top: 26, left: 17, width: 5, height: 10,
            background: isHighLevel ? "#E55A2B" : isMidLevel ? "#3A3A3A" : "#6A6A6A",
          }} />
          {/* Shoes */}
          <div className="absolute" style={{ top: 36, left: 10, width: 5, height: 3, background: "#1A1A1A" }} />
          <div className="absolute" style={{ top: 36, left: 17, width: 5, height: 3, background: "#1A1A1A" }} />
          {/* High-level accessory */}
          {isHighLevel && (
            <div className="absolute" style={{
              top: -2, left: 11, width: 10, height: 2,
              background: "#FFB703",
            }} />
          )}
        </div>

        {/* Wiping sweat animation */}
        <div
          className="absolute"
          style={{
            top: -8, right: -6,
            fontSize: 8,
            animation: "pixel-wipe 4s ease-in-out infinite",
          }}
        >
          💧
        </div>
      </div>

      {/* Name */}
      <p className="text-[10px] font-black text-dark pixel-text">{name}</p>
    </div>
  );
}
