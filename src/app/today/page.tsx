"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRecords } from "@/hooks/useRecords";
import type { DailyRecord, MealRecord, ExerciseRecord } from "@/lib/types";
import {
  WATER_STEP, WATER_GOAL, BREAKFAST_TAGS, LUNCH_TAGS, DINNER_TAGS,
  SNACK_OPTIONS, EXERCISE_OPTIONS, EXERCISE_MAP, SLEEP_OPTIONS,
} from "@/lib/constants";
import WaterDroplet from "@/components/WaterDroplet";
import QuickTag from "@/components/QuickTag";

function emptyMeal(): MealRecord { return { tags: [], note: "" }; }
function emptyRecord(d: string): DailyRecord {
  return { date: d, weight: null, water: 0, breakfast: emptyMeal(), lunch: emptyMeal(), dinner: emptyMeal(),
    snack: null, exercise: [], sleep: null, completed: false };
}

export default function TodayPage() {
  const router = useRouter();
  const { data, today, todayRecord, saveRecord, setStartInfo } = useRecords();
  const [r, setR] = useState<DailyRecord>(todayRecord ?? emptyRecord(today));
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (todayRecord) setR(todayRecord); }, [todayRecord]);

  // Weight
  const [w, setW] = useState(r.weight?.toString() ?? "");

  // Meals
  const [bfTags, setBfTags] = useState<string[]>(r.breakfast.tags);
  const [bfNote, setBfNote] = useState(r.breakfast.note);
  const [luTags, setLuTags] = useState<string[]>(r.lunch.tags);
  const [luNote, setLuNote] = useState(r.lunch.note);
  const [diTags, setDiTags] = useState<string[]>(r.dinner.tags);
  const [diNote, setDiNote] = useState(r.dinner.note);

  // Snack
  const [snackType, setSnackType] = useState(r.snack?.type ?? "");
  const [snackCustom, setSnackCustom] = useState("");

  // Exercise — array of { type: ExerciseType, minutes: number }
  const [exList, setExList] = useState<{ label: string; minutes: string }[]>(
    r.exercise.map(e => ({
      label: EXERCISE_OPTIONS.find(o => EXERCISE_MAP[o].type === e.type) ?? "",
      minutes: e.minutes.toString(),
    }))
  );

  // Sleep
  const [sl, setSl] = useState(r.sleep ?? "");

  // Note
  const [note, setNote] = useState(r.note ?? "");

  const upd = (p: Partial<DailyRecord>) => setR((prev) => ({ ...prev, ...p }));

  // Exercise toggle
  const toggleExercise = (label: string) => {
    setExList(prev => {
      const exists = prev.find(e => e.label === label);
      if (exists) return prev.filter(e => e.label !== label);
      return [...prev, { label, minutes: "" }];
    });
  };
  const setExMinutes = (label: string, val: string) => {
    setExList(prev => prev.map(e => e.label === label ? { ...e, minutes: val } : e));
  };

  const submit = () => {
    setSaving(true);
    if (!data.startDate) { const wv = parseFloat(w); if (!isNaN(wv) && wv > 0) setStartInfo(today, wv, null); }

    const exercises: ExerciseRecord[] = exList
      .filter(e => e.label)
      .map(e => ({
        type: EXERCISE_MAP[e.label].type,
        distance: EXERCISE_MAP[e.label].distance,
        minutes: parseInt(e.minutes) || 0,
      }));

    const foodDone = !!(bfTags.length || luTags.length || diTags.length || bfNote || luNote || diNote || snackType);

    saveRecord({
      ...r,
      weight: w ? parseFloat(w) : null,
      water: r.water,
      breakfast: { tags: bfTags, note: bfNote },
      lunch: { tags: luTags, note: luNote },
      dinner: { tags: diTags, note: diNote },
      snack: snackType === "无" || !snackType ? null
        : { type: snackType === "自定义" ? snackCustom : snackType },
      exercise: exercises,
      sleep: (sl as DailyRecord["sleep"]) || null,
      note: note.trim() || undefined,
      completed: true,
    });
    setTimeout(() => { setSaving(false); router.push("/"); }, 300);
  };

  // Completion: 4 items (water, diet, exercise, sleep)
  const waterDone = r.water >= WATER_GOAL;
  const dietDone = !!(bfTags.length || luTags.length || diTags.length || bfNote || luNote || diNote || snackType);
  const exerciseDone = exList.length > 0;
  const sleepDone = !!sl;
  const sections = [
    { id: "wa", label: "饮水", done: waterDone },
    { id: "d", label: "饮食", done: dietDone },
    { id: "e", label: "运动", done: exerciseDone },
    { id: "s", label: "睡眠", done: sleepDone },
  ];
  const dn = sections.filter(s => s.done).length;

  return (
    <div className="space-y-5 animate-slide-up pb-8">
      <div className="text-center space-y-2 pt-2">
        <p className="text-[28px] font-black text-dark leading-tight">今日打卡</p>
        <p className="text-xs text-text-muted font-bold">{today}</p>
      </div>

      {/* Progress */}
      <div className="glass p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-text-secondary uppercase tracking-widest">任务进度</span>
          <span className="text-2xl font-black text-primary">{dn}<span className="text-sm text-text-muted font-bold">/4</span></span>
        </div>
        <div className="w-full h-2 rounded-full bg-dark/5 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${(dn/4)*100}%`, background: "linear-gradient(90deg, #FF6B35, #FFB703)" }} />
        </div>
      </div>

      {/* 1. Weight */}
      <section className="glass p-4 space-y-3">
        <h3 className="text-sm font-extrabold text-dark">⚖️ 体重记录</h3>
        <div className="flex items-center gap-2">
          <input type="number" inputMode="decimal" step="0.1" placeholder="输入今日体重" value={w}
            onChange={(e) => setW(e.target.value)}
            className="flex-1 bg-base rounded-xl px-4 py-3.5 text-lg font-black text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
          <span className="text-sm font-bold text-text-secondary">KG</span>
        </div>
      </section>

      {/* 2. Water */}
      <section className="glass p-4">
        <WaterDroplet water={r.water} onAdd={() => upd({ water: Math.min(r.water + WATER_STEP, WATER_GOAL) })} />
      </section>

      {/* 3. Diet — multi-select */}
      <section className="glass p-4 space-y-5">
        <h3 className="text-sm font-extrabold text-dark">🥗 饮食记录</h3>
        {([
          { m: "早餐", tags: BREAKFAST_TAGS, sel: bfTags, setSel: setBfTags, note: bfNote, setNote: setBfNote },
          { m: "午餐", tags: LUNCH_TAGS, sel: luTags, setSel: setLuTags, note: luNote, setNote: setLuNote },
          { m: "晚餐", tags: DINNER_TAGS, sel: diTags, setSel: setDiTags, note: diNote, setNote: setDiNote },
        ] as const).map(meal => (
          <div key={meal.m} className="space-y-2">
            <label className="text-xs font-extrabold text-text-secondary uppercase tracking-wider">{meal.m}</label>
            <QuickTag multi tags={meal.tags} selected={meal.sel}
              onToggle={(t) => meal.setSel(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])} />
            <input type="text" placeholder="补充备注..." value={meal.note}
              onChange={(e) => meal.setNote(e.target.value)}
              className="w-full bg-base rounded-xl px-4 py-2.5 text-sm font-medium text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
          </div>
        ))}

        {/* Snack */}
        <div className="space-y-2 pt-2 border-t border-dark/5">
          <label className="text-xs font-extrabold text-text-secondary uppercase tracking-wider">🍪 加餐</label>
          <QuickTag tags={SNACK_OPTIONS} selected={snackType ? [snackType] : []}
            onToggle={(t) => setSnackType(t === snackType ? "" : t)} />
          {snackType === "自定义" && (
            <input type="text" placeholder="输入加餐内容..." value={snackCustom}
              onChange={(e) => setSnackCustom(e.target.value)}
              className="w-full bg-base rounded-xl px-4 py-2.5 text-sm font-medium text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
          )}
        </div>
      </section>

      {/* 4. Exercise — multi-select */}
      <section className="glass p-4 space-y-4">
        <h3 className="text-sm font-extrabold text-dark">🏃 运动记录</h3>
        <div className="space-y-3">
          {EXERCISE_OPTIONS.map(opt => {
            const active = exList.find(e => e.label === opt);
            return (
              <div key={opt} className="space-y-2">
                <button
                  type="button"
                  onClick={() => toggleExercise(opt)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    active ? "bg-primary/10 text-primary" : "bg-dark/5 text-text-secondary"
                  }`}>
                  <span>{opt}</span>
                  <span className={`w-5 h-5 rounded flex items-center justify-center text-xs ${active ? "bg-primary text-white" : "bg-dark/10 text-text-muted"}`}>
                    {active ? "✓" : "+"}
                  </span>
                </button>
                {active && (
                  <div className="flex items-center gap-2 pl-2">
                    <input type="number" inputMode="numeric" placeholder="时长(分钟)" value={active.minutes}
                      onChange={(e) => setExMinutes(opt, e.target.value)}
                      className="flex-1 bg-base rounded-xl px-4 py-2.5 text-sm font-medium text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                    <span className="text-xs font-bold text-text-muted">min</span>
                    {EXERCISE_MAP[opt]?.distance && (
                      <span className="text-xs font-bold text-primary whitespace-nowrap">{EXERCISE_MAP[opt].distance}km</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Sleep */}
      <section className="glass p-4 space-y-3">
        <h3 className="text-sm font-extrabold text-dark">😴 睡眠记录</h3>
        <div className="flex gap-2">
          {SLEEP_OPTIONS.map((o) => (
            <button key={o.value} onClick={() => setSl(o.value === sl ? "" : o.value)}
              className={`flex-1 px-3 py-3.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                sl === o.value ? "bg-primary text-white shadow-sm" : "bg-dark/5 text-text-secondary hover:bg-dark/10"
              }`}>{o.label}</button>
          ))}
        </div>
      </section>

      {/* 6. Summary / Note */}
      <section className="glass p-4 space-y-3">
        <h3 className="text-sm font-extrabold text-dark">📝 今日总结</h3>
        <textarea placeholder="今天聚餐 / 状态不好 / 暴食了..." value={note} onChange={(e) => setNote(e.target.value)} rows={2}
          className="w-full bg-base rounded-xl px-4 py-3 text-sm font-medium text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none" />
      </section>

      <button onClick={submit} disabled={saving}
        className="w-full py-4 rounded-2xl bg-primary text-white font-extrabold text-base tracking-wide shadow-lg shadow-primary/20 hover:bg-primary-dark active:scale-[0.98] transition-all disabled:opacity-60">
        {saving ? "保存中…" : "⚡ 完成今日打卡"}
      </button>
    </div>
  );
}
