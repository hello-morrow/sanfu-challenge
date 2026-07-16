"use client";

import Link from "next/link";
import { useRecords } from "@/hooks/useRecords";
import { WATER_GOAL } from "@/lib/constants";
import SetupModal from "@/components/SetupModal";
import ProgressBar from "@/components/ProgressBar";

export default function Dashboard() {
  const { data, todayRecord, completionRate, currentDay, weightChange, setStartInfo } =
    useRecords();

  const day = currentDay();
  const completed = !!todayRecord?.completed;
  const rate = completionRate();

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

  const change = weightChange();
  const needsSetup = !data.startDate;
  const challengesDone = challenges.filter((c) => c.done).length;

  return (
    <div className="space-y-5 animate-slide-up">
      {needsSetup && <SetupModal onStart={(d, w) => setStartInfo(d, w)} />}

      {/* DAY Counter */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-dark text-white px-5 py-2 rounded-full">
          <span className="text-2xl">🔥</span>
          <span className="text-sm font-bold tracking-widest">
            DAY {day > 0 ? String(day).padStart(2, "0") : "00"} / 40
          </span>
        </div>
        <h1 className="text-base font-extrabold text-dark tracking-tight">
          三伏天备战计划
        </h1>
      </div>

      {needsSetup && (
        <div className="text-center py-12">
          <p className="text-sm text-text-secondary font-medium">设置挑战目标后开始</p>
        </div>
      )}

      {!needsSetup && (
        <>
          {/* Progress Card */}
          <div className="rounded-3xl bg-card-bg border-2 border-dark/5 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                  挑战完成度
                </p>
                <p className="text-4xl font-black text-dark mt-1">
                  {rate}
                  <span className="text-lg text-text-muted">%</span>
                </p>
              </div>
              <div className="text-5xl animate-burn">
                {rate >= 80 ? "🔥" : rate >= 50 ? "⚡" : rate > 0 ? "💪" : "🎯"}
              </div>
            </div>
            <ProgressBar value={rate} max={100} />
          </div>

          {/* Weight + Today Done in row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-card-bg border-2 border-dark/5 p-4">
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                当前体重
              </p>
              {todayRecord?.weight ? (
                <>
                  <p className="text-3xl font-black text-dark">
                    {todayRecord.weight}
                    <span className="text-xs font-normal text-text-muted ml-0.5">kg</span>
                  </p>
                  {change !== null && (
                    <p className="text-xs font-bold text-primary mt-1">
                      {change <= 0 ? `↓ ${Math.abs(change).toFixed(1)}` : `↑ ${change.toFixed(1)}`} kg
                    </p>
                  )}
                </>
              ) : (
                <p className="text-lg font-bold text-text-muted">-- kg</p>
              )}
            </div>

            <div className="rounded-2xl bg-card-bg border-2 border-dark/5 p-4">
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                今日挑战
              </p>
              <p className="text-3xl font-black text-dark">
                {challengesDone}<span className="text-lg text-text-muted">/4</span>
              </p>
              <p className="text-xs font-bold text-primary mt-1">
                {challengesDone === 4 ? "完成 ✓" : "进行中"}
              </p>
            </div>
          </div>

          {/* Challenge Checklist */}
          <div className="rounded-2xl bg-card-bg border-2 border-dark/5 p-4 space-y-3">
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              ⚡ 今日挑战任务
            </h3>
            <div className="space-y-2">
              {challenges.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    item.done ? "bg-primary/5" : "bg-dark/3"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      item.done
                        ? "bg-primary text-white"
                        : "bg-dark/10 text-text-muted"
                    }`}
                  >
                    {item.done ? "✓" : "○"}
                  </span>
                  <span className={`text-sm font-medium flex-1 ${
                    item.done ? "text-text-muted line-through" : "text-dark"
                  }`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Note */}
          {todayRecord?.note && (
            <div className="rounded-2xl bg-accent-light border-2 border-accent/20 p-4">
              <p className="text-xs font-bold text-dark/60 mb-1">📝 今日备注</p>
              <p className="text-sm text-dark/80">{todayRecord.note}</p>
            </div>
          )}

          {/* CTA */}
          <Link
            href="/today"
            className={`block w-full text-center py-4 rounded-2xl font-extrabold text-base tracking-wide transition-all active:scale-[0.98] ${
              completed
                ? "bg-dark/5 text-text-secondary"
                : "bg-primary text-white shadow-lg shadow-primary/25"
            }`}
          >
            {completed ? "✓ 今日已完成" : "⚡ 开始今日打卡"}
          </Link>
        </>
      )}
    </div>
  );
}
