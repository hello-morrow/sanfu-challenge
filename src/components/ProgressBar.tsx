export default function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-2 rounded-full bg-dark/5 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: pct > 0 ? "linear-gradient(90deg, #FF6B35, #FFB703)" : "transparent" }} />
    </div>
  );
}
