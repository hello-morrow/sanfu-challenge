import { EXERCISE_LIBRARY } from "@/lib/constants";

const aerobic = EXERCISE_LIBRARY.filter(e => e.category === "aerobic");
const anaerobic = EXERCISE_LIBRARY.filter(e => e.category === "anaerobic");

export default function TrainingPage() {
  return (
    <div className="space-y-5 animate-slide-up">
      <div className="text-center space-y-1 pt-2">
        <p className="text-[28px] font-black text-dark leading-tight">训练计划</p>
        <p className="text-xs text-text-muted font-bold">40 天蜕变训练营</p>
      </div>

      {/* Principles */}
      <div className="glass p-5 space-y-3">
        <h3 className="text-sm font-extrabold text-dark">🎯 训练原则</h3>
        <div className="space-y-2 text-sm font-medium text-text-secondary">
          <div className="flex items-start gap-2"><span className="text-primary font-extrabold">1.</span> 每周运动 5-6 天，休息 1-2 天</div>
          <div className="flex items-start gap-2"><span className="text-primary font-extrabold">2.</span> 有氧 + 无氧结合，先无氧后有氧</div>
          <div className="flex items-start gap-2"><span className="text-primary font-extrabold">3.</span> 每次训练 40-60 分钟</div>
          <div className="flex items-start gap-2"><span className="text-primary font-extrabold">4.</span> 运动前热身 5 分钟，运动后拉伸 10 分钟</div>
        </div>
      </div>

      {/* Aerobic */}
      <div className="glass p-5 space-y-3">
        <h3 className="text-sm font-extrabold text-dark">🏃 有氧训练</h3>
        <p className="text-xs text-text-secondary font-medium">燃脂 · 心肺 · 耐力</p>
        <div className="bg-base/60 rounded-xl p-3 grid grid-cols-2 gap-2">
          {aerobic.map(e => (
            <div key={e.label} className="flex items-center gap-1.5 text-xs font-bold text-dark">
              <span className="w-1.5 h-1.5 rounded-sm bg-primary" />{e.label}
              {e.distance && <span className="text-[10px] text-text-muted font-medium">{e.distance}km</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Anaerobic */}
      <div className="glass p-5 space-y-3">
        <h3 className="text-sm font-extrabold text-dark">💪 无氧训练</h3>
        <p className="text-xs text-text-secondary font-medium">塑形 · 力量 · 核心</p>
        <div className="bg-base/60 rounded-xl p-3 grid grid-cols-2 gap-2">
          {anaerobic.map(e => (
            <div key={e.label} className="flex items-center gap-1.5 text-xs font-bold text-dark">
              <span className="w-1.5 h-1.5 rounded-sm bg-primary" />{e.label}
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="glass p-5 space-y-3">
        <h3 className="text-sm font-extrabold text-dark">📅 每周参考安排</h3>
        <div className="divide-y divide-dark/5">
          {[
            {d:"周一",t:"跑步 3-5km + 核心训练",i:"moderate"},
            {d:"周二",t:"力量训练（深蹲/臀桥/哑铃）",i:"intense"},
            {d:"周三",t:"游泳/骑行/快走 + 拉伸",i:"light"},
            {d:"周四",t:"跑步 5-8km + 平板支撑",i:"intense"},
            {d:"周五",t:"力量训练（器械/卷腹/箭步蹲）",i:"intense"},
            {d:"周六",t:"尊巴/跳舞/瑜伽（趣味有氧）",i:"moderate"},
            {d:"周日",t:"休息 或 轻松快走",i:"light"},
          ].map(r=>(
            <div key={r.d} className="flex items-center gap-3 px-1 py-3">
              <span className="text-xs font-extrabold text-text-secondary w-8">{r.d}</span>
              <span className="text-xs font-bold text-dark flex-1">{r.t}</span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                r.i==="intense"?"bg-primary/10 text-primary":r.i==="moderate"?"bg-accent-light text-accent":"bg-dark/5 text-text-muted"
              }`}>
                {r.i==="intense"?"高强度":r.i==="moderate"?"适中":"轻松"}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass p-4">
        <p className="text-xs text-dark/50 font-medium leading-relaxed">⚠️ 以上为参考计划，请根据自身体能调整。运动前充分热身，运动后拉伸放松。如感不适请立即停止。</p>
      </div>
    </div>
  );
}
