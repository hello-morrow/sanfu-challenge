"use client";

import { useState } from "react";

interface Props { onStart: (date: string, weight: number) => void; }

export default function SetupModal({ onStart }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [weight, setWeight] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-dark/50 backdrop-blur-sm">
      <div className="w-full max-w-lg glass p-6 sm:p-8 space-y-6 rounded-t-3xl sm:rounded-3xl shadow-xl animate-slide-up">
        <div className="text-center space-y-3">
          <div className="text-5xl">🔥</div>
          <h2 className="text-2xl font-black text-dark tracking-tight">三伏天备战计划</h2>
          <div className="inline-block bg-dark text-white px-4 py-1.5 rounded-full text-xs font-extrabold tracking-widest">
            40 DAY CHALLENGE
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-extrabold text-text-secondary uppercase tracking-wider mb-1.5 block">开始日期</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full bg-base rounded-xl px-4 py-3.5 text-sm font-bold text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
          </div>
          <div>
            <label className="text-xs font-extrabold text-text-secondary uppercase tracking-wider mb-1.5 block">初始体重</label>
            <div className="flex items-center gap-2">
              <input type="number" inputMode="decimal" step="0.1" placeholder="130" value={weight}
                onChange={(e) => { setWeight(e.target.value); setError(""); }}
                className="flex-1 bg-base rounded-xl px-4 py-3.5 text-lg font-black text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
              <span className="text-sm font-bold text-text-secondary">KG</span>
            </div>
          </div>
          {error && <p className="text-xs text-primary font-bold text-center">{error}</p>}
        </div>
        <button onClick={() => {
          const w = parseFloat(weight);
          if (!w || w <= 0) { setError("请输入有效体重"); return; }
          onStart(date, w);
        }} className="w-full py-4 rounded-2xl bg-primary text-white font-extrabold text-base tracking-wide shadow-lg shadow-primary/20 hover:bg-primary-dark active:scale-[0.98] transition-all">
          开始挑战
        </button>
      </div>
    </div>
  );
}
