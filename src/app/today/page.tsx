"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRecords } from "@/hooks/useRecords";
import type { DailyRecord, ExerciseRecord } from "@/lib/types";
import {
  WATER_STEP,
  WATER_GOAL,
  BREAKFAST_TAGS,
  LUNCH_TAGS,
  DINNER_TAGS,
  EXERCISE_OPTIONS,
  EXERCISE_MAP,
  SLEEP_OPTIONS,
} from "@/lib/constants";
import ProgressBar from "@/components/ProgressBar";
import WaterDroplet from "@/components/WaterDroplet";
import QuickTag from "@/components/QuickTag";

function emptyRecord(date: string): DailyRecord {
  return {
    date,
    weight: null,
    water: 0,
    breakfast: "",
    lunch: "",
    dinner: "",
    exercise: null,
    sleep: null,
    completed: false,
  };
}

export default function TodayPage() {
  const router = useRouter();
  const { data, today, todayRecord, saveRecord, setStartInfo } = useRecords();

  const [record, setRecord] = useState<DailyRecord>(
    todayRecord ?? emptyRecord(today)
  );
  const [saving, setSaving] = useState(false);

  // sync if todayRecord changes externally
  useEffect(() => {
    if (todayRecord) setRecord(todayRecord);
  }, [todayRecord]);

  // Weight
  const [weightInput, setWeightInput] = useState(
    record.weight?.toString() ?? ""
  );

  // Custom text inputs
  const [customBreakfast, setCustomBreakfast] = useState(record.breakfast);
  const [customLunch, setCustomLunch] = useState(record.lunch);
  const [customDinner, setCustomDinner] = useState(record.dinner);

  // Exercise
  const [exerciseType, setExerciseType] = useState(
    record.exercise?.type ?? ""
  );
  const [exerciseMinutes, setExerciseMinutes] = useState(
    record.exercise?.minutes?.toString() ?? ""
  );

  // Sleep
  const [sleep, setSleep] = useState(record.sleep ?? "");

  // Note
  const [note, setNote] = useState(record.note ?? "");

  // Helper: update record
  const update = (patch: Partial<DailyRecord>) => {
    setRecord((prev) => ({ ...prev, ...patch }));
  };

  const handleSubmit = () => {
    setSaving(true);

    // Save start info if first record
    if (!data.startDate) {
      const w = parseFloat(weightInput);
      if (!isNaN(w) && w > 0) {
        setStartInfo(today, w);
      }
    }

    const final: DailyRecord = {
      ...record,
      weight: weightInput ? parseFloat(weightInput) : null,
      breakfast: customBreakfast,
      lunch: customLunch,
      dinner: customDinner,
      exercise: exerciseType
        ? {
            type: EXERCISE_MAP[exerciseType].type,
            distance: EXERCISE_MAP[exerciseType].distance,
            minutes: parseInt(exerciseMinutes) || 0,
          }
        : null,
      note: note.trim() || undefined,
      sleep: (sleep as DailyRecord["sleep"]) || null,
      completed: true,
    };

    saveRecord(final);
    setTimeout(() => {
      setSaving(false);
      router.push("/");
    }, 300);
  };

  // Calculate completeness
  let filled = 0;
  const total = 5;
  if (weightInput) filled++;
  if (record.water > 0) filled++;
  if (customBreakfast || customLunch || customDinner) filled++;
  if (exerciseType) filled++;
  if (sleep) filled++;

  return (
    <div className="space-y-6 animate-in pb-8">
      <div className="text-center space-y-1">
        <h1 className="text-lg font-bold text-text-primary">今日打卡</h1>
        <p className="text-sm text-text-muted">{today}</p>
      </div>

      {/* Overall progress */}
      <div className="rounded-2xl bg-card-bg border border-border p-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-text-secondary">完成进度</span>
          <span className="font-medium text-green-primary">
            {filled}/{total}
          </span>
        </div>
        <ProgressBar value={filled} max={total} />
      </div>

      {/* 1. Weight */}
      <section className="rounded-2xl bg-card-bg border border-border p-4 space-y-3">
        <h3 className="text-sm font-medium text-text-primary flex items-center gap-1.5">
          ⚖️ 体重记录
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            placeholder="输入今日体重"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            className="flex-1 bg-cream border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-green-primary transition-colors"
          />
          <span className="text-sm text-text-muted flex-shrink-0">kg</span>
        </div>
      </section>

      {/* 2. Water */}
      <section className="rounded-2xl bg-card-bg border border-border p-4">
        <h3 className="text-sm font-medium text-text-primary mb-3 flex items-center gap-1.5">
          💧 饮水记录
        </h3>
        <WaterDroplet
          water={record.water}
          onAdd={() =>
            update({ water: Math.min(record.water + WATER_STEP, WATER_GOAL) })
          }
        />
      </section>

      {/* 3. Food */}
      <section className="rounded-2xl bg-card-bg border border-border p-4 space-y-4">
        <h3 className="text-sm font-medium text-text-primary flex items-center gap-1.5">
          🥗 饮食记录
        </h3>

        {/* Breakfast */}
        <div className="space-y-2">
          <label className="text-xs text-text-secondary">早餐</label>
          <QuickTag
            tags={BREAKFAST_TAGS}
            selected={customBreakfast}
            onSelect={(t) =>
              setCustomBreakfast(t === customBreakfast ? "" : t)
            }
          />
          <input
            type="text"
            placeholder="自定义输入..."
            value={customBreakfast}
            onChange={(e) => setCustomBreakfast(e.target.value)}
            className="w-full bg-cream border border-border rounded-xl px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-green-primary transition-colors"
          />
        </div>

        {/* Lunch */}
        <div className="space-y-2">
          <label className="text-xs text-text-secondary">午餐</label>
          <QuickTag
            tags={LUNCH_TAGS}
            selected={customLunch}
            onSelect={(t) => setCustomLunch(t === customLunch ? "" : t)}
          />
          <input
            type="text"
            placeholder="自定义输入..."
            value={customLunch}
            onChange={(e) => setCustomLunch(e.target.value)}
            className="w-full bg-cream border border-border rounded-xl px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-green-primary transition-colors"
          />
        </div>

        {/* Dinner */}
        <div className="space-y-2">
          <label className="text-xs text-text-secondary">晚餐</label>
          <QuickTag
            tags={DINNER_TAGS}
            selected={customDinner}
            onSelect={(t) => setCustomDinner(t === customDinner ? "" : t)}
          />
          <input
            type="text"
            placeholder="自定义输入..."
            value={customDinner}
            onChange={(e) => setCustomDinner(e.target.value)}
            className="w-full bg-cream border border-border rounded-xl px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-green-primary transition-colors"
          />
        </div>
      </section>

      {/* 4. Exercise */}
      <section className="rounded-2xl bg-card-bg border border-border p-4 space-y-3">
        <h3 className="text-sm font-medium text-text-primary flex items-center gap-1.5">
          🏃 运动记录
        </h3>
        <QuickTag
          tags={EXERCISE_OPTIONS}
          selected={exerciseType}
          onSelect={(t) =>
            setExerciseType(t === exerciseType ? "" : t)
          }
        />
        {exerciseType && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              placeholder="运动时长"
              value={exerciseMinutes}
              onChange={(e) => setExerciseMinutes(e.target.value)}
              className="flex-1 bg-cream border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-green-primary transition-colors"
            />
            <span className="text-sm text-text-muted flex-shrink-0">分钟</span>
          </div>
        )}
      </section>

      {/* 5. Sleep */}
      <section className="rounded-2xl bg-card-bg border border-border p-4 space-y-3">
        <h3 className="text-sm font-medium text-text-primary flex items-center gap-1.5">
          😴 睡眠记录
        </h3>
        <div className="flex gap-2">
          {SLEEP_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSleep(opt.value === sleep ? "" : opt.value)}
              className={`flex-1 px-3 py-3 rounded-xl text-sm border transition-all ${
                sleep === opt.value
                  ? "border-green-primary bg-green-pale text-green-primary font-medium"
                  : "border-border text-text-secondary hover:border-green-light"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* 6. Note */}
      <section className="rounded-2xl bg-card-bg border border-border p-4 space-y-3">
        <h3 className="text-sm font-medium text-text-primary flex items-center gap-1.5">
          📝 今日备注
        </h3>
        <textarea
          placeholder="今天聚餐 / 状态不好 / 暴食了..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="w-full bg-cream border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-green-primary transition-colors resize-none"
        />
      </section>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={saving}
        className="w-full py-4 rounded-2xl bg-green-primary text-white font-medium text-base shadow-sm hover:bg-green-primary/90 active:scale-[0.98] transition-all disabled:opacity-60"
      >
        {saving ? "保存中…" : "完成今日打卡 ✓"}
      </button>
    </div>
  );
}
