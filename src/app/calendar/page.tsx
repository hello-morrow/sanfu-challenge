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
      days.push({ n: i + 1, d: d.toISOString().slice(0, 10), ok: map[d.toISOString().slice(0, 10)] ?? false });
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  const completed = days.filter(d => d.ok).length;

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="text-center space-y-2 pt-2">
        <p className="text-[28px] font-black text-dark leading-tight">打卡日历</p>
        <p className="text-xs text-text-muted font-bold">每天一点，终成蜕变</p>
      </div>

      {/* Streak + Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass p-5 text-center space-y-1">
          <p className="text-3xl mb-1">🔥</p>
          <p className="text-4xl font-black text-primary">{streak}</p>
          <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-widest">连续打卡</p>
        </div>
        <div className="glass p-5 text-center space-y-1">
          <p className="text-3xl mb-1">📊</p>
          <p className="text-4xl font-black text-dark">{completed}<span className="text-lg text-text-muted font-bold">/40</span></p>
          <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-widest">累计完成</p>
        </div>
      </div>

      {/* 40-day fire grid */}
      {data.startDate ? (
        <div className="glass p-5">
          <div className="flex flex-wrap gap-1.5 justify-center">
            {days.map(day => {
              const isToday = day.d === today;
              return (
                <div key={day.d}
                  className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center text-[9px] font-extrabold transition-all ${
                    day.ok
                      ? "bg-primary text-white shadow-sm"
                      : isToday
                        ? "bg-base ring-2 ring-primary text-primary"
                        : "bg-dark/5 text-text-muted"
                  }`}>
                  {day.ok ? "🔥" : day.n}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-5 text-[10px] font-extrabold">
            <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 rounded bg-primary text-white text-[9px]">🔥</span> 已完成</span>
            <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 rounded bg-dark/5 text-text-muted text-[9px]">12</span> 未完成</span>
          </div>
        </div>
      ) : (
        <div className="glass p-8 text-center">
          <p className="text-sm text-text-muted font-bold">记录第一天数据后，<br/>日历将从此开始</p>
        </div>
      )}

      {/* Bottom motivation */}
      {data.startDate && (
        <div className="text-center">
          <p className="text-xs text-text-muted font-medium">
            {completed >= 40 ? "🏆 全勤挑战完成！" :
             completed >= 30 ? "⚡ 最后冲刺！" :
             completed >= 20 ? "💪 坚持过半！" :
             completed >= 10 ? "🔥 渐入佳境" :
             "🌱 刚刚开始，继续加油"}
          </p>
        </div>
      )}
    </div>
  );
}
