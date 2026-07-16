export default function TrainingPage() {
  return (
    <div className="space-y-6 animate-in">
      <div className="text-center space-y-1">
        <h1 className="text-lg font-bold text-text-primary">40天运动规则</h1>
        <p className="text-sm text-text-muted">坚持就是胜利</p>
      </div>

      {/* Running */}
      <section className="rounded-2xl bg-card-bg border border-border p-4 space-y-3">
        <h3 className="text-sm font-medium text-text-primary flex items-center gap-1.5">
          🏃 跑步训练
        </h3>
        <div className="space-y-2 text-sm text-text-secondary">
          <p>
            <span className="font-medium text-text-primary">频率：</span>
            每周 4-5 次
          </p>
          <div className="bg-cream rounded-xl p-3 space-y-2">
            <div className="flex justify-between">
              <span>最低标准</span>
              <span className="font-medium text-text-primary">3 公里</span>
            </div>
            <div className="flex justify-between">
              <span>标准</span>
              <span className="font-medium text-text-primary">5 公里</span>
            </div>
            <div className="flex justify-between">
              <span>挑战</span>
              <span className="font-medium text-green-primary">8 公里</span>
            </div>
          </div>
        </div>
      </section>

      {/* Strength Training */}
      <section className="rounded-2xl bg-card-bg border border-border p-4 space-y-3">
        <h3 className="text-sm font-medium text-text-primary flex items-center gap-1.5">
          💪 力量训练
        </h3>
        <div className="space-y-2 text-sm text-text-secondary">
          <p>
            <span className="font-medium text-text-primary">频率：</span>
            每周 2-3 次
          </p>
          <div className="bg-cream rounded-xl p-3">
            <p className="text-xs text-text-muted mb-2">训练动作：</p>
            <div className="grid grid-cols-2 gap-2">
              {["深蹲", "臀桥", "箭步蹲", "平板支撑", "卷腹"].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-1.5 text-text-primary"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-primary" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Schedule */}
      <section className="rounded-2xl bg-card-bg border border-border p-4 space-y-3">
        <h3 className="text-sm font-medium text-text-primary flex items-center gap-1.5">
          📅 每周参考
        </h3>
        <div className="bg-cream rounded-xl p-3 space-y-2 text-xs">
          {[
            { day: "周一", task: "跑步 3-5km" },
            { day: "周二", task: "力量训练 + 拉伸" },
            { day: "周三", task: "跑步 3-5km" },
            { day: "周四", task: "力量训练" },
            { day: "周五", task: "跑步 5-8km" },
            { day: "周六", task: "休息或轻松跑" },
            { day: "周日", task: "力量训练或休息" },
          ].map((row) => (
            <div key={row.day} className="flex justify-between">
              <span className="text-text-secondary">{row.day}</span>
              <span className="text-text-primary font-medium">{row.task}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Note */}
      <div className="rounded-2xl bg-warm-yellow-light border border-warm-yellow/30 p-4">
        <p className="text-xs text-text-secondary leading-relaxed">
          ⚠️ 以上为参考计划，请根据自身情况调整。运动前做好热身，运动后充分拉伸。如感不适请立即停止。
        </p>
      </div>
    </div>
  );
}
