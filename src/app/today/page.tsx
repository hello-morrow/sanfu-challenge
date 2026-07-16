"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRecords } from "@/hooks/useRecords";
import type { DailyRecord } from "@/lib/types";
import {
  WATER_STEP, WATER_GOAL, BREAKFAST_TAGS, LUNCH_TAGS, DINNER_TAGS,
  EXERCISE_OPTIONS, EXERCISE_MAP, SLEEP_OPTIONS,
} from "@/lib/constants";
import WaterDroplet from "@/components/WaterDroplet";
import QuickTag from "@/components/QuickTag";

function empty(d: string): DailyRecord {
  return { date: d, weight: null, water: 0, breakfast: "", lunch: "", dinner: "", exercise: null, sleep: null, completed: false };
}

export default function TodayPage() {
  const router = useRouter();
  const { data, today, todayRecord, saveRecord, setStartInfo } = useRecords();
  const [r, setR] = useState<DailyRecord>(todayRecord ?? empty(today));
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (todayRecord) setR(todayRecord); }, [todayRecord]);

  const [w, setW] = useState(r.weight?.toString() ?? "");
  const [bf, setBf] = useState(r.breakfast); const [lu, setLu] = useState(r.lunch); const [di, setDi] = useState(r.dinner);
  const [ex, setEx] = useState(r.exercise?.type ? EXERCISE_OPTIONS.find(o => EXERCISE_MAP[o].type === r.exercise!.type) ?? "" : "");
  const [exMin, setExMin] = useState(r.exercise?.minutes?.toString() ?? "");
  const [sl, setSl] = useState(r.sleep ?? "");
  const [note, setNote] = useState(r.note ?? "");

  const upd = (p: Partial<DailyRecord>) => setR((prev) => ({ ...prev, ...p }));

  const submit = () => {
    setSaving(true);
    if (!data.startDate) { const wv = parseFloat(w); if (!isNaN(wv) && wv > 0) setStartInfo(today, wv, null); }
    saveRecord({
      ...r, weight: w ? parseFloat(w) : null, breakfast: bf, lunch: lu, dinner: di,
      exercise: ex ? { type: EXERCISE_MAP[ex].type, distance: EXERCISE_MAP[ex].distance, minutes: parseInt(exMin) || 0 } : null,
      note: note.trim() || undefined, sleep: (sl as DailyRecord["sleep"]) || null, completed: true,
    });
    setTimeout(() => { setSaving(false); router.push("/"); }, 300);
  };

  const sections = [
    { id: "w", label: "体重", done: !!w },
    { id: "wa", label: "饮水", done: r.water >= WATER_GOAL },
    { id: "f", label: "饮食", done: !!(bf || lu || di) },
    { id: "e", label: "运动", done: !!ex },
    { id: "s", label: "睡眠", done: !!sl },
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
          <span className="text-2xl font-black text-primary">{dn}<span className="text-sm text-text-muted font-bold">/5</span></span>
        </div>
        <div className="w-full h-2 rounded-full bg-dark/5 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${(dn/5)*100}%`, background: "linear-gradient(90deg, #FF6B35, #FFB703)" }} />
        </div>
      </div>

      {[{ t: "⚖️ 体重记录", c: (
        <div className="flex items-center gap-2">
          <input type="number" inputMode="decimal" step="0.1" placeholder="输入今日体重" value={w}
            onChange={(e) => setW(e.target.value)}
            className="flex-1 bg-base rounded-xl px-4 py-3.5 text-lg font-black text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
          <span className="text-sm font-bold text-text-secondary">KG</span>
        </div>
      )}, { t: "💧 饮水记录", c: (
        <WaterDroplet water={r.water} onAdd={() => upd({ water: Math.min(r.water + WATER_STEP, WATER_GOAL) })} />
      )}, { t: "🥗 饮食记录", c: (
        <div className="space-y-4">
          {(["早餐","午餐","晚餐"] as const).map((m) => {
            const tags = m === "早餐" ? BREAKFAST_TAGS : m === "午餐" ? LUNCH_TAGS : DINNER_TAGS;
            const val = m === "早餐" ? bf : m === "午餐" ? lu : di;
            const sv = m === "早餐" ? setBf : m === "午餐" ? setLu : setDi;
            return (
              <div key={m} className="space-y-2">
                <label className="text-xs font-extrabold text-text-secondary uppercase tracking-wider">{m}</label>
                <QuickTag tags={tags} selected={val} onSelect={(t) => sv(t === val ? "" : t)} />
                <input type="text" placeholder="自定义输入..." value={val} onChange={(e) => sv(e.target.value)}
                  className="w-full bg-base rounded-xl px-4 py-3 text-sm font-bold text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
              </div>
            );
          })}
        </div>
      )}, { t: "🏃 运动记录", c: (
        <div className="space-y-3">
          <QuickTag tags={EXERCISE_OPTIONS} selected={ex} onSelect={(t) => setEx(t === ex ? "" : t)} />
          {ex && (
            <div className="flex items-center gap-2">
              <input type="number" inputMode="numeric" placeholder="运动时长" value={exMin} onChange={(e) => setExMin(e.target.value)}
                className="flex-1 bg-base rounded-xl px-4 py-3 text-sm font-bold text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
              <span className="text-sm font-bold text-text-secondary">分钟</span>
            </div>
          )}
        </div>
      )}, { t: "😴 睡眠记录", c: (
        <div className="flex gap-2">
          {SLEEP_OPTIONS.map((o) => (
            <button key={o.value} onClick={() => setSl(o.value === sl ? "" : o.value)}
              className={`flex-1 px-3 py-3.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                sl === o.value ? "bg-primary text-white shadow-sm" : "bg-dark/5 text-text-secondary hover:bg-dark/10"
              }`}>{o.label}</button>
          ))}
        </div>
      )}, { t: "📝 今日备注", c: (
        <textarea placeholder="今天聚餐 / 状态不好 / 暴食了..." value={note} onChange={(e) => setNote(e.target.value)} rows={2}
          className="w-full bg-base rounded-xl px-4 py-3 text-sm font-medium text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none" />
      )}].map((sec, i) => (
        <section key={i} className="glass p-4 space-y-3">
          <h3 className="text-sm font-extrabold text-dark">{sec.t}</h3>
          {sec.c}
        </section>
      ))}

      <button onClick={submit} disabled={saving}
        className="w-full py-4 rounded-2xl bg-primary text-white font-extrabold text-base tracking-wide shadow-lg shadow-primary/20 hover:bg-primary-dark active:scale-[0.98] transition-all disabled:opacity-60">
        {saving ? "保存中…" : "⚡ 完成今日打卡"}
      </button>
    </div>
  );
}
