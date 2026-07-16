export default function TrainingPage() {
  return (
    <div className="space-y-5 animate-slide-up">
      <div className="text-center space-y-1 pt-2">
        <p className="text-[28px] font-black text-dark leading-tight">训练规则</p>
        <p className="text-xs text-text-muted font-bold">40 天蜕变计划</p>
      </div>

      <Section title="🏃 跑步训练">
        <Row label="频率" value="每周 4-5 次" />
        <div className="bg-base/60 rounded-xl p-4 space-y-2 mt-2">
          {[{ l: "最低标准", v: "3 公里" }, { l: "标准", v: "5 公里" }, { l: "挑战", v: "8 公里", a: true }].map(r => (
            <div key={r.l} className="flex justify-between"><span className="text-xs text-text-secondary font-bold">{r.l}</span>
              <span className={`text-sm font-extrabold ${r.a ? "text-primary" : "text-dark"}`}>{r.v}</span></div>
          ))}
        </div>
      </Section>

      <Section title="💪 力量训练">
        <Row label="频率" value="每周 2-3 次" />
        <div className="bg-base/60 rounded-xl p-4 mt-2">
          <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider mb-2">训练动作</p>
          <div className="grid grid-cols-2 gap-2">
            {["深蹲","臀桥","箭步蹲","平板支撑","卷腹"].map(i => (
              <div key={i} className="flex items-center gap-2 text-sm font-bold text-dark">
                <span className="w-1.5 h-1.5 rounded-sm bg-primary" />{i}
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="📅 每周参考">
        <div className="divide-y divide-dark/5">
          {[{ d:"周一",t:"跑步 3-5km" },{ d:"周二",t:"力量训练 + 拉伸" },{ d:"周三",t:"跑步 3-5km" },
            { d:"周四",t:"力量训练" },{ d:"周五",t:"跑步 5-8km" },{ d:"周六",t:"休息或轻松跑" },
            { d:"周日",t:"力量训练或休息" }].map(r => (
            <div key={r.d} className="flex justify-between px-1 py-3">
              <span className="text-xs font-bold text-text-secondary">{r.d}</span>
              <span className="text-xs font-extrabold text-dark">{r.t}</span>
            </div>
          ))}
        </div>
      </Section>

      <div className="glass p-4">
        <p className="text-xs text-dark/50 font-medium leading-relaxed">⚠️ 以上为参考计划，请根据自身情况调整。运动前热身，运动后拉伸。不适请立即停止。</p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass p-5 space-y-3">
      <h3 className="text-sm font-extrabold text-dark">{title}</h3>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between bg-base/60 rounded-xl px-4 py-3">
      <span className="text-xs font-extrabold text-text-secondary uppercase tracking-wider">{label}</span>
      <span className="text-sm font-extrabold text-dark">{value}</span>
    </div>
  );
}
