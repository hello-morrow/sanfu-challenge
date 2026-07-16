export default function TrainingPage() {
  return (
    <div className="space-y-5 animate-slide-up">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-dark text-white px-4 py-1.5 rounded-full">
          <span className="text-lg">📋</span>
          <span className="text-xs font-bold tracking-widest">训练规则</span>
        </div>
        <p className="text-xs text-text-muted font-medium">40 天蜕变计划</p>
      </div>

      {/* Running */}
      <section className="rounded-2xl bg-card-bg border-2 border-dark/5 p-5 space-y-4">
        <h3 className="text-sm font-extrabold text-dark flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full" />
          跑步训练
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-base rounded-xl px-4 py-3">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">频率</span>
            <span className="text-sm font-extrabold text-dark">每周 4-5 次</span>
          </div>
          <div className="bg-base rounded-xl p-4 space-y-3">
            {[{ label: "最低标准", value: "3 公里", accent: false },
              { label: "标准", value: "5 公里", accent: false },
              { label: "挑战", value: "8 公里", accent: true },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center">
                <span className="text-xs text-text-secondary">{row.label}</span>
                <span className={`text-sm font-extrabold ${row.accent ? "text-primary" : "text-dark"}`}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strength */}
      <section className="rounded-2xl bg-card-bg border-2 border-dark/5 p-5 space-y-4">
        <h3 className="text-sm font-extrabold text-dark flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full" />
          力量训练
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-base rounded-xl px-4 py-3">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">频率</span>
            <span className="text-sm font-extrabold text-dark">每周 2-3 次</span>
          </div>
          <div className="bg-base rounded-xl p-4">
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-3">训练动作</p>
            <div className="grid grid-cols-2 gap-2">
              {["深蹲", "臀桥", "箭步蹲", "平板支撑", "卷腹"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm font-bold text-dark">
                  <span className="w-1.5 h-1.5 rounded-sm bg-primary" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Schedule */}
      <section className="rounded-2xl bg-card-bg border-2 border-dark/5 p-5 space-y-4">
        <h3 className="text-sm font-extrabold text-dark flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full" />
          每周参考
        </h3>
        <div className="bg-base rounded-xl divide-y divide-dark/5">
          {[
            { day: "周一", task: "跑步 3-5km" },
            { day: "周二", task: "力量训练 + 拉伸" },
            { day: "周三", task: "跑步 3-5km" },
            { day: "周四", task: "力量训练" },
            { day: "周五", task: "跑步 5-8km" },
            { day: "周六", task: "休息或轻松跑" },
            { day: "周日", task: "力量训练或休息" },
          ].map((row) => (
            <div key={row.day} className="flex justify-between px-4 py-3">
              <span className="text-xs font-bold text-text-secondary">{row.day}</span>
              <span className="text-xs font-extrabold text-dark">{row.task}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Warning */}
      <div className="rounded-2xl bg-accent-light border-2 border-accent/20 p-4">
        <p className="text-xs text-dark/60 leading-relaxed font-medium">
          ⚠️ 以上为参考计划，请根据自身情况调整。运动前热身，运动后拉伸。不适请立即停止。
        </p>
      </div>
    </div>
  );
}
