"use client";

import { useState } from "react";

interface Props {
  onStart: (date: string, weight: number) => void;
}

export default function SetupModal({ onStart }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [weight, setWeight] = useState("");
  const [error, setError] = useState("");

  const handleStart = () => {
    const w = parseFloat(weight);
    if (!w || w <= 0) { setError("请输入有效体重"); return; }
    if (!date) { setError("请选择开始日期"); return; }
    onStart(date, w);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-dark/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-card-bg rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-slide-up">
        {/* Emblem */}
        <div className="text-center space-y-3">
          <div className="text-5xl">🔥</div>
          <h2 className="text-xl font-extrabold text-dark tracking-tight">
            三伏天备战计划
          </h2>
          <div className="inline-block bg-dark text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wider">
            40 DAY CHALLENGE
          </div>
        </div>

        <div className="space-y-4">
          {/* Date */}
          <div>
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 block">
              开始日期
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-base border-2 border-dark/10 rounded-xl px-4 py-3.5 text-sm font-medium text-dark focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 block">
              初始体重
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                placeholder="130"
                value={weight}
                onChange={(e) => { setWeight(e.target.value); setError(""); }}
                className="flex-1 bg-base border-2 border-dark/10 rounded-xl px-4 py-3.5 text-lg font-bold text-dark placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
              />
              <span className="text-sm font-bold text-text-secondary flex-shrink-0">KG</span>
            </div>
          </div>

          {error && <p className="text-xs text-primary font-medium text-center">{error}</p>}
        </div>

        <button
          onClick={handleStart}
          className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-base shadow-lg shadow-primary/25 hover:bg-primary-dark active:scale-[0.98] transition-all tracking-wide"
        >
          开始挑战
        </button>
      </div>
    </div>
  );
}
