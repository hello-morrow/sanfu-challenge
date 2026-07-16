"use client";

import { useRecords } from "@/hooks/useRecords";

export default function ProgressPage() {
  const { data, streakDays } = useRecords();
  const wRecs = data.records.filter(r => r.weight !== null).sort((a, b) => a.date.localeCompare(b.date));
  const totalKm = data.records.reduce((s, r) => s + (r.exercise?.distance ?? 0), 0);
  const totalTrainings = data.records.filter(r => r.exercise).length;
  const streak = streakDays();
  const curW = wRecs.length > 0 ? wRecs[wRecs.length - 1].weight : null;
  const loss = data.startWeight !== null && curW !== null ? curW - data.startWeight : null;

  // Chart
  const W = 320, H = 160, PX = 24, PY = 24, PW = W - PX * 2, PH = H - PY * 2;
  const wvals = wRecs.map(r => r.weight as number);
  let pts = "";
  if (wvals.length > 1) {
    const min = Math.min(...wvals), max = Math.max(...wvals), range = max - min || 1;
    pts = wRecs.map((r, i) => `${PX + (i/(wRecs.length-1))*PW},${PY+PH-((r.weight!-min)/range)*PH}`).join(" ");
  }

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="text-center space-y-1 pt-2">
        <p className="text-[28px] font-black text-dark leading-tight">变化记录</p>
        <p className="text-xs text-text-muted font-bold">看见蜕变</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <SCard label="开始" value={data.startWeight ? `${data.startWeight}` : "--"} unit="kg" />
        <SCard label="当前" value={curW ? `${curW}` : "--"} unit="kg" />
        <SCard label="变化" value={loss !== null ? `${loss <= 0 ? "" : "+"}${loss.toFixed(1)}` : "--"} unit="kg" hi={loss !== null && loss < 0} />
      </div>

      <div className="glass p-5 space-y-3">
        <h3 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest">体重曲线</h3>
        {wvals.length < 2 ? (
          <div className="text-center py-8 text-sm text-text-muted font-bold">记录体重后将显示曲线</div>
        ) : (
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[320px] mx-auto">
            {[0,0.25,0.5,0.75,1].map(f => <line key={f} x1={PX} x2={PX+PW} y1={PY+PH*f} y2={PY+PH*f} stroke="#E8E0D4" strokeWidth="0.5" />)}
            <polyline points={pts} fill="none" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {wRecs.map((r,i) => { const min=Math.min(...wvals),max=Math.max(...wvals),range=max-min||1; return <circle key={r.date} cx={PX+(i/(wRecs.length-1))*PW} cy={PY+PH-((r.weight!-min)/range)*PH} r="4" fill="#FF6B35" />; })}
            {wRecs.length>0 && <text x={PX} y={H-4} textAnchor="middle" fontSize="9" fill="#9A9A9A" fontWeight="bold">{wRecs[0].date.slice(5)}</text>}
            {wRecs.length>1 && <text x={PX+PW} y={H-4} textAnchor="middle" fontSize="9" fill="#9A9A9A" fontWeight="bold">{wRecs[wRecs.length-1].date.slice(5)}</text>}
          </svg>
        )}
      </div>

      <div className="glass p-5 space-y-3">
        <h3 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest">累计统计</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-base/60 rounded-xl p-4 text-center">
            <div className="text-3xl font-black text-dark">{totalKm}</div>
            <div className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider mt-1">累计跑步 (km)</div>
          </div>
          <div className="bg-base/60 rounded-xl p-4 text-center">
            <div className="text-3xl font-black text-dark">{totalTrainings}</div>
            <div className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider mt-1">训练次数</div>
          </div>
          <div className="bg-base/60 rounded-xl p-4 text-center col-span-2">
            <div className="text-3xl font-black text-primary">🔥 {streak}</div>
            <div className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider mt-1">连续打卡天数</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SCard({ label, value, unit, hi }: { label: string; value: string; unit: string; hi?: boolean }) {
  return (
    <div className="glass p-3 text-center space-y-0.5">
      <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider">{label}</p>
      <p className={`text-lg font-black ${hi ? "text-primary" : "text-dark"}`}>
        {value}<span className="text-[10px] font-normal text-text-muted ml-0.5">{unit}</span>
      </p>
    </div>
  );
}
