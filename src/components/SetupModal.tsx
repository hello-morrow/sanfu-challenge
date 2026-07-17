"use client";

import { useState } from "react";
import type { Gender } from "@/lib/types";

interface Props {
  onCreate: (name: string, gender: Gender, date: string, weight: number) => void;
}

export default function SetupModal({ onCreate }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [step, setStep] = useState<1 | 2>(1);
  const [gender, setGender] = useState<Gender>("male");
  const [name, setName] = useState("SODA");
  const [weight, setWeight] = useState("");
  const [error, setError] = useState("");

  const handleCreate = () => {
    const w = parseFloat(weight);
    if (!w || w <= 0) { setError("请输入有效体重"); return; }
    if (!name.trim()) { setError("请输入幸存者名字"); return; }
    onCreate(name.trim(), gender, today, w);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-dark/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-base p-6 sm:p-8 space-y-6 border-2 border-dark shadow-[6px_6px_0_rgba(26,26,26,0.15)] animate-slide-up">

        {/* Title */}
        <div className="text-center space-y-2">
          <div className="text-5xl">🏕️</div>
          <h2 className="text-xl font-black text-dark pixel-text tracking-tight">
            三伏天：40日生存挑战
          </h2>
          <p className="text-xs text-text-muted font-bold">欢迎来到夏日生存基地</p>
        </div>

        {step === 1 ? (
          <div className="space-y-5">
            <p className="text-xs font-extrabold text-dark pixel-text text-center tracking-[0.2em] uppercase">
              创建你的幸存者
            </p>

            {/* Gender Selection */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setGender("male")}
                className={`char-option p-4 flex flex-col items-center gap-2 ${gender === "male" ? "char-option-selected" : ""}`}>
                <div className="text-3xl">
                  <PixelDude color={gender === "male" ? "#FF6B35" : "#8A8A8A"} />
                </div>
                <span className="text-xs font-extrabold text-dark pixel-text">♂ 男性</span>
              </button>
              <button
                onClick={() => setGender("female")}
                className={`char-option p-4 flex flex-col items-center gap-2 ${gender === "female" ? "char-option-selected" : ""}`}>
                <div className="text-3xl">
                  <PixelGal color={gender === "female" ? "#FF6B35" : "#8A8A8A"} />
                </div>
                <span className="text-xs font-extrabold text-dark pixel-text">♀ 女性</span>
              </button>
            </div>

            {/* Name */}
            <div>
              <label className="text-[10px] font-extrabold text-text-secondary uppercase tracking-[0.2em] block mb-1.5">
                幸存者代号
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={12}
                className="w-full bg-white/60 border-2 border-dark px-4 py-3 text-sm font-black text-dark pixel-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                placeholder="SODA"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              className="pixel-btn pixel-btn-primary w-full py-3.5 text-sm">
              下一步 →
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Summary */}
            <div className="border-2 border-dark p-3 text-center space-y-1">
              <p className="text-xs font-black text-dark pixel-text">{name}</p>
              <p className="text-[10px] text-text-muted font-medium">{gender === "male" ? "♂ 男性" : "♀ 女性"} · 新手幸存者</p>
            </div>

            {/* Weight */}
            <div>
              <label className="text-[10px] font-extrabold text-text-secondary uppercase tracking-[0.2em] block mb-1.5">
                初始体重
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number" inputMode="decimal" step="0.1" placeholder="130"
                  value={weight}
                  onChange={(e) => { setWeight(e.target.value); setError(""); }}
                  className="flex-1 bg-white/60 border-2 border-dark px-4 py-3.5 text-lg font-black text-dark pixel-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                />
                <span className="text-sm font-bold text-text-secondary">KG</span>
              </div>
            </div>

            {error && <p className="text-xs text-primary font-extrabold text-center">{error}</p>}

            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="pixel-btn flex-1 py-3.5 text-sm bg-dark/5">
                ← 返回
              </button>
              <button onClick={handleCreate} className="pixel-btn pixel-btn-primary flex-1 py-3.5 text-sm">
                🔥 开始挑战
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* Mini pixel sprites for gender selection */
function PixelDude({ color }: { color: string }) {
  return (
    <svg width="32" height="40" viewBox="0 0 32 40" shapeRendering="crispEdges">
      <rect x="10" y="0" width="12" height="12" fill="#FFD5B8" />
      <rect x="12" y="4" width="2" height="2" fill="#1A1A1A" />
      <rect x="18" y="4" width="2" height="2" fill="#1A1A1A" />
      <rect x="8" y="12" width="16" height="14" fill={color} />
      <rect x="3" y="14" width="5" height="10" fill="#E55A2B" />
      <rect x="24" y="14" width="5" height="10" fill="#E55A2B" />
      <rect x="10" y="26" width="5" height="12" fill="#4A4A4A" />
      <rect x="17" y="26" width="5" height="12" fill="#4A4A4A" />
      <rect x="10" y="36" width="5" height="3" fill="#1A1A1A" />
      <rect x="17" y="36" width="5" height="3" fill="#1A1A1A" />
    </svg>
  );
}

function PixelGal({ color }: { color: string }) {
  return (
    <svg width="32" height="44" viewBox="0 0 32 44" shapeRendering="crispEdges">
      <rect x="4" y="0" width="24" height="6" fill="#4A2A1A" />
      <rect x="8" y="6" width="16" height="10" fill="#FFD5B8" />
      <rect x="10" y="8" width="2" height="2" fill="#1A1A1A" />
      <rect x="20" y="8" width="2" height="2" fill="#1A1A1A" />
      <rect x="7" y="16" width="18" height="14" fill={color} />
      <rect x="2" y="18" width="5" height="10" fill="#E55A2B" />
      <rect x="25" y="18" width="5" height="10" fill="#E55A2B" />
      <rect x="9" y="30" width="5" height="12" fill="#4A4A4A" />
      <rect x="18" y="30" width="5" height="12" fill="#4A4A4A" />
      <rect x="9" y="40" width="5" height="3" fill="#1A1A1A" />
      <rect x="18" y="40" width="5" height="3" fill="#1A1A1A" />
    </svg>
  );
}
