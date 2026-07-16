"use client";

import { useState } from "react";

interface Props {
  onStart: (date: string, weight: number, targetWeight: number | null) => void;
}

export default function SetupModal({ onStart }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [date] = useState(today);
  const [weight, setWeight] = useState("");
  const [target, setTarget] = useState("");
  const [error, setError] = useState("");

  const handleStart = () => {
    const w = parseFloat(weight);
    if (!w || w <= 0) { setError("请输入当前体重"); return; }
    const t = target ? parseFloat(target) : null;
    if (t !== null && t <= 0) { setError("目标体重无效"); return; }
    onStart(date, w, t);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-center bg-base px-4">
      <div className="max-w-lg mx-auto w-full space-y-8 animate-slide-up">

        {/* ── Brand ── */}
        <div className="text-center space-y-3">
          <div className="text-6xl">🔥</div>
          <h1 className="text-3xl font-black text-dark tracking-tight leading-tight">
            三伏天备战计划
          </h1>
          <div className="inline-flex items-center gap-1.5 bg-dark text-white px-5 py-2 rounded-full">
            <span className="text-xs font-extrabold tracking-[0.2em]">40 DAY CHALLENGE</span>
          </div>
        </div>

        {/* ── Motto ── */}
        <p className="text-center text-base font-bold text-dark/50 tracking-wide">
          这个夏天，重新定义自己。
        </p>

        {/* ── Challenge Card ── */}
        <div className="glass p-6 space-y-5">
          {/* Cycle */}
          <div className="text-center">
            <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-[0.2em] mb-2">
              我的挑战周期
            </p>
            <p className="text-[42px] font-black text-dark leading-none">
              DAY 01
              <span className="text-lg text-text-muted font-bold"> /40</span>
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-dark/5" />

          {/* Weight fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center space-y-2">
              <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-[0.2em]">
                开始日期
              </p>
              <p className="text-sm font-bold text-dark">
                {date.replace(/-/g, "/")}
              </p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-[0.2em]">
                当前体重
              </p>
              <div className="flex items-center justify-center gap-1">
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  placeholder="130"
                  value={weight}
                  onChange={(e) => { setWeight(e.target.value); setError(""); }}
                  className="w-20 text-center bg-transparent text-2xl font-black text-dark placeholder:text-text-muted border-b-2 border-dark/10 focus:border-primary focus:outline-none transition-colors"
                />
                <span className="text-xs font-bold text-text-muted mt-1">KG</span>
              </div>
            </div>
          </div>

          {/* Target weight */}
          <div className="text-center space-y-2">
            <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-[0.2em]">
              目标体重
            </p>
            <div className="flex items-center justify-center gap-1">
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                placeholder="____"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-20 text-center bg-transparent text-2xl font-black text-primary placeholder:text-primary/20 border-b-2 border-primary/20 focus:border-primary focus:outline-none transition-colors"
              />
              <span className="text-xs font-bold text-text-muted mt-1">KG</span>
            </div>
          </div>

          {error && (
            <p className="text-xs text-primary font-bold text-center">{error}</p>
          )}
        </div>

        {/* ── CTA ── */}
        <button
          onClick={handleStart}
          className="w-full py-5 rounded-2xl bg-primary text-white font-extrabold text-lg tracking-wide shadow-xl shadow-primary/25 hover:bg-primary-dark active:scale-[0.98] transition-all"
        >
          🔥 开启40天挑战
        </button>

        <p className="text-center text-[10px] text-text-muted font-medium">
          数据仅保存在你的设备中
        </p>
      </div>
    </div>
  );
}
