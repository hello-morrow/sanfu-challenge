"use client";

import Link from "next/link";
import { useRecords } from "@/hooks/useRecords";
import { WATER_GOAL } from "@/lib/constants";
import SetupModal from "@/components/SetupModal";

export default function Dashboard() {
  const { data, todayRecord, completionRate, currentDay, weightChange, setStartInfo } =
    useRecords();

  const day = currentDay();
  const completed = !!todayRecord?.completed;
  const rate = completionRate();

  const waterDone = (todayRecord?.water ?? 0) >= WATER_GOAL;
  const exerciseDone = !!todayRecord?.exercise;
  const foodDone = !!(
    todayRecord?.breakfast ||
    todayRecord?.lunch ||
    todayRecord?.dinner
  );
  const sleepDone = !!todayRecord?.sleep;

  const reminders = [
    { label: "喝水 2000ml", done: waterDone, icon: "💧" },
    { label: "完成运动", done: exerciseDone, icon: "🏃" },
    { label: "记录饮食", done: foodDone, icon: "🥗" },
    { label: "早点睡觉", done: sleepDone, icon: "😴" },
  ];

  const change = weightChange();
  const needsSetup = !data.startDate;

  return (
    <div className="space-y-5 animate-in">
      {/* Setup Modal - first visit only */}
      {needsSetup && (
        <SetupModal
          onStart={(date, weight) => setStartInfo(date, weight)}
        />
      )}

      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-lg font-bold tracking-wide text-text-primary">
          三伏天备战计划
        </h1>
        <p className="text-xs text-text-muted">
          Day {day > 0 ? day : "?"} / 40
        </p>
      </div>

      {needsSetup && (
        <div className="text-center py-12">
          <p className="text-sm text-text-muted">设置你的挑战目标后开始</p>
        </div>
      )}

      {!needsSetup && (
        <>
          {/* Completion + Weight in one row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Completion Rate */}
            <div className="rounded-2xl bg-card-bg border border-border p-4 flex flex-col items-center justify-center">
              <div className="relative w-20 h-20">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="38"
                    fill="none" stroke="#E8F5E9" strokeWidth="7"
                  />
                  <circle
                    cx="50" cy="50" r="38"
                    fill="none" stroke="#7CB342" strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={`${rate * 2.39} 239`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-green-primary">{rate}%</span>
                  <span className="text-[9px] text-text-muted">完成度</span>
                </div>
              </div>
            </div>

            {/* Weight Card */}
            <div className="rounded-2xl bg-card-bg border border-border p-4 flex flex-col justify-center">
              {todayRecord?.weight ? (
                <>
                  <span className="text-[10px] text-text-muted">当前体重</span>
                  <span className="text-2xl font-bold text-text-primary mt-0.5">
                    {todayRecord.weight}
                    <span className="text-xs font-normal text-text-muted ml-0.5">kg</span>
                  </span>
                  {change !== null && (
                    <span className="text-[11px] text-green-primary mt-1">
                      {change <= 0 ? `${change.toFixed(1)} kg` : `+${change.toFixed(1)} kg`}
                    </span>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <span className="text-[10px] text-text-muted block">当前体重</span>
                  <span className="text-sm text-text-muted mt-1">-- kg</span>
                </div>
              )}
            </div>
          </div>

          {/* Today's Reminders — the only checklist card */}
          <div className="rounded-2xl bg-card-bg border border-border p-4">
            <h3 className="text-sm font-medium text-text-secondary mb-3">
              📋 今日提醒
            </h3>
            <div className="space-y-2.5">
              {reminders.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 text-sm"
                >
                  <span
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      item.done
                        ? "bg-green-primary border-green-primary text-white"
                        : "border-border"
                    }`}
                  >
                    {item.done && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span className="mr-auto">
                    {item.done ? (
                      <span className="text-text-muted line-through">{item.label}</span>
                    ) : (
                      <span className="text-text-primary">{item.label}</span>
                    )}
                  </span>
                  <span className="text-xs">{item.icon}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Today's note preview */}
          {todayRecord?.note && (
            <div className="rounded-2xl bg-card-bg border border-border p-4">
              <div className="flex items-start gap-2">
                <span className="text-sm">📝</span>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {todayRecord.note}
                </p>
              </div>
            </div>
          )}

          {/* CTA */}
          <Link
            href="/today"
            className={`block w-full text-center py-3.5 rounded-2xl font-medium transition-all ${
              completed
                ? "bg-green-pale text-green-primary"
                : "bg-green-primary text-white shadow-sm"
            }`}
          >
            {completed ? "已完成今日打卡 ✓" : "开始今日打卡"}
          </Link>
        </>
      )}
    </div>
  );
}
