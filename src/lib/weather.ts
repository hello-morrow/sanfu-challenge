/**
 * 三伏天天气系统 — deterministic per-day weather + countdown.
 *
 * 2026 三伏天：7月16日（初伏）→ 8月25日（末伏结束），共40天。
 */

const SANFU_START = new Date("2026-07-16");
const SANFU_END = new Date("2026-08-25T23:59:59");

export interface WeatherData {
  type: "hot" | "rain" | "clear" | "humid" | "storm" | "cloudy";
  emoji: string;
  label: string;
  temp: number;
  heatLevel: number; // 1-5
  effect: string;
}

const WEATHER_POOL: WeatherData[] = [
  { type: "hot",     emoji: "☀️",  label: "高温",   temp: 38, heatLevel: 5, effect: "体力消耗+20%" },
  { type: "rain",    emoji: "🌧️",  label: "暴雨",   temp: 30, heatLevel: 2, effect: "室外训练受限" },
  { type: "clear",   emoji: "🌤️",  label: "晴朗",   temp: 35, heatLevel: 3, effect: "适宜训练" },
  { type: "humid",   emoji: "🥵",  label: "闷热",   temp: 39, heatLevel: 5, effect: "意志力消耗+30%" },
  { type: "storm",   emoji: "⛈️",  label: "雷暴",   temp: 32, heatLevel: 2, effect: "建议室内训练" },
  { type: "cloudy",  emoji: "🌥️",  label: "多云",   temp: 34, heatLevel: 3, effect: "正常训练" },
];

/**
 * Deterministic hash from a date string → number [0, 1).
 * Same date always returns the same weather.
 */
function dateHash(dateStr: string): number {
  let h = 0;
  for (let i = 0; i < dateStr.length; i++) {
    h = ((h << 5) - h + dateStr.charCodeAt(i)) | 0;
  }
  return Math.abs(h % 1000) / 1000;
}

/** Get today's weather (deterministic per date) */
export function getTodayWeather(): WeatherData {
  const today = new Date().toISOString().slice(0, 10);
  const hash = dateHash(today);
  const idx = Math.floor(hash * WEATHER_POOL.length);
  const base = WEATHER_POOL[idx];
  // Vary temp slightly
  const tempVar = Math.floor(dateHash(today + "t") * 5) - 2; // -2 to +2
  return { ...base, temp: base.temp + tempVar };
}

/** True if today falls within the 2026 三伏天 period */
export function isSanfuSeason(): boolean {
  const now = new Date();
  return now >= SANFU_START && now <= SANFU_END;
}

/** Days remaining until 三伏天 ends */
export function sanfuDaysRemaining(): number {
  const now = new Date();
  if (now > SANFU_END) return 0;
  const diff = SANFU_END.getTime() - now.getTime();
  return Math.ceil(diff / 86400000);
}

/** Full countdown: days, hours, minutes */
export function sanfuCountdown(): { days: number; hours: number; minutes: number } {
  const now = new Date();
  if (now > SANFU_END) return { days: 0, hours: 0, minutes: 0 };
  const diff = SANFU_END.getTime() - now.getTime();
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return { days, hours, minutes };
}

/** Hours remaining in today (for daily challenge countdown) */
export function todayHoursRemaining(): { hours: number; minutes: number } {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(23, 59, 59, 999);
  const diff = midnight.getTime() - now.getTime();
  return {
    hours: Math.floor(diff / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
  };
}
