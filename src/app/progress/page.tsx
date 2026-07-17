"use client";

import { useRecords } from "@/hooks/useRecords";
import { MEASUREMENT_LABELS } from "@/lib/constants";
import { exportCSV, exportJSON, downloadFile } from "@/lib/export";
import type { BodyMeasurements } from "@/lib/types";

export default function ProgressPage() {
  const { data, streakDays } = useRecords();
  const wRecs = data.records.filter(r => r.weight !== null).sort((a,b) => a.date.localeCompare(b.date));
  const totalKm = data.records.reduce((s,r) => s + r.exercise.reduce((ss,e) => ss + (e.distance ?? 0), 0), 0);
  const totalTrainings = data.records.filter(r => r.exercise.length > 0).length;
  const totalDuration = data.records.reduce((s,r) => s + r.exercise.reduce((ss,e) => ss + e.duration, 0), 0);
  const streak = streakDays();

  const curW = wRecs.length > 0 ? wRecs[wRecs.length - 1].weight : null;
  const loss = data.startWeight !== null && curW !== null ? curW - data.startWeight : null;

  // Latest measurements
  const latestMeas = data.records.filter(r => r.measurements).pop()?.measurements ?? null;

  // Exercise by category
  const aerobicCount = data.records.reduce((s,r) => s + r.exercise.filter(e => e.category === "aerobic").length, 0);
  const anaerobicCount = data.records.reduce((s,r) => s + r.exercise.filter(e => e.category === "anaerobic").length, 0);

  // Chart
  const W=320,H=160,PX=24,PY=24,PW=W-PX*2,PH=H-PY*2;
  const wvals = wRecs.map(r=>r.weight as number);
  let pts="";
  if(wvals.length>1){const min=Math.min(...wvals),max=Math.max(...wvals),range=max-min||1;pts=wRecs.map((r,i)=>`${PX+(i/(wRecs.length-1))*PW},${PY+PH-((r.weight!-min)/range)*PH}`).join(" ");}

  const handleExportCSV = () => { const csv = exportCSV(data); downloadFile(csv, `sanfu-${data.startDate||"data"}.csv`, "text/csv;charset=utf-8"); };
  const handleExportJSON = () => { const json = exportJSON(data); downloadFile(json, `sanfu-${data.startDate||"data"}.json`, "application/json"); };

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="text-center space-y-1 pt-2">
        <p className="text-[28px] font-black text-dark leading-tight">我的蜕变</p>
        <p className="text-xs text-text-muted font-bold">看见每一天的改变</p>
      </div>

      {/* Weight Stats */}
      <div className="grid grid-cols-3 gap-2">
        <SCard label="开始" value={data.startWeight?`${data.startWeight}`:"--"} unit="kg" />
        <SCard label="当前" value={curW?`${curW}`:"--"} unit="kg" />
        <SCard label="变化" value={loss!==null?`${loss<=0?"":"+"}${loss.toFixed(1)}`:"--"} unit="kg" hi={loss!==null&&loss<0} />
      </div>

      {/* Weight Chart */}
      {wvals.length >= 2 && (
        <div className="glass p-5 space-y-3">
          <h3 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest">体重趋势</h3>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[320px] mx-auto">
            {[0,0.25,0.5,0.75,1].map(f=><line key={f} x1={PX} x2={PX+PW} y1={PY+PH*f} y2={PY+PH*f} stroke="#E8E0D4" strokeWidth="0.5"/>)}
            <polyline points={pts} fill="none" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            {wRecs.map((r,i)=>{const min=Math.min(...wvals),max=Math.max(...wvals),range=max-min||1;return <circle key={r.date} cx={PX+(i/(wRecs.length-1))*PW} cy={PY+PH-((r.weight!-min)/range)*PH} r="4" fill="#FF6B35"/>;})}
            {wRecs.length>0&&<text x={PX} y={H-4} textAnchor="middle" fontSize="9" fill="#9A9A9A" fontWeight="bold">{wRecs[0].date.slice(5)}</text>}
            {wRecs.length>1&&<text x={PX+PW} y={H-4} textAnchor="middle" fontSize="9" fill="#9A9A9A" fontWeight="bold">{wRecs[wRecs.length-1].date.slice(5)}</text>}
          </svg>
        </div>
      )}

      {/* Measurements */}
      <div className="glass p-5 space-y-3">
        <h3 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest">围度变化</h3>
        {latestMeas ? (
          <div className="grid grid-cols-3 gap-2">
            {MEASUREMENT_LABELS.map(m => (
              <div key={m.key} className="bg-base/60 rounded-xl p-3 text-center">
                <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider">{m.label}</p>
                <p className="text-lg font-black text-dark mt-0.5">
                  {latestMeas[m.key] !== null
                    ? `${latestMeas[m.key]}`
                    : "--"}
                  <span className="text-[10px] font-normal text-text-muted ml-0.5">
                    {latestMeas[m.key] !== null ? "cm" : ""}
                  </span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-muted font-medium text-center py-4">记录身体围度后将在此显示</p>
        )}
      </div>

      {/* Exercise Stats */}
      <div className="glass p-5 space-y-3">
        <h3 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest">运动统计</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-base/60 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-dark">{totalKm}</p>
            <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider mt-0.5">累计里程 (km)</p>
          </div>
          <div className="bg-base/60 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-dark">{totalDuration}</p>
            <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider mt-0.5">累计时长 (min)</p>
          </div>
          <div className="bg-base/60 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-primary">{aerobicCount}</p>
            <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider mt-0.5">有氧次数</p>
          </div>
          <div className="bg-base/60 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-primary">{anaerobicCount}</p>
            <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider mt-0.5">无氧次数</p>
          </div>
          <div className="bg-base/60 rounded-xl p-3 text-center col-span-2">
            <p className="text-2xl font-black text-primary">🔥 {streak}</p>
            <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider mt-0.5">连续打卡天数</p>
          </div>
        </div>
      </div>

      {/* Export */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={handleExportCSV}
          className="glass p-4 text-center font-extrabold text-sm text-dark hover:ring-2 hover:ring-primary/30 transition-all active:scale-95">
          📊 导出 CSV
        </button>
        <button onClick={handleExportJSON}
          className="glass p-4 text-center font-extrabold text-sm text-dark hover:ring-2 hover:ring-primary/30 transition-all active:scale-95">
          📦 导出 JSON
        </button>
      </div>

      <p className="text-center text-[10px] text-text-muted font-medium pb-4">
        CSV 可用 Excel/WPS 打开 · JSON 可用于备份恢复
      </p>
    </div>
  );
}

function SCard({label,value,unit,hi}:{label:string;value:string;unit:string;hi?:boolean}) {
  return (
    <div className="glass p-3 text-center space-y-0.5">
      <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider">{label}</p>
      <p className={`text-lg font-black ${hi?"text-primary":"text-dark"}`}>
        {value}<span className="text-[10px] font-normal text-text-muted ml-0.5">{unit}</span>
      </p>
    </div>
  );
}
