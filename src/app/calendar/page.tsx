"use client";

import { useRecords } from "@/hooks/useRecords";
import { TOTAL_DAYS } from "@/lib/constants";

export default function CalendarPage() {
  const { data, streakDays } = useRecords();

  const streak = streakDays();

  // Build a map: date -> completed
  const completedMap: Record<string, boolean> = {};
  for (const r of data.records) {
    completedMap[r.date] = r.completed;
  }

  // Build day list from startDate
  const days: { dayNum: number; date: string; completed: boolean }[] = [];
  if (data.startDate) {
    const start = new Date(data.startDate);
    for (let i = 0; i < TOTAL_DAYS; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      days.push({
        dayNum: i + 1,
        date: dateStr,
        completed: completedMap[dateStr] ?? false,
      });
    }
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="text-center space-y-1">
        <h1 className="text-lg font-bold text-text-primary">打卡日历</h1>
        <p className="text-sm text-text-muted">每一点都是坚持</p>
      </div>

      {/* Streak */}
      <div className="rounded-2xl bg-card-bg border border-border p-4 flex items-center justify-center gap-2">
        <span className="text-2xl">🔥</span>
        <span className="text-lg font-bold text-green-primary">
          连续 {streak} 天
        </span>
      </div>

      {/* 40-day grid */}
      {data.startDate ? (
        <div className="rounded-2xl bg-card-bg border border-border p-4">
          <div className="grid grid-cols-7 gap-2">
            {/* Day headers */}
            {["一", "二", "三", "四", "五", "六", "日"].map((d) => (
              <div
                key={d}
                className="text-center text-[10px] text-text-muted py-1"
              >
                {d}
              </div>
            ))}

            {/* Offset for first day */}
            {(() => {
              const firstDow = new Date(data.startDate).getDay(); // 0=Sun
              // Map to Mon=0
              const offset = firstDow === 0 ? 6 : firstDow - 1;
              return Array.from({ length: offset }).map((_, i) => (
                <div key={`pad-${i}`} />
              ));
            })()}

            {/* Days */}
            {days.map((day) => {
              const isToday =
                day.date === new Date().toISOString().slice(0, 10);
              return (
                <div
                  key={day.date}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-all ${
                    day.completed
                      ? "bg-green-pale"
                      : isToday
                        ? "bg-cream border border-green-primary"
                        : "bg-cream"
                  }`}
                >
                  <span
                    className={`text-[10px] ${
                      day.completed
                        ? "text-green-primary"
                        : isToday
                          ? "text-green-primary font-medium"
                          : "text-text-muted"
                    }`}
                  >
                    {day.dayNum}
                  </span>
                  <div
                    className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                      day.completed ? "bg-green-primary" : "bg-transparent"
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-text-muted">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-primary" />
              已完成
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-cream border border-border" />
              未完成
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-card-bg border border-border p-8 text-center">
          <p className="text-sm text-text-muted">
            记录第一天数据后，
            <br />
            日历将从此开始
          </p>
        </div>
      )}
    </div>
  );
}
