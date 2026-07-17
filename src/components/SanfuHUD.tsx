"use client";

import { useState, useEffect } from "react";
import { getTodayWeather, sanfuCountdown, todayHoursRemaining, isSanfuSeason } from "@/lib/weather";

export default function SanfuHUD() {
  const weather = getTodayWeather();
  const inSeason = isSanfuSeason();

  const [countdown, setCountdown] = useState(sanfuCountdown());
  const [todayLeft, setTodayLeft] = useState(todayHoursRemaining());

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(sanfuCountdown());
      setTodayLeft(todayHoursRemaining());
    }, 60000); // update every minute
    return () => clearInterval(timer);
  }, []);

  const heatBars = Array.from({ length: 5 }, (_, i) => i < weather.heatLevel);

  return (
    <div className="space-y-2">
      {/* ── World Event Banner ── */}
      <div className="border-2 border-primary/50 bg-primary/5 px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">{weather.emoji}</span>
            <div>
              <p className="text-[9px] font-extrabold text-primary pixel-text tracking-[0.2em] uppercase">
                {inSeason ? "☀️ 三伏天挑战季 · 进行中" : "⏳ 等待下一个三伏天"}
              </p>
              <p className="text-[8px] text-text-muted font-medium">{weather.effect}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-dark pixel-text">{weather.temp}°C</p>
            <div className="flex gap-0.5 mt-0.5">
              {heatBars.map((on, i) => (
                <div key={i} className={`w-2 h-1 ${on ? "bg-primary" : "bg-dark/10"}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Countdown Row ── */}
      {inSeason && (
        <div className="border-2 border-dark bg-dark px-3 py-2">
          <div className="flex items-center justify-between text-base">
            <div className="text-center">
              <p className="text-[8px] font-bold text-base/60 uppercase tracking-wider">剩余</p>
              <p className="text-sm font-black text-base pixel-text">
                {String(countdown.days).padStart(2,"0")}
                <span className="text-[9px] text-base/60 font-bold ml-0.5">天</span>
              </p>
            </div>
            <span className="text-base/30 text-xs">:</span>
            <div className="text-center">
              <p className="text-[8px] font-bold text-base/60 uppercase tracking-wider">小时</p>
              <p className="text-sm font-black text-base pixel-text">
                {String(countdown.hours).padStart(2,"0")}
              </p>
            </div>
            <span className="text-base/30 text-xs">:</span>
            <div className="text-center">
              <p className="text-[8px] font-bold text-base/60 uppercase tracking-wider">分钟</p>
              <p className="text-sm font-black text-base pixel-text">
                {String(countdown.minutes).padStart(2,"0")}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[8px] font-bold text-base/60 uppercase tracking-wider">今日</p>
              <p className="text-sm font-black text-accent pixel-text">
                {String(todayLeft.hours).padStart(2,"0")}h
                <span className="text-[9px] text-base/40 font-bold ml-0.5">{String(todayLeft.minutes).padStart(2,"0")}m</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
