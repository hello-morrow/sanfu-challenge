"use client";

import Link from "next/link";
import { useRecords } from "@/hooks/useRecords";
import { WATER_GOAL, MOOD_OPTIONS, COMIC_CHAPTERS } from "@/lib/constants";
import SetupModal from "@/components/SetupModal";
import PixelCharacter from "@/components/PixelCharacter";

export default function Dashboard() {
  const { data, todayRecord, completionRate, currentDay, weightChange, streak, playerLevel, baseStage, setStartInfo } = useRecords();
  const day = currentDay();
  const completed = !!todayRecord?.completed;
  const rate = completionRate();
  const change = weightChange();
  const needsSetup = !data.startDate;

  const waterDone = (todayRecord?.water ?? 0) >= WATER_GOAL;
  const exerciseDone = (todayRecord?.exercise?.length ?? 0) > 0;
  const foodDone = !!(todayRecord?.breakfast?.tags?.length || todayRecord?.lunch?.tags?.length || todayRecord?.dinner?.tags?.length || todayRecord?.snack);
  const sleepDone = !!todayRecord?.sleep;

  const missions = [
    { label: "补充水源", done: waterDone, icon: "💧" },
    { label: "收集补给", done: foodDone, icon: "🍱" },
    { label: "训练身体", done: exerciseDone, icon: "🏃" },
    { label: "恢复精神", done: sleepDone, icon: "😴" },
  ];
  const doneCount = missions.filter(c => c.done).length;
  const unlockedChapter = [...COMIC_CHAPTERS].reverse().find(c => day >= c.unlockedDay);

  // HP/SP/Will based on completion
  const hp = Math.min(day, 40);
  const sp = Math.min(todayRecord?.exercise?.reduce((s,e) => s + e.duration, 0) ?? 0, 100);
  const will = streak;

  return (
    <div className="space-y-4 animate-slide-up pb-4">
      {needsSetup && <SetupModal onStart={(d,w,t) => setStartInfo(d,w,t)} />}

      {/* ── WARNING Banner ── */}
      <div className="pixel-card p-3 text-center bg-primary/5 border-primary/30">
        <p className="text-[10px] font-extrabold text-primary pixel-text tracking-[0.3em]">⚠ WARNING · HIGH TEMPERATURE</p>
      </div>

      {/* ── Base Scene ── */}
      <div className="pixel-card p-5 space-y-4">
        {/* Scene elements */}
        <div className="flex items-center justify-between text-2xl">
          <span className="opacity-30">☀️</span>
          <span className="text-sm font-black text-primary pixel-text">DAY {String(day).padStart(2,"0")}/40</span>
          <span className="opacity-30">🏚️</span>
        </div>

        <div className="flex items-center justify-center gap-6 py-2">
          <span className="text-xl opacity-40">💧</span>
          <PixelCharacter level={playerLevel.level} name={playerLevel.name} />
          <span className="text-xl opacity-40">🏃</span>
        </div>

        <div className="flex items-center justify-between text-xs text-text-muted font-medium">
          <span>{baseStage.name}</span>
          <span>🍱 补给</span>
        </div>
      </div>

      {/* ── Player Stats ── */}
      {!needsSetup && (
        <div className="pixel-card p-4 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black text-dark pixel-text">SODA</span>
            <span className="text-[10px] font-extrabold bg-dark text-white px-2 py-0.5 pixel-text">LV.{playerLevel.level}</span>
          </div>
          <div className="space-y-1.5 text-[10px] font-bold">
            <div className="flex items-center gap-2">
              <span className="w-12 text-text-muted">HP</span>
              <div className="flex-1 h-2 bg-dark/10 overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{width:`${(hp/40)*100}%`}} />
              </div>
              <span className="text-dark pixel-text">{hp}/40</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 text-text-muted">SP</span>
              <div className="flex-1 h-2 bg-dark/10 overflow-hidden">
                <div className="h-full bg-accent transition-all" style={{width:`${Math.min(sp,100)}%`}} />
              </div>
              <span className="text-dark pixel-text">{sp}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 text-text-muted">WILL</span>
              <div className="flex-1 h-2 bg-dark/10 overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{width:`${Math.min(will,40)/40*100}%`}} />
              </div>
              <span className="text-dark pixel-text">{will}</span>
            </div>
          </div>
        </div>
      )}

      {!needsSetup && (
        <>
          {/* ── MISSION LOG ── */}
          <div className="rpg-log p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-extrabold text-dark pixel-text">📜 MISSION DAY {String(day).padStart(2,"0")}</p>
              <p className="text-[10px] font-bold text-primary pixel-text">{doneCount}/4</p>
            </div>
            <div className="space-y-1.5">
              {missions.map(m => (
                <div key={m.label} className={`flex items-center gap-2 px-2 py-1.5 ${m.done ? "opacity-50" : ""}`}>
                  <span className={`w-5 h-5 flex items-center justify-center text-xs font-extrabold pixel-text ${m.done ? "text-primary" : "text-text-muted"}`}>
                    {m.done ? "☑" : "☐"}
                  </span>
                  <span className="text-xs font-bold text-dark">{m.label}</span>
                  {m.done && <span className="text-[10px] text-primary font-extrabold ml-auto pixel-text">+EXP</span>}
                </div>
              ))}
            </div>
          </div>

          {/* ── Mood ── */}
          {todayRecord?.mood && (
            <div className="pixel-card p-3 flex items-center gap-3">
              <span className="text-lg">{MOOD_OPTIONS.find(o=>o.value===todayRecord.mood!.type)?.emoji}</span>
              <p className="text-xs font-extrabold text-dark pixel-text">
                {MOOD_OPTIONS.find(o=>o.value===todayRecord.mood!.type)?.label}
              </p>
            </div>
          )}

          {/* ── Comic ── */}
          {unlockedChapter && (
            <div className="pixel-card p-4 space-y-2 border-primary/30">
              <p className="text-[10px] font-extrabold text-primary pixel-text tracking-[0.2em]">
                EPISODE {String(unlockedChapter.episode).padStart(2,"0")}
              </p>
              <p className="text-sm font-black text-dark pixel-text">{unlockedChapter.title}</p>
              <p className="text-xs text-text-secondary font-medium leading-relaxed">{unlockedChapter.text}</p>
            </div>
          )}

          {/* ── Weight ── */}
          <div className="grid grid-cols-2 gap-3">
            <div className="pixel-card p-3 text-center">
              <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider">体重</p>
              {todayRecord?.weight ? (
                <p className="text-xl font-black text-dark pixel-text">{todayRecord.weight}<span className="text-xs text-text-muted">kg</span></p>
              ) : <p className="text-lg text-text-muted font-bold">--</p>}
            </div>
            <div className="pixel-card p-3 text-center">
              <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider">连续挑战</p>
              <p className="text-xl font-black text-primary pixel-text">🔥 {streak}<span className="text-xs text-text-muted">天</span></p>
            </div>
          </div>

          {/* ── CTA ── */}
          <Link href="/today"
            className={`pixel-btn block w-full text-center py-4 text-base ${completed ? "bg-dark/5 text-text-secondary" : "bg-primary text-white"}`}>
            {completed ? "✓ 已完成" : "⚡ 开始今日任务"}
          </Link>
        </>
      )}

      {needsSetup && (
        <div className="text-center py-12"><p className="text-sm text-text-muted font-bold">初始化训练基地...</p></div>
      )}
    </div>
  );
}
