"use client";

import Link from "next/link";
import { useRecords } from "@/hooks/useRecords";
import { WATER_GOAL, SLEEP_OPTIONS, MOOD_OPTIONS, COMIC_CHAPTERS } from "@/lib/constants";
import SetupModal from "@/components/SetupModal";

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

  const challenges = [
    { label: "补充水源", done: waterDone, icon: "💧" },
    { label: "收集补给", done: foodDone, icon: "🍱" },
    { label: "训练身体", done: exerciseDone, icon: "🏃" },
    { label: "恢复精神", done: sleepDone, icon: "😴" },
  ];
  const doneCount = challenges.filter(c => c.done).length;

  // Latest comic chapter unlocked
  const unlockedChapter = [...COMIC_CHAPTERS].reverse().find(c => day >= c.unlockedDay);

  return (
    <div className="space-y-4 animate-slide-up">
      {needsSetup && <SetupModal onStart={(d,w,t) => setStartInfo(d,w,t)} />}

      {/* ── Base Scene ── */}
      <div className="pixel-card p-5 text-center space-y-3">
        <div className="text-4xl animate-pixel-bounce">{baseStage.emoji}</div>
        <div>
          <p className="text-xs font-extrabold text-text-secondary uppercase tracking-[0.2em] pixel-text">我的基地</p>
          <p className="text-lg font-black text-dark pixel-text">{baseStage.name}</p>
          <p className="text-[10px] text-text-muted font-medium">{baseStage.desc}</p>
        </div>
        <div className="flex items-center justify-center gap-3 text-[10px] font-bold text-text-muted">
          <span>☀️ 高温</span>
          <span>💧 {todayRecord?.water ?? 0}/{WATER_GOAL}</span>
          <span>🏃 {todayRecord?.exercise?.length ?? 0}项训练</span>
        </div>
      </div>

      {/* ── Player Card ── */}
      {!needsSetup && (
        <div className="pixel-card p-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl animate-pixel-bounce">{playerLevel.emoji}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-black text-dark pixel-text">SODA</p>
                <span className="text-[10px] font-extrabold bg-dark text-white px-2 py-0.5 pixel-text">
                  LV.{playerLevel.level}
                </span>
              </div>
              <p className="text-[10px] text-text-muted font-medium pixel-text">{playerLevel.name}</p>
              <div className="flex gap-3 mt-2 text-[10px] font-bold">
                <span className="text-primary">❤️ {streak}</span>
                <span className="text-accent">⚡ {day}</span>
                <span className="text-primary">🔥 {rate}%</span>
                <span className="text-dark">🌱 {day}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-dark pixel-text">DAY</p>
              <p className="text-3xl font-black text-primary pixel-text">{String(day).padStart(2,"0")}</p>
              <p className="text-xs font-extrabold text-text-muted pixel-text">/40</p>
            </div>
          </div>
        </div>
      )}

      {!needsSetup && (
        <>
          {/* ── Survival Tasks ── */}
          <div className="pixel-card p-4 space-y-3">
            <p className="text-xs font-extrabold text-text-secondary uppercase tracking-[0.2em] pixel-text">⚡ 今日生存任务</p>
            <div className="space-y-1.5">
              {challenges.map(item => (
                <div key={item.label} className={`flex items-center gap-3 px-3 py-2.5 ${item.done ? "bg-primary/5" : "bg-dark/3"}`}>
                  <span className={`w-6 h-6 flex items-center justify-center text-xs font-extrabold pixel-text ${item.done ? "bg-primary text-white" : "bg-dark/10 text-text-muted"}`}>
                    {item.done ? "✓" : item.icon}
                  </span>
                  <span className={`text-sm font-bold ${item.done ? "text-text-muted line-through" : "text-dark"}`}>{item.label}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-text-muted font-bold pixel-text">完成度</span>
              <span className="font-extrabold text-primary pixel-text">{doneCount}/4</span>
            </div>
            <div className="w-full h-1.5 bg-dark/5 overflow-hidden">
              <div className="h-full transition-all duration-700" style={{width:`${(doneCount/4)*100}%`,background:"linear-gradient(90deg,#FF6B35,#FFB703)"}} />
            </div>
          </div>

          {/* ── Mood ── */}
          {todayRecord?.mood && (
            <div className="pixel-card p-3 flex items-center gap-3">
              <span className="text-xl">{MOOD_OPTIONS.find(o=>o.value===todayRecord.mood!.type)?.emoji}</span>
              <div className="flex-1">
                <p className="text-xs font-extrabold text-dark pixel-text">{MOOD_OPTIONS.find(o=>o.value===todayRecord.mood!.type)?.label}</p>
                {todayRecord.mood.note && <p className="text-[10px] text-text-muted font-medium">{todayRecord.mood.note}</p>}
              </div>
            </div>
          )}

          {/* ── Comic Chapter ── */}
          {unlockedChapter && (
            <div className="pixel-card p-4 space-y-2">
              <p className="text-[10px] font-extrabold text-primary uppercase tracking-[0.2em] pixel-text">
                EPISODE {String(unlockedChapter.episode).padStart(2,"0")}
              </p>
              <p className="text-sm font-black text-dark pixel-text">{unlockedChapter.title}</p>
              <p className="text-xs text-text-secondary font-medium leading-relaxed">{unlockedChapter.text}</p>
            </div>
          )}

          {/* ── Weight + Streak ── */}
          <div className="grid grid-cols-2 gap-3">
            <div className="pixel-card p-3 text-center space-y-1">
              <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider">当前体重</p>
              {todayRecord?.weight ? (
                <p className="text-2xl font-black text-dark pixel-text">{todayRecord.weight}<span className="text-xs text-text-muted ml-0.5">kg</span></p>
              ) : <p className="text-lg text-text-muted font-bold">-- kg</p>}
              {change !== null && (
                <p className="text-[10px] font-bold text-primary">{change<=0?`↓${Math.abs(change).toFixed(1)}`:`↑${change.toFixed(1)}`} kg</p>
              )}
            </div>
            <div className="pixel-card p-3 text-center space-y-1">
              <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider">连续挑战</p>
              <p className="text-2xl font-black text-primary pixel-text">🔥 {streak}<span className="text-xs text-text-muted font-bold">天</span></p>
              <p className="text-[9px] text-text-muted font-medium">任意3项即计入</p>
            </div>
          </div>

          {/* ── CTA ── */}
          <Link href="/today"
            className={`pixel-btn block w-full text-center py-4 text-base ${completed ? "bg-dark/5 text-text-secondary" : "bg-primary text-white"}`}>
            {completed ? "✓ 任务已完成" : "⚡ 开始今日生存任务"}
          </Link>
        </>
      )}
    </div>
  );
}
