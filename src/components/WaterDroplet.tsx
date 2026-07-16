"use client";

import ProgressBar from "./ProgressBar";
import { WATER_GOAL, WATER_STEP } from "@/lib/constants";

export default function WaterDroplet({
  water,
  onAdd,
}: {
  water: number;
  onAdd: () => void;
}) {
  const drops = Math.floor(water / WATER_STEP);
  const maxDrops = WATER_GOAL / WATER_STEP;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-secondary font-medium">💧 今日饮水</span>
        <span className="text-lg font-bold text-dark">
          {water}
          <span className="text-xs font-normal text-text-muted"> / {WATER_GOAL} ml</span>
        </span>
      </div>
      <ProgressBar value={water} max={WATER_GOAL} />
      <div className="flex justify-center gap-2">
        {Array.from({ length: maxDrops }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={onAdd}
            disabled={i < drops}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 ${
              i < drops
                ? "bg-primary text-white shadow-sm"
                : "bg-dark/5 text-text-muted border border-dark/10"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L4 14c-2 3.3 0 7.5 4 8 3.4.4 6.6-1.7 7.6-5 .2-.7.3-2 .4-3 0-1.5.5-2.5 1-3 .5-.5 1.5-1 2-1s1.5.5 2 1c.5.5 1 1.5 1 3 .1 1 .2 2.3.4 3 1 3.3 4.2 5.4 7.6 5 4-.5 6-4.7 4-8L12 2z" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
