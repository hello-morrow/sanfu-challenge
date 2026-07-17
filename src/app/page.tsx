"use client";

import Link from "next/link";
import { useRecords } from "@/hooks/useRecords";
import { MOOD_OPTIONS, COMIC_CHAPTERS, EXP_PER_MISSION } from "@/lib/constants";
import SetupModal from "@/components/SetupModal";
import PixelCharacter from "@/components/PixelCharacter";
import type { Gender } from "@/lib/types";

export default function Dashboard() {
  const { data, todayRecord, completionRate, currentDay, weightChange,
    streak, playerLevel, baseStage, createSurvivor,
    exp, currentExp, nextExp, expPct, showLevelUp, triggerLevelUp } = useRecords();

  const day = currentDay();
  const completed = !!todayRecord?.completed;
  const rate = completionRate();
  const change = weightChange();
  const needsSetup = !data.survivor;

  const missions = [
    { label: "补充水源", done: (todayRecord?.water ?? 0) >= 2000 },
    { label: "收集补给", done: !!(todayRecord?.breakfast?.tags?.length || todayRecord?.lunch?.tags?.length || todayRecord?.dinner?.tags?.length) },
    { label: "训练身体", done: (todayRecord?.exercise?.length ?? 0) > 0 },
    { label: "恢复精神", done: !!todayRecord?.sleep },
  ];
  const doneCount = missions.filter(m => m.done).length;
  const survivor = data.survivor;

  return (
    <div className="space-y-4 animate-slide-up pb-4">
      {/* Character Creation */}
      {needsSetup && (
        <SetupModal onCreate={(name, gender, date, weight) => {
          createSurvivor({ name, gender, createdAt: date }, date, weight, null);
        }} />
      )}

      {/* Level Up Modal */}
      {showLevelUp && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-dark/70">
          <div className="bg-base border-2 border-primary p-6 text-center space-y-3 animate-slide-up shadow-[6px_6px_0_rgba(26,26,26,0.2)]">
            <p className="text-4xl">⬆️</p>
            <p className="text-sm font-black text-primary pixel-text tracking-[0.2em]">LEVEL UP!</p>
            <p className="text-2xl font-black text-dark pixel-text">LV.{showLevelUp.to}</p>
          </div>
        </div>
      )}

      {/* ── WARNING ── */}
      <div className="border-2 border-primary/40 bg-primary/5 p-2 text-center">
        <p className="text-[10px] font-extrabold text-primary pixel-text tracking-[0.25em]">⚠ HIGH TEMPERATURE WARNING</p>
      </div>

      {/* ── Base Scene ── */}
      <div className="border-2 border-dark bg-white/20 p-5 space-y-5">
        {/* Sky + Sun */}
        <div className="flex justify-between items-start">
          <span className="text-xs font-black text-text-muted pixel-text">☀️ 2026·夏</span>
          <span className="text-sm font-black text-primary pixel-text">DAY {String(day).padStart(2,"0")}/40</span>
        </div>

        {/* Scene */}
        <div className="flex items-end justify-between pt-2">
          <div className="text-center space-y-1">
            <span className="text-xl opacity-60">🏚️</span>
            <p className="text-[8px] font-bold text-text-muted pixel-text">基地</p>
          </div>
          <div className="text-center space-y-1">
            <span className="text-xl opacity-60">💧</span>
            <p className="text-[8px] font-bold text-text-muted pixel-text">水源</p>
          </div>
          <div className="text-center">
            <PixelCharacter level={playerLevel.level} gender={survivor?.gender ?? "male"} size={52} />
          </div>
          <div className="text-center space-y-1">
            <span className="text-xl opacity-60">🏃</span>
            <p className="text-[8px] font-bold text-text-muted pixel-text">训练</p>
          </div>
          <div className="text-center space-y-1">
            <span className="text-xl opacity-60">🍱</span>
            <p className="text-[8px] font-bold text-text-muted pixel-text">补给</p>
          </div>
        </div>

        {/* Base label */}
        <div className="flex items-center justify-between text-[9px] font-bold">
          <span className="text-text-muted pixel-text">━━ {baseStage.name} ━━</span>
          <span className="text-text-muted">🌵</span>
        </div>
      </div>

      {/* ── Player Card ── */}
      {!needsSetup && survivor && (
        <div className="border-2 border-dark bg-white/40 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <PixelCharacter level={playerLevel.level} gender={survivor.gender} size={40} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-black text-dark pixel-text">{survivor.name}</p>
                <span className="text-[9px] font-extrabold bg-dark text-white px-2 py-0.5 pixel-text">LV.{playerLevel.level}</span>
              </div>
              <p className="text-[10px] text-text-muted font-medium">{playerLevel.name}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-muted font-bold">EXP</p>
              <p className="text-lg font-black text-dark pixel-text">{currentExp}/{nextExp}</p>
            </div>
          </div>
          {/* EXP Bar */}
          <div className="rpg-bar">
            <div className="rpg-bar-fill" style={{width:`${expPct}%`,background:"linear-gradient(90deg,#FFB703,#FF6B35)"}} />
          </div>
          <div className="flex gap-3 text-[9px] font-extrabold">
            <span className="text-text-muted">❤️ HP {day}/40</span>
            <span className="text-text-muted">⚡ SP {todayRecord?.exercise?.reduce((s,e)=>s+e.duration,0)??0}</span>
            <span className="text-primary">🔥 WILL {streak}</span>
          </div>
        </div>
      )}

      {!needsSetup && (
        <>
          {/* ── MISSION LOG ── */}
          <div className="border-2 border-dark bg-white/40">
            <div className="bg-dark text-base px-3 py-1.5 flex items-center justify-between">
              <p className="text-[10px] font-bold pixel-text tracking-[0.15em]">📜 MISSION DAY {String(day).padStart(2,"0")}</p>
              <p className="text-[9px] font-bold pixel-text text-accent">{doneCount}/4 · +{doneCount*EXP_PER_MISSION}EXP</p>
            </div>
            <div className="p-3 space-y-1.5">
              {missions.map(m => (
                <div key={m.label} className={`flex items-center gap-2 px-2 py-1.5 ${m.done ? "opacity-50" : ""}`}>
                  <span className="text-xs font-extrabold pixel-text">{m.done ? "☑" : "☐"}</span>
                  <span className="text-[11px] font-bold text-dark">{m.label}</span>
                  {m.done && <span className="text-[9px] text-primary font-extrabold ml-auto pixel-text">+{EXP_PER_MISSION}EXP</span>}
                </div>
              ))}
            </div>
          </div>

          {/* ── Mood ── */}
          {todayRecord?.mood && (
            <div className="border-2 border-dark bg-white/40 p-3 flex items-center gap-3">
              <span className="text-lg">{MOOD_OPTIONS.find(o=>o.value===todayRecord.mood!.type)?.emoji}</span>
              <p className="text-xs font-extrabold text-dark pixel-text">
                {MOOD_OPTIONS.find(o=>o.value===todayRecord.mood!.type)?.label}
              </p>
            </div>
          )}

          {/* ── Comic ── */}
          {(() => {
            const ch = [...COMIC_CHAPTERS].reverse().find(c => day >= c.unlockedDay);
            return ch ? (
              <div className="border-2 border-dark bg-white/40 p-4 space-y-2 border-l-primary border-l-4">
                <p className="text-[9px] font-extrabold text-primary pixel-text tracking-[0.15em]">
                  EPISODE {String(ch.episode).padStart(2,"0")}
                </p>
                <p className="text-sm font-black text-dark pixel-text">{ch.title}</p>
                <p className="text-[11px] text-text-secondary font-medium leading-relaxed">{ch.text}</p>
              </div>
            ) : null;
          })()}

          {/* ── Stats ── */}
          <div className="grid grid-cols-3 gap-2">
            <div className="border-2 border-dark bg-white/40 p-3 text-center">
              <p className="text-[9px] font-extrabold text-text-secondary uppercase tracking-wider">体重</p>
              <p className="text-lg font-black text-dark pixel-text">{todayRecord?.weight ?? "--"}<span className="text-[9px] text-text-muted">kg</span></p>
            </div>
            <div className="border-2 border-dark bg-white/40 p-3 text-center">
              <p className="text-[9px] font-extrabold text-text-secondary uppercase tracking-wider">连续</p>
              <p className="text-lg font-black text-primary pixel-text">🔥 {streak}<span className="text-[9px] text-text-muted">天</span></p>
            </div>
            <div className="border-2 border-dark bg-white/40 p-3 text-center">
              <p className="text-[9px] font-extrabold text-text-secondary uppercase tracking-wider">完成</p>
              <p className="text-lg font-black text-dark pixel-text">{rate}<span className="text-[9px] text-text-muted">%</span></p>
            </div>
          </div>

          {/* ── CTA ── */}
          <Link href="/today"
            className={`pixel-btn block w-full text-center py-4 text-base ${completed ? "bg-dark/5 text-text-secondary" : "pixel-btn-primary"}`}>
            {completed ? "✓ 已完成" : "⚡ 开始今日任务"}
          </Link>
        </>
      )}

      {needsSetup && (
        <div className="text-center py-12">
          <p className="text-sm text-text-muted font-bold pixel-text">等待幸存者创建...</p>
        </div>
      )}
    </div>
  );
}
