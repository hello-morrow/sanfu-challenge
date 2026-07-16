"use client";

import { useRecords } from "@/hooks/useRecords";
import { TOTAL_DAYS } from "@/lib/constants";

export default function CalendarPage() {
  const { data, streakDays } = useRecords();
  const streak = streakDays();

  const completedMap: Record<string, boolean> = {};
  for (const r of data.records) completedMap[r.date] = r.completed;

  const days: { dayNum: number; date: string; completed: boolean }[] = [];
  if (data.startDate) {
    const start = new Date(data.startDate);
    for (let i = 0; i < TOTAL_DAYS; i++) {
      const d = new Date(start); d.setDate(d.getDate() + i);
      days.push({ dayNum: i + 1, date: d.toISOString().slice(0, 10), completed: completedMap[d.toISOString().slice(0, 10)] ?? false });
    }
  }

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-dark text-white px-4 py-1.5 rounded-full">
          <span className="text-lg">📅</span>
          <span className="text-xs font-bold tracking-widest">打卡日历</span>
        </div>
        <p className="text-xs text-text-muted font-medium">每天一点，终成蜕变</p>
      </div>

      {/* Streak */}
      <div className="rounded-2xl bg-dark p-5 text-center">
        <p className="text-4xl mb-1">🔥</p>
        <p className="text-3xl font-black text-white">{streak}</p>
        <p className="text-xs font-bold text-white/50 uppercase tracking-widest mt-1">连续打卡天数</p>
      </div>

      {data.startDate ? (
        <div className="rounded-2xl bg-card-bg border-2 border-dark/5 p-5">
          <div className="grid grid-cols-7 gap-2">
            {["一","二","三","四","五","六","日"].map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-text-secondary py-1">{d}</div>
            ))}
            {(() => {
              const firstDow = new Date(data.startDate).getDay();
              const offset = firstDow === 0 ? 6 : firstDow - 1;
              return Array.from({ length: offset }).map((_, i) => <div key={`pad-${i}`} />);
            })()}
            {days.map((day) => {
              const isToday = day.date === todayStr;
              return (
                <div key={day.date}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs transition-all ${
                    day.completed
                      ? "bg-primary text-white"
                      : isToday
                        ? "bg-base border-2 border-primary"
                        : "bg-base"
                  }`}>
                  <span className={`text-[11px] font-extrabold ${day.completed ? "text-white" : isToday ? "text-primary" : "text-text-muted"}`}>
                    {day.dayNum}
                  </span>
                  <div className={`w-2 h-2 rounded-full mt-0.5 ${day.completed ? "bg-white" : "bg-transparent"}`} />
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-4 mt-5 text-[10px] font-bold">
            <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-primary" /> 已完成</div>
            <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-base border border-dark/10" /> 未完成</div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-card-bg border-2 border-dark/5 p-8 text-center">
          <p className="text-sm text-text-muted font-medium">记录第一天数据后，<br/>日历将从此开始</p>
        </div>
      )}
    </div>
  );
}
