"use client";

import Link from "next/link";
import { useRecords } from "@/hooks/useRecords";
import { WATER_GOAL, SLEEP_OPTIONS } from "@/lib/constants";
import SetupModal from "@/components/SetupModal";

export default function Dashboard() {
  const { data, todayRecord, completionRate, currentDay, weightChange, setStartInfo } =
    useRecords();

  const day = currentDay();
  const completed = !!todayRecord?.completed;
  const rate = completionRate();
  const change = weightChange();
  const needsSetup = !data.startDate;

  const waterDone = (todayRecord?.water ?? 0) >= WATER_GOAL;
  const exerciseDone = !!todayRecord?.exercise;
  const foodDone = !!(todayRecord?.breakfast || todayRecord?.lunch || todayRecord?.dinner);
  const sleepDone = !!todayRecord?.sleep;
  const challenges = [
    { label: "喝水 2000ml", done: waterDone },
    { label: "完成运动", done: exerciseDone },
    { label: "记录饮食", done: foodDone },
    { label: "早点睡觉", done: sleepDone },
  ];
  const doneCount = challenges.filter((c) => c.done).length;

  const sleepLabel = SLEEP_OPTIONS.find((o) => o.value === todayRecord?.sleep)?.label;

  return (
    <div className="space-y-5 animate-slide-up">
      {needsSetup && <SetupModal onStart={(d, w, t) => setStartInfo(d, w, t)} />}

      {/* ── DAY Counter ── */}
      <div className="text-center space-y-2 pt-2">
        <p className="text-[48px] font-black text-dark leading-none tracking-tighter">
          DAY {day > 0 ? String(day).padStart(2, "0") : "00"}
          <span className="text-lg text-text-muted font-bold"> /40</span>
        </p>
        <h1 className="text-[28px] font-extrabold text-dark leading-tight tracking-tight">
          三伏天备战计划
        </h1>
      </div>

      {needsSetup && (
        <div className="text-center py-12">
          <p className="text-sm text-text-secondary font-bold">设置挑战目标后开始</p>
        </div>
      )}

      {!needsSetup && (
        <>
          {/* ── 完成度大卡 ── */}
          <div className="glass p-6 text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl">{rate >= 80 ? "🔥" : rate >= 50 ? "⚡" : rate > 0 ? "💪" : "🎯"}</span>
              <span className="text-[56px] font-black text-dark leading-none">{rate}</span>
              <span className="text-xl font-bold text-text-muted">%</span>
            </div>
            <p className="text-xs font-extrabold text-text-secondary uppercase tracking-widest">挑战完成度</p>
            {/* mini progress */}
            <div className="w-full h-2 rounded-full bg-dark/5 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${rate}%`, background: "linear-gradient(90deg, #FF6B35, #FFB703)" }} />
            </div>
          </div>

          {/* ── 今日战绩 + 体重 ── */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass p-4 text-center space-y-1">
              <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-widest">今日战绩</p>
              <p className="text-[36px] font-black text-dark leading-none">
                {doneCount}<span className="text-lg text-text-muted font-bold">/4</span>
              </p>
              <p className="text-[11px] font-bold text-primary">
                {doneCount === 4 ? "全部完成 🔥" : doneCount >= 2 ? "进行中 ⚡" : "加油 💪"}
              </p>
            </div>

            <div className="glass p-4 text-center space-y-1">
              <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-widest">当前体重</p>
              {todayRecord?.weight ? (
                <>
                  <p className="text-[36px] font-black text-dark leading-none">
                    {todayRecord.weight}
                    <span className="text-sm font-bold text-text-muted ml-0.5">kg</span>
                  </p>
                  {change !== null && (
                    <p className="text-[11px] font-bold text-primary">
                      {change <= 0 ? `↓ ${Math.abs(change).toFixed(1)}` : `↑ ${change.toFixed(1)}`} kg
                    </p>
                  )}
                </>
              ) : (
                <p className="text-lg font-bold text-text-muted mt-2">-- kg</p>
              )}
            </div>
          </div>

          {/* ── 三个数据小卡 ── */}
          <div className="grid grid-cols-3 gap-2">
            <MiniCard
              icon="💧"
              label="饮水"
              value={todayRecord ? `${todayRecord.water}ml` : "--"}
              sub={`/${WATER_GOAL}ml`}
              done={waterDone}
            />
            <MiniCard
              icon="🏃"
              label="运动"
              value={todayRecord?.exercise ? todayRecord.exercise.type.replace("run", "跑步").replace(/^strength$/, "力量").replace(/^stretch$/, "拉伸") : "--"}
              sub={todayRecord?.exercise ? `${todayRecord.exercise.minutes}min` : ""}
              done={exerciseDone}
            />
            <MiniCard
              icon="😴"
              label="睡眠"
              value={sleepLabel ?? "--"}
              sub=""
              done={sleepDone}
            />
          </div>

          {/* ── 挑战清单 ── */}
          <div className="glass p-4 space-y-3">
            <p className="text-xs font-extrabold text-text-secondary uppercase tracking-widest">⚡ 今日挑战任务</p>
            <div className="space-y-2">
              {challenges.map((item) => (
                <div key={item.label}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    item.done ? "bg-primary/5" : "bg-dark/3"
                  }`}>
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-extrabold ${
                    item.done ? "bg-primary text-white" : "bg-dark/10 text-text-muted"
                  }`}>
                    {item.done ? "✓" : "○"}
                  </span>
                  <span className={`text-sm font-bold ${item.done ? "text-text-muted line-through" : "text-dark"}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── 备注 ── */}
          {todayRecord?.note && (
            <div className="glass p-4">
              <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-widest mb-1.5">📝 今日备注</p>
              <p className="text-sm text-dark/70 font-medium">{todayRecord.note}</p>
            </div>
          )}

          {/* ── CTA ── */}
          <Link href="/today"
            className={`block w-full text-center py-4 rounded-2xl font-extrabold text-base tracking-wide transition-all active:scale-[0.98] ${
              completed
                ? "bg-dark/5 text-text-secondary"
                : "bg-primary text-white shadow-lg shadow-primary/20"
            }`}>
            {completed ? "✓ 今日已完成" : "⚡ 开始今日打卡"}
          </Link>
        </>
      )}
    </div>
  );
}

function MiniCard({ icon, label, value, sub, done }: {
  icon: string; label: string; value: string; sub: string; done: boolean;
}) {
  return (
    <div className={`glass p-3 text-center space-y-0.5 ${done ? "ring-1 ring-primary/30" : ""}`}>
      <span className="text-lg">{icon}</span>
      <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider">{label}</p>
      <p className="text-xs font-black text-dark truncate">{value}</p>
      {sub && <p className="text-[9px] text-text-muted font-medium">{sub}</p>}
    </div>
  );
}
