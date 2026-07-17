"use client";

import { useRecords } from "@/hooks/useRecords";
import { TOTAL_DAYS, BASE_STAGES } from "@/lib/constants";

export default function CalendarPage() {
  const { data, streakDays, currentDay } = useRecords();
  const streak = streakDays();
  const today = currentDay();

  const map: Record<string, boolean> = {};
  data.records.forEach(r => map[r.date] = r.completed);

  const days: { n: number; ok: boolean }[] = [];
  if (data.startDate) {
    const s = new Date(data.startDate);
    for (let i = 0; i < TOTAL_DAYS; i++) {
      const d = new Date(s); d.setDate(d.getDate() + i);
      days.push({ n: i + 1, ok: map[d.toISOString().slice(0, 10)] ?? false });
    }
  }

  const completed = days.filter(d => d.ok).length;

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="text-center space-y-1 pt-2">
        <p className="text-2xl font-black text-dark pixel-text">生存路线</p>
        <p className="text-xs text-text-muted font-bold">40天挑战轨迹</p>
      </div>

      {/* Start + Progress */}
      <div className="pixel-card p-5 text-center space-y-2">
        <div className="text-3xl">🗺️</div>
        <p className="text-sm font-extrabold text-dark pixel-text">{completed}/40 节点已点亮</p>
        <p className="text-xs text-text-muted font-medium">连续挑战 🔥 {streak} 天</p>
        <div className="w-full h-1.5 bg-dark/5 overflow-hidden">
          <div className="h-full transition-all duration-700" style={{width:`${(completed/40)*100}%`,background:"linear-gradient(90deg,#FF6B35,#FFB703)"}} />
        </div>
      </div>

      {/* Timeline */}
      {data.startDate && (
        <div className="pixel-card p-5">
          <div className="relative pl-6 border-l-2 border-primary/30 space-y-4">
            {/* START */}
            <div className="relative">
              <div className="absolute -left-[31px] w-6 h-6 rounded bg-primary text-white flex items-center justify-center text-[10px] font-black">S</div>
              <div>
                <p className="text-xs font-extrabold text-primary pixel-text">START</p>
                <p className="text-[10px] text-text-muted font-medium">Day 1 · 挑战开始</p>
              </div>
            </div>

            {/* Milestones */}
            {BASE_STAGES.filter(b => b.fromDay > 1).map(stage => {
              const reached = today >= stage.fromDay;
              return (
                <div key={stage.stage} className="relative">
                  <div className={`absolute -left-[31px] w-6 h-6 rounded flex items-center justify-center text-[10px] font-black ${reached ? "bg-primary text-white" : "bg-dark/10 text-text-muted"}`}>
                    {reached ? "★" : stage.fromDay}
                  </div>
                  <div>
                    <p className={`text-xs font-extrabold pixel-text ${reached ? "text-dark" : "text-text-muted"}`}>
                      {stage.name}
                    </p>
                    <p className="text-[10px] text-text-muted font-medium">
                      Day {stage.fromDay} · {stage.emoji} {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* FINISH */}
            <div className="relative">
              <div className={`absolute -left-[31px] w-6 h-6 rounded flex items-center justify-center text-[10px] font-black ${today >= 40 ? "bg-primary text-white" : "bg-dark/10 text-text-muted"}`}>
                {today >= 40 ? "🏆" : "40"}
              </div>
              <div>
                <p className={`text-xs font-extrabold pixel-text ${today >= 40 ? "text-primary" : "text-text-muted"}`}>
                  FINISH
                </p>
                <p className="text-[10px] text-text-muted font-medium">Day 40 · 最终挑战</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!data.startDate && (
        <div className="pixel-card p-8 text-center">
          <p className="text-sm text-text-muted font-bold pixel-text">记录第一天数据后<br/>生存路线将开启</p>
        </div>
      )}
    </div>
  );
}
