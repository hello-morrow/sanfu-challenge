"use client";

import { useRecords } from "@/hooks/useRecords";

export default function ProgressPage() {
  const { data, weightChange, streakDays } = useRecords();

  // Filter records with weight data, sorted by date
  const weightRecords = data.records
    .filter((r) => r.weight !== null)
    .sort((a, b) => a.date.localeCompare(b.date));

  // Compute stats
  const totalKm = data.records.reduce((sum, r) => {
    if (!r.exercise?.distance) return sum;
    return sum + r.exercise.distance;
  }, 0);

  const totalTrainings = data.records.filter((r) => r.exercise).length;
  const streak = streakDays();

  const currentWeight = weightRecords.length > 0
    ? weightRecords[weightRecords.length - 1].weight
    : null;
  const startWeight = data.startWeight;
  const loss =
    startWeight !== null && currentWeight !== null
      ? currentWeight - startWeight
      : null;

  // SVG chart
  const chartW = 320;
  const chartH = 160;
  const padX = 20;
  const padY = 20;
  const plotW = chartW - padX * 2;
  const plotH = chartH - padY * 2;

  let polylinePoints = "";
  const weights = weightRecords.map((r) => r.weight as number);
  if (weights.length > 1) {
    const minW = Math.min(...weights);
    const maxW = Math.max(...weights);
    const range = maxW - minW || 1;

    const pts = weightRecords.map((r, i) => {
      const x = padX + (i / (weightRecords.length - 1)) * plotW;
      const y = padY + plotH - ((r.weight! - minW) / range) * plotH;
      return `${x},${y}`;
    });
    polylinePoints = pts.join(" ");
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="text-center space-y-1">
        <h1 className="text-lg font-bold text-text-primary">变化记录</h1>
        <p className="text-sm text-text-muted">看见每一天的改变</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard
          label="开始体重"
          value={startWeight ? `${startWeight} kg` : "--"}
        />
        <StatCard
          label="当前体重"
          value={currentWeight ? `${currentWeight} kg` : "--"}
        />
        <StatCard
          label="累计变化"
          value={
            loss !== null
              ? `${loss <= 0 ? "" : "+"}${loss.toFixed(1)} kg`
              : "--"
          }
          highlight={loss !== null && loss < 0}
        />
      </div>

      {/* Weight Chart */}
      <section className="rounded-2xl bg-card-bg border border-border p-4">
        <h3 className="text-sm font-medium text-text-primary mb-3">
          体重变化曲线
        </h3>
        {weightRecords.length < 2 ? (
          <div className="text-center py-10 text-sm text-text-muted">
            记录体重数据后将显示变化曲线
          </div>
        ) : (
          <div className="flex justify-center">
            <svg
              viewBox={`0 0 ${chartW} ${chartH}`}
              className="w-full max-w-[320px]"
            >
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
                const y = padY + plotH * frac;
                return (
                  <line
                    key={frac}
                    x1={padX}
                    x2={padX + plotW}
                    y1={y}
                    y2={y}
                    stroke="#E8E8E0"
                    strokeWidth="0.5"
                  />
                );
              })}
              {/* Polyline */}
              <polyline
                points={polylinePoints}
                fill="none"
                stroke="#7CB342"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Dots */}
              {weightRecords.map((r, i) => {
                const minW = Math.min(...weights);
                const maxW = Math.max(...weights);
                const range = maxW - minW || 1;
                const x =
                  padX + (i / (weightRecords.length - 1)) * plotW;
                const y =
                  padY + plotH - ((r.weight! - minW) / range) * plotH;
                return (
                  <circle
                    key={r.date}
                    cx={x}
                    cy={y}
                    r="3.5"
                    fill="#7CB342"
                  />
                );
              })}
              {/* Start/end labels */}
              {weightRecords.length > 0 && (
                <text
                  x={padX}
                  y={chartH - 2}
                  textAnchor="middle"
                  className="text-[9px]"
                  fill="#B0B0B0"
                >
                  {weightRecords[0].date.slice(5)}
                </text>
              )}
              {weightRecords.length > 1 && (
                <text
                  x={padX + plotW}
                  y={chartH - 2}
                  textAnchor="middle"
                  className="text-[9px]"
                  fill="#B0B0B0"
                >
                  {weightRecords[weightRecords.length - 1].date.slice(5)}
                </text>
              )}
            </svg>
          </div>
        )}
      </section>

      {/* Cumulative Stats */}
      <section className="rounded-2xl bg-card-bg border border-border p-4 space-y-3">
        <h3 className="text-sm font-medium text-text-primary">累计统计</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-cream rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-green-primary">
              {totalKm}
            </div>
            <div className="text-xs text-text-muted mt-0.5">累计跑步 (km)</div>
          </div>
          <div className="bg-cream rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-green-primary">
              {totalTrainings}
            </div>
            <div className="text-xs text-text-muted mt-0.5">训练次数</div>
          </div>
          <div className="bg-cream rounded-xl p-3 text-center col-span-2">
            <div className="text-2xl font-bold text-green-primary">
              🔥 {streak} 天
            </div>
            <div className="text-xs text-text-muted mt-0.5">连续打卡</div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl bg-card-bg border border-border p-3 text-center">
      <div className="text-[10px] text-text-muted mb-1">{label}</div>
      <div
        className={`text-sm font-bold ${
          highlight ? "text-green-primary" : "text-text-primary"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
