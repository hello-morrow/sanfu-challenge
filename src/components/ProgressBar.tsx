export default function ProgressBar({
  value,
  max,
  color = "green",
  height = "h-2",
}: {
  value: number;
  max: number;
  color?: "green" | "yellow";
  height?: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  const barColor = color === "yellow" ? "bg-warm-yellow" : "bg-green-primary";
  const trackColor =
    color === "yellow" ? "bg-warm-yellow-light" : "bg-green-pale";

  return (
    <div className={`w-full rounded-full ${trackColor} ${height} overflow-hidden`}>
      <div
        className={`${barColor} ${height} rounded-full transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
