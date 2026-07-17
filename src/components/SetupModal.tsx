"use client";

import { useState } from "react";
import type { Gender, SurvivorClass } from "@/lib/types";
import { CLASS_DEFS } from "@/lib/types";

interface Props {
  onCreate: (name: string, gender: Gender, cls: SurvivorClass, date: string, weight: number) => void;
}

export default function SetupModal({ onCreate }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [gender, setGender] = useState<Gender>("male");
  const [name, setName] = useState("SODA");
  const [cls, setCls] = useState<SurvivorClass>("athlete");
  const [weight, setWeight] = useState("");
  const [error, setError] = useState("");

  const handleCreate = () => {
    const w = parseFloat(weight);
    if (!w || w <= 0) { setError("请输入有效体重"); return; }
    if (!name.trim()) { setError("请输入名字"); return; }
    onCreate(name.trim(), gender, cls, today, w);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-dark/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-base p-6 sm:p-8 space-y-6 border-2 border-dark shadow-[6px_6px_0_rgba(26,26,26,0.15)] animate-slide-up">

        <div className="text-center space-y-2">
          <div className="text-5xl">🏕️</div>
          <h2 className="text-xl font-black text-dark pixel-text tracking-tight">三伏天：40日生存挑战</h2>
        </div>

        {/* Step 1: Gender */}
        {step === 1 && (
          <div className="space-y-5">
            <p className="text-xs font-extrabold text-dark pixel-text text-center tracking-[0.2em] uppercase">选择幸存者</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => { setGender("male"); setStep(2); }}
                className="char-option p-4 flex flex-col items-center gap-2 hover:border-dark">
                <ChibiDude />
                <span className="text-xs font-extrabold text-dark pixel-text">♂ 男性</span>
              </button>
              <button onClick={() => { setGender("female"); setStep(2); }}
                className="char-option p-4 flex flex-col items-center gap-2 hover:border-dark">
                <ChibiGal />
                <span className="text-xs font-extrabold text-dark pixel-text">♀ 女性</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Name */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="text-center">
              <div className="text-4xl mb-2">{gender === "male" ? <ChibiDude /> : <ChibiGal />}</div>
              <p className="text-xs font-extrabold text-text-secondary pixel-text uppercase tracking-[0.2em]">幸存者代号</p>
            </div>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} maxLength={12}
              className="w-full bg-white/60 border-2 border-dark px-4 py-3 text-lg font-black text-dark pixel-text text-center placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
              placeholder="SODA" />
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="pixel-btn flex-1 py-3 text-sm bg-dark/5">← 返回</button>
              <button onClick={() => setStep(3)} className="pixel-btn pixel-btn-primary flex-1 py-3 text-sm">下一步 →</button>
            </div>
          </div>
        )}

        {/* Step 3: Class + Weight */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="text-center">
              <p className="text-xs font-black text-dark pixel-text">{name}</p>
              <p className="text-[10px] text-text-muted font-medium">{gender === "male" ? "♂" : "♀"} · 选择职业</p>
            </div>

            {/* Class selection */}
            <div className="space-y-2">
              {CLASS_DEFS.map(c => (
                <button key={c.id} onClick={() => setCls(c.id)}
                  className={`w-full flex items-center gap-3 p-3 border-2 transition-colors text-left ${
                    cls === c.id ? "border-primary bg-primary/5" : "border-dark/20 hover:border-dark/40"
                  }`}>
                  <span className="text-xl">{c.emoji}</span>
                  <div className="flex-1">
                    <p className="text-xs font-extrabold text-dark">{c.name}</p>
                    <p className="text-[10px] text-text-muted font-medium">{c.desc}</p>
                  </div>
                  {cls === c.id && <span className="text-primary font-extrabold text-xs">✓</span>}
                </button>
              ))}
            </div>

            {/* Weight */}
            <div>
              <label className="text-[10px] font-extrabold text-text-secondary uppercase tracking-[0.2em] block mb-1.5">初始体重</label>
              <div className="flex items-center gap-2">
                <input type="number" inputMode="decimal" step="0.1" placeholder="130" value={weight}
                  onChange={(e) => { setWeight(e.target.value); setError(""); }}
                  className="flex-1 bg-white/60 border-2 border-dark px-4 py-3 text-lg font-black text-dark pixel-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors" />
                <span className="text-sm font-bold text-text-secondary">KG</span>
              </div>
            </div>

            {error && <p className="text-xs text-primary font-extrabold text-center">{error}</p>}

            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="pixel-btn flex-1 py-3 text-sm bg-dark/5">← 返回</button>
              <button onClick={handleCreate} className="pixel-btn pixel-btn-primary flex-1 py-3 text-sm">🔥 开始挑战</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Chibi pixel sprites (big head, small body, dot eyes) ── */
function ChibiDude() {
  return (
    <svg width="40" height="48" viewBox="0 0 40 48" shapeRendering="crispEdges">
      <rect x="8" y="0" width="24" height="22" fill="#FFD5B8" rx="2" />
      <rect x="13" y="7" width="3" height="3" fill="#1A1A1A" />
      <rect x="24" y="7" width="3" height="3" fill="#1A1A1A" />
      <rect x="16" y="14" width="8" height="2" fill="#1A1A1A" opacity="0.4" />
      <rect x="12" y="22" width="16" height="14" fill="#8A8A8A" />
      <rect x="8" y="24" width="4" height="8" fill="#7A7A7A" />
      <rect x="28" y="24" width="4" height="8" fill="#7A7A7A" />
      <rect x="14" y="36" width="4" height="10" fill="#4A4A4A" />
      <rect x="22" y="36" width="4" height="10" fill="#4A4A4A" />
      <rect x="14" y="44" width="4" height="3" fill="#1A1A1A" />
      <rect x="22" y="44" width="4" height="3" fill="#1A1A1A" />
    </svg>
  );
}

function ChibiGal() {
  return (
    <svg width="40" height="52" viewBox="0 0 40 52" shapeRendering="crispEdges">
      <rect x="4" y="0" width="32" height="8" fill="#4A2A1A" />
      <rect x="8" y="8" width="24" height="20" fill="#FFD5B8" rx="2" />
      <rect x="13" y="14" width="3" height="3" fill="#1A1A1A" />
      <rect x="24" y="14" width="3" height="3" fill="#1A1A1A" />
      <rect x="16" y="20" width="8" height="2" fill="#1A1A1A" opacity="0.4" />
      <rect x="11" y="28" width="18" height="14" fill="#8A8A8A" />
      <rect x="7" y="30" width="4" height="8" fill="#7A7A7A" />
      <rect x="29" y="30" width="4" height="8" fill="#7A7A7A" />
      <rect x="13" y="42" width="4" height="8" fill="#4A4A4A" />
      <rect x="23" y="42" width="4" height="8" fill="#4A4A4A" />
      <rect x="13" y="48" width="4" height="3" fill="#1A1A1A" />
      <rect x="23" y="48" width="4" height="3" fill="#1A1A1A" />
    </svg>
  );
}
