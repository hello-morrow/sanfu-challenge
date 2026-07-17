"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRecords } from "@/hooks/useRecords";
import type { DailyRecord, ExerciseRecord, BodyMeasurements, MoodRecord } from "@/lib/types";
import {
  WATER_STEP, WATER_GOAL, BREAKFAST_TAGS, LUNCH_TAGS, DINNER_TAGS,
  SNACK_OPTIONS, EXERCISE_LIBRARY, INTENSITY_OPTIONS, SLEEP_OPTIONS,
  DIET_RATINGS, MEASUREMENT_LABELS, MOOD_OPTIONS,
} from "@/lib/constants";
import QuickTag from "@/components/QuickTag";

function emptyMeal() { return { tags: [], note: "" }; }
function emptyMeas(): BodyMeasurements { return { waist: null, hip: null, thigh: null, arm: null, chest: null }; }
function emptyRecord(d: string): DailyRecord {
  return { date: d, weight: null, water: 0, breakfast: emptyMeal(), lunch: emptyMeal(), dinner: emptyMeal(),
    snack: null, exercise: [], sleep: null, measurements: null, dietRating: null, mood: null, completed: false };
}

export default function TodayPage() {
  const router = useRouter();
  const { data, today, todayRecord, saveRecord, setStartInfo } = useRecords();
  const [r, setR] = useState<DailyRecord>(todayRecord ?? emptyRecord(today));
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (todayRecord) setR(todayRecord); }, [todayRecord]);

  const [expanded, setExpanded] = useState<string | null>(null);
  const toggle = (id: string) => setExpanded(p => p === id ? null : id);

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
  const [dietRating, setDietRating] = useState(r.dietRating ?? "");

  // Exercise
  const [exList, setExList] = useState<{ label: string; duration: string; intensity: string }[]>(
    r.exercise.map(e => ({ label: e.type, duration: e.duration.toString(), intensity: e.intensity }))
  );
  const toggleEx = (label: string) => {
    setExList(prev => prev.find(e => e.label === label)
      ? prev.filter(e => e.label !== label)
      : [...prev, { label, duration: "", intensity: "moderate" }]);
  };
  const setExField = (label: string, field: "duration" | "intensity", val: string) => {
    setExList(prev => prev.map(e => e.label === label ? { ...e, [field]: val } : e));
  };

  // Measurements
  const [meas, setMeas] = useState<BodyMeasurements>(r.measurements ?? emptyMeas());
  const setM = (key: keyof BodyMeasurements, val: string) => {
    setMeas(prev => ({ ...prev, [key]: val ? parseFloat(val) : null }));
  };

  // Sleep
  const [sl, setSl] = useState(r.sleep ?? "");

  // Note
  const [note, setNote] = useState(r.note ?? "");

  // Mood
  const [moodType, setMoodType] = useState(r.mood?.type ?? "");
  const [moodNote, setMoodNote] = useState(r.mood?.note ?? "");

  // Statuses
  const waterDone = r.water >= WATER_GOAL;
  const dietDone = !!(bfTags.length || luTags.length || diTags.length || snackType);
  const exerciseDone = exList.length > 0;
  const sleepDone = !!sl;

  const dayNum = data.startDate
    ? Math.max(1, Math.min(40, Math.floor((new Date().getTime() - new Date(data.startDate).getTime()) / 86400000) + 1))
    : 0;

  const submit = () => {
    setSaving(true);
    if (!data.startDate) { const wv = parseFloat(w); if (!isNaN(wv) && wv > 0) setStartInfo(today, wv, null); }

    const def = EXERCISE_LIBRARY.find(e => true);
    const exercises: ExerciseRecord[] = exList.filter(e => e.label).map(e => {
      const d = EXERCISE_LIBRARY.find(x => x.label === e.label);
      return {
        category: d?.category ?? "aerobic",
        type: e.label,
        duration: parseInt(e.duration) || 0,
        intensity: (e.intensity || "moderate") as ExerciseRecord["intensity"],
        distance: d?.distance,
      };
    });

    const hasMeas = Object.values(meas).some(v => v !== null);

    saveRecord({
      ...r, weight: w ? parseFloat(w) : null,
      breakfast: { tags: bfTags, note: bfNote },
      lunch: { tags: luTags, note: luNote },
      dinner: { tags: diTags, note: diNote },
      snack: snackType === "无" || !snackType ? null : { type: snackType },
      exercise: exercises,
      measurements: hasMeas ? meas : null,
      dietRating: (dietRating || null) as DailyRecord["dietRating"],
      mood: moodType ? { type: moodType as MoodRecord["type"], note: moodNote } : null,
      sleep: (sl as DailyRecord["sleep"]) || null,
      note: note.trim() || undefined, completed: true,
    });
    setTimeout(() => { setSaving(false); router.push("/"); }, 300);
  };

  const aerobicEx = EXERCISE_LIBRARY.filter(e => e.category === "aerobic");
  const anaerobicEx = EXERCISE_LIBRARY.filter(e => e.category === "anaerobic");

  return (
    <div className="space-y-5 animate-slide-up pb-8">
      <div className="text-center space-y-1 pt-2">
        <p className="text-[48px] font-black text-dark leading-none">DAY {String(dayNum).padStart(2,"0")}</p>
        <p className="text-xs text-text-muted font-bold">今日生存任务</p>
      </div>

      <div className="space-y-2">
        {/* Water */}
        <div className="border-2 border-dark bg-white/40 p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl">💧</span>
            <div className="flex-1"><p className="text-sm font-extrabold text-dark">喝水</p>
              <p className={`text-[11px] font-bold ${waterDone?"text-primary":"text-text-muted"}`}>
                {waterDone?"已完成":r.water>0?`${r.water}ml`:"未开始"}</p></div>
            <span className="text-xs font-bold text-text-muted">{WATER_GOAL}ml</span>
          </div>
          <div className="flex gap-1.5 justify-center">
            {Array.from({length:WATER_GOAL/WATER_STEP}).map((_,i)=>{
              const filled = i < Math.floor(r.water/WATER_STEP);
              return <button key={i} type="button" onClick={()=>filled?removeWater():addWater()}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-90 ${filled?"bg-primary text-white text-[10px]":"bg-dark/5 text-text-muted text-[10px]"}`}>
                {filled?"💧":"○"}</button>;
            })}
          </div>
        </div>

        {/* Diet */}
        <div className="border-2 border-dark bg-white/40 overflow-hidden">
          <button onClick={()=>toggle("diet")} className="w-full p-4 flex items-center gap-3 text-left">
            <span className="text-xl">🍚</span>
            <div className="flex-1"><p className="text-sm font-extrabold text-dark">饮食</p>
              <p className={`text-[11px] font-bold ${dietDone?"text-primary":"text-text-muted"}`}>{dietDone?"已记录":"未记录"}</p></div>
            <span className={`text-xs transition-transform ${expanded==="diet"?"rotate-180":""}`}>▼</span>
          </button>
          {expanded==="diet" && (
            <div className="px-4 pb-4 space-y-4 border-t border-dark/5 pt-3">
              {([
                {m:"早餐",tags:BREAKFAST_TAGS,sel:bfTags,setSel:setBfTags,note:bfNote,setNote:setBfNote},
                {m:"午餐",tags:LUNCH_TAGS,sel:luTags,setSel:setLuTags,note:luNote,setNote:setLuNote},
                {m:"晚餐",tags:DINNER_TAGS,sel:diTags,setSel:setDiTags,note:diNote,setNote:setDiNote},
              ] as const).map(meal=>(
                <div key={meal.m} className="space-y-2">
                  <label className="text-xs font-extrabold text-text-secondary uppercase tracking-wider">{meal.m}</label>
                  <QuickTag multi tags={meal.tags} selected={meal.sel}
                    onToggle={t=>meal.setSel(p=>p.includes(t)?p.filter(x=>x!==t):[...p,t])} />
                  <input type="text" placeholder="补充备注..." value={meal.note} onChange={e=>meal.setNote(e.target.value)}
                    className="w-full bg-base rounded-xl px-3 py-2 text-xs font-medium text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                </div>
              ))}
              <div className="space-y-2 pt-2 border-t border-dark/5">
                <label className="text-xs font-extrabold text-text-secondary uppercase tracking-wider">🍪 加餐</label>
                <QuickTag tags={SNACK_OPTIONS} selected={snackType?[snackType]:[]}
                  onToggle={t=>setSnackType(t===snackType?"":t)} />
              </div>
              <div className="space-y-2 pt-2 border-t border-dark/5">
                <label className="text-xs font-extrabold text-text-secondary uppercase tracking-wider">饮食评价</label>
                <div className="flex gap-2">
                  {DIET_RATINGS.map(o=>(
                    <button key={o.value} onClick={()=>setDietRating(o.value===dietRating?"":o.value)}
                      className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${dietRating===o.value?"bg-primary text-white shadow-sm":"bg-dark/5 text-text-secondary hover:bg-dark/10"}`}>
                      {o.label}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Exercise */}
        <div className="border-2 border-dark bg-white/40 overflow-hidden">
          <button onClick={()=>toggle("exercise")} className="w-full p-4 flex items-center gap-3 text-left">
            <span className="text-xl">🏃</span>
            <div className="flex-1"><p className="text-sm font-extrabold text-dark">运动</p>
              <p className={`text-[11px] font-bold ${exerciseDone?"text-primary":"text-text-muted"}`}>
                {exerciseDone?`已完成 (${exList.length}项)`:"未完成"}</p></div>
            <span className={`text-xs transition-transform ${expanded==="exercise"?"rotate-180":""}`}>▼</span>
          </button>
          {expanded==="exercise" && (
            <div className="px-4 pb-4 space-y-4 border-t border-dark/5 pt-3">
              {[{cat:"有氧训练",items:aerobicEx},{cat:"无氧训练",items:anaerobicEx}].map(grp=>(
                <div key={grp.cat} className="space-y-2">
                  <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider">{grp.cat}</p>
                  {grp.items.map(ex=>{
                    const active = exList.find(e=>e.label===ex.label);
                    return (
                      <div key={ex.label} className="space-y-1.5">
                        <button type="button" onClick={()=>toggleEx(ex.label)}
                          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${active?"bg-primary/10 text-primary":"bg-dark/5 text-text-secondary"}`}>
                          <span>{ex.label}{ex.distance?` (${ex.distance}km)`:""}</span>
                          <span className={`w-5 h-5 rounded flex items-center justify-center text-xs ${active?"bg-primary text-white":"bg-dark/10 text-text-muted"}`}>
                            {active?"✓":"+"}</span>
                        </button>
                        {active && (
                          <div className="flex items-center gap-2 pl-2 flex-wrap">
                            <input type="number" inputMode="numeric" placeholder="时长" value={active.duration}
                              onChange={e=>setExField(ex.label,"duration",e.target.value)}
                              className="w-16 bg-base rounded-lg px-2 py-1.5 text-xs font-medium text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                            <span className="text-[10px] text-text-muted font-bold">min</span>
                            <select value={active.intensity} onChange={e=>setExField(ex.label,"intensity",e.target.value)}
                              className="bg-base rounded-lg px-2 py-1.5 text-xs font-bold text-dark focus:outline-none focus:ring-2 focus:ring-primary/30">
                              {INTENSITY_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Measurements */}
        <div className="border-2 border-dark bg-white/40 overflow-hidden">
          <button onClick={()=>toggle("measurements")} className="w-full p-4 flex items-center gap-3 text-left">
            <span className="text-xl">📏</span>
            <div className="flex-1"><p className="text-sm font-extrabold text-dark">身体围度</p>
              <p className={`text-[11px] font-bold ${Object.values(meas).some(v=>v!==null)?"text-primary":"text-text-muted"}`}>
                {Object.values(meas).some(v=>v!==null)?"已记录":"未记录"}</p></div>
            <span className={`text-xs transition-transform ${expanded==="measurements"?"rotate-180":""}`}>▼</span>
          </button>
          {expanded==="measurements" && (
            <div className="px-4 pb-4 border-t border-dark/5 pt-3">
              <div className="grid grid-cols-2 gap-2">
                {MEASUREMENT_LABELS.map(m=>(
                  <div key={m.key} className="flex items-center gap-2 bg-base rounded-xl px-3 py-2">
                    <span className="text-xs font-bold text-text-secondary w-12">{m.label}</span>
                    <input type="number" inputMode="decimal" step="0.1" placeholder="--"
                      value={meas[m.key]?.toString()??""}
                      onChange={e=>setM(m.key,e.target.value)}
                      className="flex-1 bg-transparent text-sm font-bold text-dark placeholder:text-text-muted focus:outline-none text-right" />
                    <span className="text-[10px] text-text-muted font-bold">cm</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sleep */}
        <div className="border-2 border-dark bg-white/40 overflow-hidden">
          <button onClick={()=>toggle("sleep")} className="w-full p-4 flex items-center gap-3 text-left">
            <span className="text-xl">😴</span>
            <div className="flex-1"><p className="text-sm font-extrabold text-dark">睡眠</p>
              <p className={`text-[11px] font-bold ${sleepDone?"text-primary":"text-text-muted"}`}>
                {sleepDone?SLEEP_OPTIONS.find(o=>o.value===sl)?.label??"已记录":"等待记录"}</p></div>
            <span className={`text-xs transition-transform ${expanded==="sleep"?"rotate-180":""}`}>▼</span>
          </button>
          {expanded==="sleep" && (
            <div className="px-4 pb-4 border-t border-dark/5 pt-3">
              <div className="flex gap-2">
                {SLEEP_OPTIONS.map(o=>(
                  <button key={o.value} onClick={()=>setSl(o.value===sl?"":o.value)}
                    className={`flex-1 px-3 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${sl===o.value?"bg-primary text-white shadow-sm":"bg-dark/5 text-text-secondary hover:bg-dark/10"}`}>
                    {o.label}</button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mood */}
        <div className="border-2 border-dark bg-white/40 overflow-hidden">
          <button onClick={()=>toggle("mood")} className="w-full p-4 flex items-center gap-3 text-left">
            <span className="text-xl">{moodType ? MOOD_OPTIONS.find(o=>o.value===moodType)?.emoji : "🧠"}</span>
            <div className="flex-1"><p className="text-sm font-extrabold text-dark">今日状态</p>
              <p className={`text-[11px] font-bold ${moodType?"text-primary":"text-text-muted"}`}>
                {moodType ? MOOD_OPTIONS.find(o=>o.value===moodType)?.label : "记录心情"}</p></div>
            <span className={`text-xs transition-transform ${expanded==="mood"?"rotate-180":""}`}>▼</span>
          </button>
          {expanded==="mood" && (
            <div className="px-4 pb-4 space-y-3 border-t border-dark/5 pt-3">
              <div className="flex gap-2 flex-wrap">
                {MOOD_OPTIONS.map(o=>(
                  <button key={o.value} onClick={()=>setMoodType(o.value===moodType?"":o.value)}
                    className={`px-3 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${moodType===o.value?"bg-primary text-white shadow-sm":"bg-dark/5 text-text-secondary hover:bg-dark/10"}`}>
                    {o.emoji} {o.label}</button>
                ))}
              </div>
              <input type="text" placeholder="心情备注（可选）..." value={moodNote}
                onChange={e=>setMoodNote(e.target.value)}
                className="w-full bg-base rounded-xl px-3 py-2 text-xs font-medium text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
            </div>
          )}
        </div>
      </div>

      {/* Weight */}
      <div className="border-2 border-dark bg-white/40 p-4 flex items-center gap-3">
        <span className="text-xl">⚖️</span>
        <input type="number" inputMode="decimal" step="0.1" placeholder="今日体重" value={w} onChange={e=>setW(e.target.value)}
          className="flex-1 bg-transparent text-lg font-black text-dark placeholder:text-text-muted focus:outline-none" />
        <span className="text-sm font-bold text-text-muted">kg</span>
      </div>

      {/* Note */}
      <div className="border-2 border-dark bg-white/40 p-4">
        <textarea placeholder="📝 今日总结（可选）" value={note} onChange={e=>setNote(e.target.value)} rows={2}
          className="w-full bg-transparent text-sm font-medium text-dark placeholder:text-text-muted focus:outline-none resize-none" />
      </div>

      {/* Submit */}
      <button onClick={submit} disabled={saving}
        className="w-full py-4 rounded-2xl bg-primary text-white font-extrabold text-base tracking-wide shadow-lg shadow-primary/20 hover:bg-primary-dark active:scale-[0.98] transition-all disabled:opacity-60">
        {saving?"保存中…":"⚡ 完成今日打卡"}
      </button>
    </div>
  );
}
