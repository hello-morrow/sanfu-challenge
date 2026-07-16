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
    if (!w || w <= 0) {
      setError("请输入有效体重");
      return;
    }
    if (!date) {
      setError("请选择开始日期");
      return;
    }
    onStart(date, w);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm animate-in">
      <div className="w-full max-w-lg bg-card-bg rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-in slide-in-from-bottom duration-300">
        {/* Welcome */}
        <div className="text-center space-y-2">
          <div className="text-3xl mb-1">🌿</div>
          <h2 className="text-xl font-bold text-text-primary">
            欢迎来到三伏天备战计划
          </h2>
          <p className="text-sm text-text-secondary">
            40天，记录每一天的改变
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Date */}
          <div>
            <label className="text-xs text-text-secondary mb-1.5 block">
              开始日期
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-cream border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-green-primary transition-colors"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="text-xs text-text-secondary mb-1.5 block">
              初始体重
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                placeholder="130"
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value);
                  setError("");
                }}
                className="flex-1 bg-cream border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-green-primary transition-colors"
              />
              <span className="text-sm text-text-muted flex-shrink-0">kg</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-500 text-center">{error}</p>
          )}
        </div>

        {/* Challenge info */}
        <div className="rounded-xl bg-green-pale px-4 py-3 flex items-center gap-2">
          <span className="text-lg">🎯</span>
          <div>
            <p className="text-xs font-medium text-green-primary">40天挑战</p>
            <p className="text-[10px] text-text-secondary">
              每天喝水 · 运动 · 记录 · 早睡
            </p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleStart}
          className="w-full py-3.5 rounded-2xl bg-green-primary text-white font-medium text-base shadow-sm hover:bg-green-primary/90 active:scale-[0.98] transition-all"
        >
          开始挑战
        </button>
      </div>
    </div>
  );
}
