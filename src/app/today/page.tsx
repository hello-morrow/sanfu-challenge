"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRecords } from "@/hooks/useRecords";
import type { DailyRecord } from "@/lib/types";
import {
  WATER_STEP, WATER_GOAL, BREAKFAST_TAGS, LUNCH_TAGS, DINNER_TAGS,
  SNACK_OPTIONS, EXERCISE_OPTIONS, EXERCISE_MAP, SLEEP_OPTIONS,
} from "@/lib/constants";
import QuickTag from "@/components/QuickTag";

function emptyMeal() { return { tags: [], note: "" }; }
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

  // Expand state
  const [expanded, setExpanded] = useState<string | null>(null);
  const toggle = (id: string) => setExpanded(prev => prev === id ? null : id);

  // Weight
  const [w, setW] = useState(r.weight?.toString() ?? "");

  // Water
  const addWater = () => setR(prev => ({ ...prev, water: Math.min(prev.water + WATER_STEP, WATER_GOAL) }));
  const removeWater = () => setR(prev => ({ ...prev, water: Math.max(prev.water - WATER_STEP, 0) }));

  // Diet
  const [bfTags, setBfTags] = useState<string[]>(r.breakfast.tags);
  const [bfNote, setBfNote] = useState(r.breakfast.note);
  const [luTags, setLuTags] = useState<string[]>(r.lunch.tags);
  const [luNote, setLuNote] = useState(r.lunch.note);
  const [diTags, setDiTags] = useState<string[]>(r.dinner.tags);
  const [diNote, setDiNote] = useState(r.dinner.note);
  const [snackType, setSnackType] = useState(r.snack?.type ?? "");

  // Exercise
  const [exList, setExList] = useState<{ label: string; minutes: string }[]>(
    r.exercise.map(e => ({
      label: EXERCISE_OPTIONS.find(o => EXERCISE_MAP[o].type === e.type) ?? "",
      minutes: e.minutes.toString(),
    }))
  );
  const toggleEx = (label: string) => {
    setExList(prev => prev.find(e => e.label === label) ? prev.filter(e => e.label !== label) : [...prev, { label, minutes: "" }]);
  };
  const setExMin = (label: string, val: string) => {
    setExList(prev => prev.map(e => e.label === label ? { ...e, minutes: val } : e));
  };

  // Sleep
  const [sl, setSl] = useState(r.sleep ?? "");

  // Note
  const [note, setNote] = useState(r.note ?? "");

  // Statuses
  const waterDone = r.water >= WATER_GOAL;
  const dietDone = !!(bfTags.length || luTags.length || diTags.length || bfNote || luNote || diNote || snackType);
  const exerciseDone = exList.length > 0;
  const sleepDone = !!sl;

  const waterStatus = waterDone ? "已完成" : r.water > 0 ? `${r.water}ml` : "未开始";
  const dietStatus = dietDone ? "已记录" : "未记录";
  const exerciseStatus = exerciseDone ? `已完成 (${exList.length}项)` : "未完成";
  const sleepStatus = sleepDone ? SLEEP_OPTIONS.find(o => o.value === sl)?.label ?? "已记录" : "等待记录";

  // Day number
  const dayNum = data.startDate
    ? Math.max(1, Math.min(40, Math.floor((new Date().getTime() - new Date(data.startDate).getTime()) / 86400000) + 1))
    : 0;

  const submit = () => {
    setSaving(true);
    if (!data.startDate) { const wv = parseFloat(w); if (!isNaN(wv) && wv > 0) setStartInfo(today, wv, null); }
    saveRecord({
      ...r, weight: w ? parseFloat(w) : null,
      breakfast: { tags: bfTags, note: bfNote },
      lunch: { tags: luTags, note: luNote },
      dinner: { tags: diTags, note: diNote },
      snack: snackType === "无" || !snackType ? null : { type: snackType },
      exercise: exList.filter(e => e.label).map(e => ({
        type: EXERCISE_MAP[e.label].type, distance: EXERCISE_MAP[e.label].distance, minutes: parseInt(e.minutes) || 0,
      })),
      sleep: (sl as DailyRecord["sleep"]) || null,
      note: note.trim() || undefined, completed: true,
    });
    setTimeout(() => { setSaving(false); router.push("/"); }, 300);
  };

  return (
    <div className="space-y-5 animate-slide-up pb-8">
      {/* Header */}
      <div className="text-center space-y-1 pt-2">
        <p className="text-[48px] font-black text-dark leading-none">
          DAY {String(dayNum).padStart(2, "0")}
        </p>
        <p className="text-xs text-text-muted font-bold">今日任务</p>
      </div>

      {/* ── Task List ── */}
      <div className="space-y-2">
        {/* 1. Water — always expanded */}
        <div className="glass p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl">💧</span>
            <div className="flex-1">
              <p className="text-sm font-extrabold text-dark">喝水</p>
              <p className={`text-[11px] font-bold ${waterDone ? "text-primary" : "text-text-muted"}`}>{waterStatus}</p>
            </div>
            <span className="text-xs font-bold text-text-muted">{WATER_GOAL}ml</span>
          </div>
          {/* Droplet dots */}
          <div className="flex gap-1.5 justify-center">
            {Array.from({ length: WATER_GOAL / WATER_STEP }).map((_, i) => {
              const filled = i < Math.floor(r.water / WATER_STEP);
              return (
                <button key={i} type="button"
                  onClick={() => filled ? removeWater() : addWater()}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                    filled ? "bg-primary text-white text-[10px]" : "bg-dark/5 text-text-muted text-[10px]"
                  }`}>
                  {filled ? "💧" : "○"}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Diet — expandable */}
        <div className="glass overflow-hidden">
          <button onClick={() => toggle("diet")} className="w-full p-4 flex items-center gap-3 text-left">
            <span className="text-xl">🍚</span>
            <div className="flex-1">
              <p className="text-sm font-extrabold text-dark">饮食</p>
              <p className={`text-[11px] font-bold ${dietDone ? "text-primary" : "text-text-muted"}`}>{dietStatus}</p>
            </div>
            <span className={`text-xs transition-transform ${expanded === "diet" ? "rotate-180" : ""}`}>▼</span>
          </button>
          {expanded === "diet" && (
            <div className="px-4 pb-4 space-y-4 border-t border-dark/5 pt-3">
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
                    className="w-full bg-base rounded-xl px-3 py-2 text-xs font-medium text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                </div>
              ))}
              <div className="space-y-2 pt-2 border-t border-dark/5">
                <label className="text-xs font-extrabold text-text-secondary uppercase tracking-wider">🍪 加餐</label>
                <QuickTag tags={SNACK_OPTIONS} selected={snackType ? [snackType] : []}
                  onToggle={(t) => setSnackType(t === snackType ? "" : t)} />
              </div>
            </div>
          )}
        </div>

        {/* 3. Exercise — expandable */}
        <div className="glass overflow-hidden">
          <button onClick={() => toggle("exercise")} className="w-full p-4 flex items-center gap-3 text-left">
            <span className="text-xl">🏃</span>
            <div className="flex-1">
              <p className="text-sm font-extrabold text-dark">运动</p>
              <p className={`text-[11px] font-bold ${exerciseDone ? "text-primary" : "text-text-muted"}`}>{exerciseStatus}</p>
            </div>
            <span className={`text-xs transition-transform ${expanded === "exercise" ? "rotate-180" : ""}`}>▼</span>
          </button>
          {expanded === "exercise" && (
            <div className="px-4 pb-4 space-y-2 border-t border-dark/5 pt-3">
              {EXERCISE_OPTIONS.map(opt => {
                const active = exList.find(e => e.label === opt);
                return (
                  <div key={opt} className="space-y-1.5">
                    <button type="button" onClick={() => toggleEx(opt)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        active ? "bg-primary/10 text-primary" : "bg-dark/5 text-text-secondary"
                      }`}>
                      <span>{opt}</span>
                      <span className={`w-5 h-5 rounded flex items-center justify-center text-xs ${active ? "bg-primary text-white" : "bg-dark/10 text-text-muted"}`}>
                        {active ? "✓" : "+"}
                      </span>
                    </button>
                    {active && (
                      <div className="flex items-center gap-2 pl-2">
                        <input type="number" inputMode="numeric" placeholder="时长" value={active.minutes}
                          onChange={(e) => setExMin(opt, e.target.value)}
                          className="flex-1 bg-base rounded-xl px-3 py-2 text-xs font-medium text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                        <span className="text-[10px] font-bold text-text-muted">min</span>
                        {EXERCISE_MAP[opt]?.distance && (
                          <span className="text-[10px] font-bold text-primary">{EXERCISE_MAP[opt].distance}km</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Sleep — expandable */}
        <div className="glass overflow-hidden">
          <button onClick={() => toggle("sleep")} className="w-full p-4 flex items-center gap-3 text-left">
            <span className="text-xl">😴</span>
            <div className="flex-1">
              <p className="text-sm font-extrabold text-dark">睡眠</p>
              <p className={`text-[11px] font-bold ${sleepDone ? "text-primary" : "text-text-muted"}`}>{sleepStatus}</p>
            </div>
            <span className={`text-xs transition-transform ${expanded === "sleep" ? "rotate-180" : ""}`}>▼</span>
          </button>
          {expanded === "sleep" && (
            <div className="px-4 pb-4 border-t border-dark/5 pt-3">
              <div className="flex gap-2">
                {SLEEP_OPTIONS.map((o) => (
                  <button key={o.value} onClick={() => setSl(o.value === sl ? "" : o.value)}
                    className={`flex-1 px-3 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                      sl === o.value ? "bg-primary text-white shadow-sm" : "bg-dark/5 text-text-secondary hover:bg-dark/10"
                    }`}>{o.label}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Weight */}
      <div className="glass p-4 flex items-center gap-3">
        <span className="text-xl">⚖️</span>
        <input type="number" inputMode="decimal" step="0.1" placeholder="今日体重" value={w}
          onChange={(e) => setW(e.target.value)}
          className="flex-1 bg-transparent text-lg font-black text-dark placeholder:text-text-muted focus:outline-none" />
        <span className="text-sm font-bold text-text-muted">kg</span>
      </div>

      {/* Note */}
      <div className="glass p-4">
        <textarea placeholder="📝 今日总结（可选）" value={note} onChange={(e) => setNote(e.target.value)} rows={2}
          className="w-full bg-transparent text-sm font-medium text-dark placeholder:text-text-muted focus:outline-none resize-none" />
      </div>

      {/* Submit */}
      <button onClick={submit} disabled={saving}
        className="w-full py-4 rounded-2xl bg-primary text-white font-extrabold text-base tracking-wide shadow-lg shadow-primary/20 hover:bg-primary-dark active:scale-[0.98] transition-all disabled:opacity-60">
        {saving ? "保存中…" : "⚡ 完成今日打卡"}
      </button>
    </div>
  );
}
