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
        <svg width="42" height="42" viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg">
          {/* Soft ambient glow */}
          <defs>
            <radialGradient id="qqGlow" cx="50%" cy="45%" r="50%">
              <stop offset="0%" stopColor="#FFF3D6" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#FFF3D6" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <circle cx="21" cy="20" r="20" fill="url(#qqGlow)"/>
          {/* Round body */}
          <circle cx="21" cy="21" r="15" fill="#FFB703" stroke="#FFD166" strokeWidth="1"/>
          {/* Left eye — big and round */}
          <circle cx="15" cy="17" r="4.5" fill="white" stroke="#1A1A1A" strokeWidth="0.8"/>
          <circle cx="15.5" cy="16.5" r="2.2" fill="#1A1A1A"/>
          <circle cx="16.2" cy="15.5" r="1" fill="white"/>
          {/* Right eye */}
          <circle cx="27" cy="17" r="4.5" fill="white" stroke="#1A1A1A" strokeWidth="0.8"/>
          <circle cx="27.5" cy="16.5" r="2.2" fill="#1A1A1A"/>
          <circle cx="28.2" cy="15.5" r="1" fill="white"/>
          {/* Blush */}
          <ellipse cx="11" cy="21" rx="3.5" ry="2" fill="#FFB7A1" opacity="0.5"/>
          <ellipse cx="31" cy="21" rx="3.5" ry="2" fill="#FFB7A1" opacity="0.5"/>
          {/* Cute w-mouth */}
          <path d="M17 24 Q21 28 25 24" fill="none" stroke="#1A1A1A" strokeWidth="1.2" strokeLinecap="round"/>
          {/* Tiny rays — rounded */}
          {[0,45,90,135,180,225,270,315].map(deg => (
            <line key={deg}
              x1={21 + 17 * Math.cos(deg * Math.PI/180)}
              y1={21 + 17 * Math.sin(deg * Math.PI/180)}
              x2={21 + 20 * Math.cos(deg * Math.PI/180)}
              y2={21 + 20 * Math.sin(deg * Math.PI/180)}
              stroke="#FFD166" strokeWidth="1.5" strokeLinecap="round"/>
          ))}
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
