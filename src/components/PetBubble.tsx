"use client";

import { useEffect, useState } from "react";

interface Props {
  streak: number;
  day: number;
}

/** Deterministic dialogue based on streak and day */
function getDialogue(streak: number, day: number): { text: string; mood: "happy" | "neutral" | "worried" | "proud" } {
  const seed = day * 7 + streak * 13;

  if (streak >= 20) {
    const pool = [
      { text: "我感觉你的火焰比我还强了。", mood: "proud" as const },
      { text: "你真的是普通人类吗……？", mood: "proud" as const },
      { text: "SANFU CAMP 快建成了！", mood: "happy" as const },
    ];
    return pool[seed % pool.length];
  }
  if (streak >= 10) {
    const pool = [
      { text: "你居然坚持了一周？有一点厉害。", mood: "happy" as const },
      { text: "基地越来越像样了！", mood: "happy" as const },
      { text: "今天太阳好大……哦，我说我自己。", mood: "neutral" as const },
    ];
    return pool[seed % pool.length];
  }
  if (streak >= 3) {
    const pool = [
      { text: "今天好热……但是我们一起坚持吧！", mood: "neutral" as const },
      { text: "喝水！别忘了喝水！", mood: "worried" as const },
      { text: "你比昨天更厉害了。", mood: "happy" as const },
    ];
    return pool[seed % pool.length];
  }

  // 0-2 streak
  const pool = [
    { text: "没人比我更懂太阳！所以我来陪你。", mood: "happy" as const },
    { text: "今天好热……但是我们一起坚持吧！", mood: "neutral" as const },
    { text: "你好！我是QQ。40天，我们一起。", mood: "happy" as const },
    { text: "第一天总是最难的……加油！", mood: "worried" as const },
  ];
  return pool[seed % pool.length];
}

const MOOD_EMOJI: Record<string, string> = {
  happy: "😊",
  neutral: "😐",
  worried: "😟",
  proud: "😎",
};

export default function PetBubble({ streak, day }: Props) {
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setBounce(prev => !prev), 3000);
    return () => clearInterval(timer);
  }, []);

  const dialogue = getDialogue(streak, day);

  return (
    <div className="border-2 border-dark bg-white/40 p-3 flex items-start gap-3">
      {/* Sun pet */}
      <div className={`text-2xl transition-transform ${bounce ? "translate-y-[-2px]" : ""}`}
        style={{ animation: "pixel-breathe 2s ease-in-out infinite" }}>
        <svg width="32" height="32" viewBox="0 0 32 32" shapeRendering="crispEdges">
          <circle cx="16" cy="16" r="10" fill="#FFB703" />
          <rect x="13" y="12" width="3" height="3" fill="#1A1A1A" />
          <rect x="20" y="12" width="3" height="3" fill="#1A1A1A" />
          <rect x="14" y="18" width="8" height="2" fill="#1A1A1A" opacity="0.5" />
          {/* Rays */}
          <rect x="16" y="3" width="2" height="4" fill="#FFB703" />
          <rect x="16" y="25" width="2" height="4" fill="#FFB703" />
          <rect x="3" y="16" width="4" height="2" fill="#FFB703" />
          <rect x="25" y="16" width="4" height="2" fill="#FFB703" />
          <rect x="8" y="8" width="2" height="2" fill="#FFB703" />
          <rect x="22" y="8" width="2" height="2" fill="#FFB703" />
          <rect x="8" y="22" width="2" height="2" fill="#FFB703" />
          <rect x="22" y="22" width="2" height="2" fill="#FFB703" />
        </svg>
      </div>

      {/* Dialog bubble */}
      <div className="flex-1">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-[9px] font-extrabold text-dark pixel-text">QQ</span>
          <span className="text-[10px]">{MOOD_EMOJI[dialogue.mood]}</span>
          <span className="text-[8px] text-text-muted font-medium">{streak}天伙伴</span>
        </div>
        <p className="text-[11px] text-text-secondary font-medium leading-relaxed italic">
          「{dialogue.text}」
        </p>
      </div>
    </div>
  );
}
