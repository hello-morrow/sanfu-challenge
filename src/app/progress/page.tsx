"use client";

import { useRecords } from "@/hooks/useRecords";

export default function ProgressPage() {
  const { data, streakDays } = useRecords();

  const weightRecords = data.records
    .filter((r) => r.weight !== null)
    .sort((a, b) => a.date.localeCompare(b.date));

  const totalKm = data.records.reduce((sum, r) => sum + (r.exercise?.distance ?? 0), 0);
  const totalTrainings = data.records.filter((r) => r.exercise).length;
  const streak = streakDays();

  const currentWeight = weightRecords.length > 0 ? weightRecords[weightRecords.length - 1].weight : null;
  const startWeight = data.startWeight;
  const loss = startWeight !== null && currentWeight !== null ? currentWeight - startWeight : null;

  // SVG chart
  const W = 320, H = 160, PX = 24, PY = 24;
  const PW = W - PX * 2, PH = H - PY * 2;

  let polyline = "";
  const wvals = weightRecords.map((r) => r.weight as number);
  if (wvals.length > 1) {
    const min = Math.min(...wvals), max = Math.max(...wvals), range = max - min || 1;
    polyline = weightRecords.map((r, i) => {
      const x = PX + (i / (weightRecords.length - 1)) * PW;
      const y = PY + PH - ((r.weight! - min) / range) * PH;
      return `${x},${y}`;
    }).join(" ");
  }

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-dark text-white px-4 py-1.5 rounded-full">
          <span className="text-lg">📈</span>
          <span className="text-xs font-bold tracking-widest">变化记录</span>
        </div>
        <p className="text-xs text-text-muted font-medium">看见蜕变</p>
      </div>

      {/* Big Stats */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard label="开始" value={startWeight ? `${startWeight}` : "--"} unit="kg" />
        <StatCard label="当前" value={currentWeight ? `${currentWeight}` : "--"} unit="kg" />
        <StatCard label="变化"
          value={loss !== null ? `${loss <= 0 ? "" : "+"}${loss.toFixed(1)}` : "--"}
          unit="kg" highlight={loss !== null && loss < 0} />
      </div>

      {/* Chart */}
      <section className="rounded-2xl bg-card-bg border-2 border-dark/5 p-5">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4">
          体重曲线
        </h3>
        {wvals.length < 2 ? (
          <div className="text-center py-8 text-sm text-text-muted font-medium">记录体重数据后将显示变化曲线</div>
        ) : (
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[320px] mx-auto block">
            {[0, 0.25, 0.5, 0.75, 1].map((f) => (
              <line key={f} x1={PX} x2={PX + PW} y1={PY + PH * f} y2={PY + PH * f} stroke="#E8E0D4" strokeWidth="0.5" />
            ))}
            <polyline points={polyline} fill="none" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {weightRecords.map((r, i) => {
              const min = Math.min(...wvals), max = Math.max(...wvals), range = max - min || 1;
              return (
                <circle key={r.date} cx={PX + (i / (weightRecords.length - 1)) * PW}
                  cy={PY + PH - ((r.weight! - min) / range) * PH} r="4" fill="#FF6B35" />
              );
            })}
            {weightRecords.length > 0 && (
              <text x={PX} y={H - 4} textAnchor="middle" className="text-[9px]" fill="#9A9A9A" fontWeight="bold">
                {weightRecords[0].date.slice(5)}
              </text>
            )}
            {weightRecords.length > 1 && (
              <text x={PX + PW} y={H - 4} textAnchor="middle" className="text-[9px]" fill="#9A9A9A" fontWeight="bold">
                {weightRecords[weightRecords.length - 1].date.slice(5)}
              </text>
            )}
          </svg>
        )}
      </section>

      {/* Cumulative */}
      <section className="rounded-2xl bg-card-bg border-2 border-dark/5 p-5 space-y-4">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">累计统计</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-base rounded-xl p-4 text-center">
            <div className="text-3xl font-black text-dark">{totalKm}</div>
            <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mt-1">累计跑步 (km)</div>
          </div>
          <div className="bg-base rounded-xl p-4 text-center">
            <div className="text-3xl font-black text-dark">{totalTrainings}</div>
            <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mt-1">训练次数</div>
          </div>
          <div className="bg-base rounded-xl p-4 text-center col-span-2">
            <div className="text-3xl font-black text-primary">🔥 {streak}</div>
            <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mt-1">连续打卡天数</div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, unit, highlight }: { label: string; value: string; unit: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl bg-card-bg border-2 border-dark/5 p-3 text-center">
      <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-lg font-black ${highlight ? "text-primary" : "text-dark"}`}>
        {value}<span className="text-[10px] font-normal text-text-muted ml-0.5">{unit}</span>
      </div>
    </div>
  );
}
