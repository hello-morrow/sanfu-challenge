"use client";

import type { Gender } from "@/lib/types";

interface Props {
  level: number;
  gender?: Gender;
  size?: number;
}

/** SVG pixel character — male/female variants, level-based colors */
export default function PixelCharacter({ level, gender = "male", size = 48 }: Props) {
  const isHigh = level >= 20;
  const isMid = level >= 10;
  const mainColor = isHigh ? "#FF6B35" : isMid ? "#5A5A5A" : "#8A8A8A";
  const skinColor = isHigh ? "#FFD5B8" : "#FFE0C8";
  const accentColor = isHigh ? "#FFB703" : isMid ? "#4A4A4A" : "#6A6A6A";

  return (
    <div className="relative inline-block" style={{ animation: "pixel-breathe 3s ease-in-out infinite" }}>
      {gender === "male" ? (
        <svg width={size} height={size * 1.25} viewBox="0 0 32 40" shapeRendering="crispEdges">
          {/* Head */}
          <rect x="10" y="0" width="12" height="12" fill={skinColor} />
          <rect x="12" y="4" width="2" height="2" fill="#1A1A1A" />
          <rect x="18" y="4" width="2" height="2" fill="#1A1A1A" />
          {/* Mouth */}
          <rect x="14" y="9" width="4" height="1" fill="#1A1A1A" opacity="0.5" />
          {/* Body */}
          <rect x="8" y="12" width="16" height="14" fill={mainColor} />
          {/* Arms */}
          <rect x="3" y="14" width="5" height="10" fill={accentColor} />
          <rect x="24" y="14" width="5" height="10" fill={accentColor} />
          {/* Legs */}
          <rect x="10" y="26" width="5" height="12" fill="#4A4A4A" />
          <rect x="17" y="26" width="5" height="12" fill="#4A4A4A" />
          {/* Shoes */}
          <rect x="10" y="36" width="5" height="3" fill="#1A1A1A" />
          <rect x="17" y="36" width="5" height="3" fill="#1A1A1A" />
          {/* High level: headband */}
          {isHigh && <rect x="9" y="-2" width="14" height="3" fill={accentColor} />}
          {/* Mid level: belt */}
          {isMid && <rect x="8" y="24" width="16" height="2" fill={accentColor} />}
        </svg>
      ) : (
        <svg width={size} height={size * 1.375} viewBox="0 0 32 44" shapeRendering="crispEdges">
          {/* Hair */}
          <rect x="4" y="0" width="24" height="6" fill={isHigh ? "#FFB703" : "#4A2A1A"} />
          {/* Head */}
          <rect x="8" y="6" width="16" height="10" fill={skinColor} />
          <rect x="10" y="8" width="2" height="2" fill="#1A1A1A" />
          <rect x="20" y="8" width="2" height="2" fill="#1A1A1A" />
          <rect x="14" y="12" width="4" height="1" fill="#1A1A1A" opacity="0.4" />
          {/* Body */}
          <rect x="7" y="16" width="18" height="14" fill={mainColor} />
          {/* Arms */}
          <rect x="2" y="18" width="5" height="10" fill={accentColor} />
          <rect x="25" y="18" width="5" height="10" fill={accentColor} />
          {/* Legs */}
          <rect x="9" y="30" width="5" height="12" fill="#4A4A4A" />
          <rect x="18" y="30" width="5" height="12" fill="#4A4A4A" />
          {/* Shoes */}
          <rect x="9" y="40" width="5" height="3" fill="#1A1A1A" />
          <rect x="18" y="40" width="5" height="3" fill="#1A1A1A" />
          {/* High level: hair highlight */}
          {isHigh && <rect x="10" y="0" width="8" height="2" fill="#FFF3D6" opacity="0.6" />}
          {isMid && <rect x="7" y="28" width="18" height="2" fill={accentColor} />}
        </svg>
      )}
      {/* Sweat */}
      <div className="absolute -top-1 -right-2 text-[8px]" style={{ animation: "sweat-fall 3s ease-in infinite" }}>
        💧
      </div>
    </div>
  );
}
