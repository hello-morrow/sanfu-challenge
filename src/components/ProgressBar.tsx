export default function ProgressBar({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label?: string;
}) {
  const pct = Math.min((value / max) * 100, 100);

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex justify-between text-xs">
          <span className="text-text-secondary font-medium">{label}</span>
          <span className="text-primary font-bold">{Math.round(pct)}%</span>
        </div>
      )}
      <div className="w-full h-3 rounded-full bg-dark/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: pct > 0
              ? "linear-gradient(90deg, #FF6B35, #FFB703)"
              : "transparent",
          }}
        />
      </div>
    </div>
  );
}
