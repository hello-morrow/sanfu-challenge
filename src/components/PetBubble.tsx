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
        <svg width="36" height="36" viewBox="0 0 36 36" shapeRendering="crispEdges">
          {/* Soft glow behind */}
          <circle cx="18" cy="18" r="16" fill="#FFF3D6" opacity="0.5" />
          {/* Main body */}
          <circle cx="18" cy="18" r="13" fill="#FFB703" />
          {/* Big cute eyes — white bg */}
          <rect x="10" y="11" width="7" height="7" rx="1" fill="white" />
          <rect x="19" y="11" width="7" height="7" rx="1" fill="white" />
          {/* Pupils — big and centered */}
          <rect x="12" y="13" width="3" height="3" fill="#1A1A1A" />
          <rect x="21" y="13" width="3" height="3" fill="#1A1A1A" />
          {/* Eye shine */}
          <rect x="13" y="12" width="1" height="1" fill="white" />
          <rect x="22" y="12" width="1" height="1" fill="white" />
          {/* Rosy cheeks */}
          <rect x="7" y="17" width="4" height="2" rx="1" fill="#FFB7A1" opacity="0.6" />
          <rect x="25" y="17" width="4" height="2" rx="1" fill="#FFB7A1" opacity="0.6" />
          {/* Cute small smile */}
          <rect x="14" y="21" width="8" height="2" rx="1" fill="#1A1A1A" opacity="0.6" />
          {/* Soft small rays */}
          <rect x="17" y="3" width="2" height="3" rx="1" fill="#FFD166" />
          <rect x="17" y="30" width="2" height="3" rx="1" fill="#FFD166" />
          <rect x="3" y="17" width="3" height="2" rx="1" fill="#FFD166" />
          <rect x="30" y="17" width="3" height="2" rx="1" fill="#FFD166" />
          <rect x="8" y="8" width="2" height="2" rx="1" fill="#FFD166" />
          <rect x="26" y="8" width="2" height="2" rx="1" fill="#FFD166" />
          <rect x="8" y="26" width="2" height="2" rx="1" fill="#FFD166" />
          <rect x="26" y="26" width="2" height="2" rx="1" fill="#FFD166" />
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
