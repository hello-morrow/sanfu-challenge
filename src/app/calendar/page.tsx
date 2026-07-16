"use client";

import { useRecords } from "@/hooks/useRecords";
import { TOTAL_DAYS } from "@/lib/constants";

export default function CalendarPage() {
  const { data, streakDays } = useRecords();
  const streak = streakDays();

  const map: Record<string, boolean> = {};
  data.records.forEach(r => map[r.date] = r.completed);

  const days: { n: number; d: string; ok: boolean }[] = [];
  if (data.startDate) {
    const s = new Date(data.startDate);
    for (let i = 0; i < TOTAL_DAYS; i++) {
      const d = new Date(s); d.setDate(d.getDate() + i);
      const ds = d.toISOString().slice(0, 10);
      days.push({ n: i + 1, d: ds, ok: map[ds] ?? false });
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="text-center space-y-1 pt-2">
        <p className="text-[28px] font-black text-dark leading-tight">打卡日历</p>
        <p className="text-xs text-text-muted font-bold">每天一点，终成蜕变</p>
      </div>

      <div className="glass p-6 text-center space-y-1">
        <p className="text-4xl">🔥</p>
        <p className="text-5xl font-black text-primary">{streak}</p>
        <p className="text-xs font-extrabold text-text-secondary uppercase tracking-widest">连续打卡天数</p>
      </div>

      {data.startDate ? (
        <div className="glass p-5">
          <div className="grid grid-cols-7 gap-2">
            {["一","二","三","四","五","六","日"].map(d => <div key={d} className="text-center text-[10px] font-extrabold text-text-secondary py-1">{d}</div>)}
            {Array.from({ length: (() => { const fd = new Date(data.startDate).getDay(); return fd === 0 ? 6 : fd - 1; })() }).map((_, i) => <div key={`p-${i}`} />)}
            {days.map(day => {
              const isToday = day.d === today;
              return (
                <div key={day.d} className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs ${
                  day.ok ? "bg-primary text-white" : isToday ? "bg-base ring-2 ring-primary" : "bg-base/60"
                }`}>
                  <span className={`text-[11px] font-extrabold ${day.ok ? "text-white" : isToday ? "text-primary" : "text-text-muted"}`}>{day.n}</span>
                  <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${day.ok ? "bg-white" : "bg-transparent"}`} />
                </div>
              );
            })}
          </div>
          <div className="flex justify-center gap-4 mt-4 text-[10px] font-extrabold">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-primary" />已完成</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-dark/10" />未完成</span>
          </div>
        </div>
      ) : (
        <div className="glass p-8 text-center">
          <p className="text-sm text-text-muted font-bold">记录第一天数据后，<br/>日历将从此开始</p>
        </div>
      )}
    </div>
  );
}
