export type ExerciseCategory = "aerobic" | "anaerobic" | "recovery";
export type ExerciseIntensity = "light" | "moderate" | "intense";

export interface ExerciseRecord {
  category: ExerciseCategory;
  type: string;
  duration: number;
  intensity: ExerciseIntensity;
  distance?: number;
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

export interface ComicChapter {
  episode: number;
  title: string;
  text: string;
  unlockedDay: number;
}

export type Level = number;
export type BaseStage = "abandoned" | "water" | "repair" | "training" | "complete";

export interface DailyRecord {
  date: string;
  weight: number | null;
  water: number;
  breakfast: MealRecord;
  lunch: MealRecord;
  dinner: MealRecord;
  snack: SnackRecord | null;
  exercise: ExerciseRecord[];
  sleep: "less6" | "6to7" | "above7" | null;
  measurements: BodyMeasurements | null;
  dietRating: DietRating | null;
  mood: MoodRecord | null;
  note?: string;
  completed: boolean;
}

export interface AppData {
  startDate: string;
  startWeight: number | null;
  targetWeight: number | null;
  records: DailyRecord[];
}
