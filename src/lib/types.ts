export type ExerciseCategory = "aerobic" | "anaerobic" | "recovery";
export type ExerciseIntensity = "light" | "moderate" | "intense";
export type Gender = "male" | "female";
export type SurvivorClass = "athlete" | "foodie" | "nightowl";

export interface ExerciseRecord {
  category: ExerciseCategory; type: string; duration: number;
  intensity: ExerciseIntensity; distance?: number;
}
export interface MealRecord { tags: string[]; note: string; }
export interface SnackRecord { type: string; }
export interface BodyMeasurements {
  waist: number | null; hip: number | null; thigh: number | null;
  arm: number | null; chest: number | null;
}
export type DietRating = "good" | "ok" | "bad";
export type MoodType = "great" | "good" | "normal" | "tired" | "bad";
export interface MoodRecord { type: MoodType; note: string; }
export interface ComicChapter { episode: number; title: string; text: string; unlockedDay: number; }
export type Level = number;
export type BaseStage = "abandoned" | "water" | "repair" | "training" | "complete";

export interface SurvivorProfile {
  name: string; gender: Gender; class: SurvivorClass; createdAt: string;
}

export interface DailyRecord {
  date: string; weight: number | null; water: number;
  breakfast: MealRecord; lunch: MealRecord; dinner: MealRecord;
  snack: SnackRecord | null; exercise: ExerciseRecord[];
  sleep: "less6" | "6to7" | "above7" | null;
  measurements: BodyMeasurements | null; dietRating: DietRating | null;
  mood: MoodRecord | null; note?: string; completed: boolean;
}

export interface AppData {
  survivor: SurvivorProfile | null;
  startDate: string; startWeight: number | null; targetWeight: number | null;
  records: DailyRecord[];
}

export const CLASS_DEFS: { id: SurvivorClass; emoji: string; name: string; desc: string; color: string }[] = [
  { id: "athlete",  emoji: "🏃", name: "运动新人", desc: "运动成长速度提升", color: "#FF6B35" },
  { id: "foodie",   emoji: "🍚", name: "夏日干饭人", desc: "饮食记录奖励提升", color: "#FFB703" },
  { id: "nightowl", emoji: "🌙", name: "夜晚战士", desc: "特殊睡眠事件触发", color: "#7C6FAA" },
];
