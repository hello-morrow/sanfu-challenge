"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRecords } from "@/hooks/useRecords";
import type { DailyRecord } from "@/lib/types";
import {
  WATER_STEP, WATER_GOAL, BREAKFAST_TAGS, LUNCH_TAGS, DINNER_TAGS,
  EXERCISE_OPTIONS, EXERCISE_MAP, SLEEP_OPTIONS,
} from "@/lib/constants";
import ProgressBar from "@/components/ProgressBar";
import WaterDroplet from "@/components/WaterDroplet";
import QuickTag from "@/components/QuickTag";

function emptyRecord(date: string): DailyRecord {
  return { date, weight: null, water: 0, breakfast: "", lunch: "", dinner: "", exercise: null, sleep: null, completed: false };
}

export default function TodayPage() {
  const router = useRouter();
  const { data, today, todayRecord, saveRecord, setStartInfo } = useRecords();
  const [record, setRecord] = useState<DailyRecord>(todayRecord ?? emptyRecord(today));
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (todayRecord) setRecord(todayRecord); }, [todayRecord]);

  const [weightInput, setWeightInput] = useState(record.weight?.toString() ?? "");
  const [customBreakfast, setCustomBreakfast] = useState(record.breakfast);
  const [customLunch, setCustomLunch] = useState(record.lunch);
  const [customDinner, setCustomDinner] = useState(record.dinner);
  const [exerciseType, setExerciseType] = useState(record.exercise?.type ? EXERCISE_OPTIONS.find(o => EXERCISE_MAP[o].type === record.exercise!.type) ?? "" : "");
  const [exerciseMinutes, setExerciseMinutes] = useState(record.exercise?.minutes?.toString() ?? "");
  const [sleep, setSleep] = useState(record.sleep ?? "");
  const [note, setNote] = useState(record.note ?? "");

  const update = (patch: Partial<DailyRecord>) => setRecord((prev) => ({ ...prev, ...patch }));

  const handleSubmit = () => {
    setSaving(true);
    if (!data.startDate) {
      const w = parseFloat(weightInput);
      if (!isNaN(w) && w > 0) setStartInfo(today, w);
    }
    const final: DailyRecord = {
      ...record,
      weight: weightInput ? parseFloat(weightInput) : null,
      breakfast: customBreakfast, lunch: customLunch, dinner: customDinner,
      exercise: exerciseType
        ? { type: EXERCISE_MAP[exerciseType].type, distance: EXERCISE_MAP[exerciseType].distance, minutes: parseInt(exerciseMinutes) || 0 }
        : null,
      note: note.trim() || undefined,
      sleep: (sleep as DailyRecord["sleep"]) || null,
      completed: true,
    };
    saveRecord(final);
    setTimeout(() => { setSaving(false); router.push("/"); }, 300);
  };

  let filled = 0;
  if (weightInput) filled++; if (record.water > 0) filled++; if (customBreakfast || customLunch || customDinner) filled++; if (exerciseType) filled++; if (sleep) filled++;

  const sections = [
    { id: "weight", title: "⚖️ 体重记录", done: !!weightInput },
    { id: "water", title: "💧 饮水记录", done: record.water >= WATER_GOAL },
    { id: "food", title: "🥗 饮食记录", done: !!(customBreakfast || customLunch || customDinner) },
    { id: "exercise", title: "🏃 运动记录", done: !!exerciseType },
    { id: "sleep", title: "😴 睡眠记录", done: !!sleep },
  ];
  const doneCount = sections.filter(s => s.done).length;

  return (
    <div className="space-y-5 animate-slide-up pb-8">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 bg-dark text-white px-4 py-1.5 rounded-full">
          <span className="text-lg">⚡</span>
          <span className="text-xs font-bold tracking-widest">今日打卡</span>
        </div>
        <p className="text-xs text-text-muted font-medium">{today}</p>
      </div>

      {/* Progress */}
      <div className="rounded-2xl bg-card-bg border-2 border-dark/5 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">任务进度</span>
          <span className="text-lg font-black text-primary">{doneCount}<span className="text-sm text-text-muted">/5</span></span>
        </div>
        <ProgressBar value={doneCount} max={5} />
      </div>

      {/* 1. Weight */}
      <section className="rounded-2xl bg-card-bg border-2 border-dark/5 p-4 space-y-3">
        <h3 className="text-sm font-extrabold text-dark">⚖️ 体重记录</h3>
        <div className="flex items-center gap-2">
          <input type="number" inputMode="decimal" step="0.1" placeholder="输入今日体重"
            value={weightInput} onChange={(e) => setWeightInput(e.target.value)}
            className="flex-1 bg-base border-2 border-dark/10 rounded-xl px-4 py-3.5 text-lg font-bold text-dark placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors" />
          <span className="text-sm font-bold text-text-secondary flex-shrink-0">KG</span>
        </div>
      </section>

      {/* 2. Water */}
      <section className="rounded-2xl bg-card-bg border-2 border-dark/5 p-4">
        <WaterDroplet water={record.water} onAdd={() => update({ water: Math.min(record.water + WATER_STEP, WATER_GOAL) })} />
      </section>

      {/* 3. Food */}
      <section className="rounded-2xl bg-card-bg border-2 border-dark/5 p-4 space-y-4">
        <h3 className="text-sm font-extrabold text-dark">🥗 饮食记录</h3>
        {(["早餐", "午餐", "晚餐"] as const).map((meal) => {
          const tags = meal === "早餐" ? BREAKFAST_TAGS : meal === "午餐" ? LUNCH_TAGS : DINNER_TAGS;
          const val = meal === "早餐" ? customBreakfast : meal === "午餐" ? customLunch : customDinner;
          const setVal = meal === "早餐" ? setCustomBreakfast : meal === "午餐" ? setCustomLunch : setCustomDinner;
          return (
            <div key={meal} className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{meal}</label>
              <QuickTag tags={tags} selected={val} onSelect={(t) => setVal(t === val ? "" : t)} />
              <input type="text" placeholder="自定义输入..." value={val}
                onChange={(e) => setVal(e.target.value)}
                className="w-full bg-base border-2 border-dark/10 rounded-xl px-4 py-3 text-sm font-medium text-dark placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors" />
            </div>
          );
        })}
      </section>

      {/* 4. Exercise */}
      <section className="rounded-2xl bg-card-bg border-2 border-dark/5 p-4 space-y-3">
        <h3 className="text-sm font-extrabold text-dark">🏃 运动记录</h3>
        <QuickTag tags={EXERCISE_OPTIONS} selected={exerciseType}
          onSelect={(t) => setExerciseType(t === exerciseType ? "" : t)} />
        {exerciseType && (
          <div className="flex items-center gap-2">
            <input type="number" inputMode="numeric" placeholder="运动时长"
              value={exerciseMinutes} onChange={(e) => setExerciseMinutes(e.target.value)}
              className="flex-1 bg-base border-2 border-dark/10 rounded-xl px-4 py-3 text-sm font-bold text-dark placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors" />
            <span className="text-sm font-bold text-text-secondary flex-shrink-0">分钟</span>
          </div>
        )}
      </section>

      {/* 5. Sleep */}
      <section className="rounded-2xl bg-card-bg border-2 border-dark/5 p-4 space-y-3">
        <h3 className="text-sm font-extrabold text-dark">😴 睡眠记录</h3>
        <div className="flex gap-2">
          {SLEEP_OPTIONS.map((opt) => (
            <button key={opt.value}
              onClick={() => setSleep(opt.value === sleep ? "" : opt.value)}
              className={`flex-1 px-3 py-3.5 rounded-xl text-sm font-bold border-2 transition-all active:scale-95 ${
                sleep === opt.value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-dark/10 text-text-secondary hover:border-dark/20"
              }`}>
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* 6. Note */}
      <section className="rounded-2xl bg-card-bg border-2 border-dark/5 p-4 space-y-3">
        <h3 className="text-sm font-extrabold text-dark">📝 今日备注</h3>
        <textarea placeholder="今天聚餐 / 状态不好 / 暴食了..."
          value={note} onChange={(e) => setNote(e.target.value)} rows={2}
          className="w-full bg-base border-2 border-dark/10 rounded-xl px-4 py-3 text-sm font-medium text-dark placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors resize-none" />
      </section>

      {/* Submit */}
      <button onClick={handleSubmit} disabled={saving}
        className="w-full py-4 rounded-2xl bg-primary text-white font-extrabold text-base tracking-wide shadow-lg shadow-primary/25 hover:bg-primary-dark active:scale-[0.98] transition-all disabled:opacity-60">
        {saving ? "保存中…" : "⚡ 完成今日打卡"}
      </button>
    </div>
  );
}
