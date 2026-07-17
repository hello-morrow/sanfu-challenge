export type ExerciseCategory = "aerobic" | "anaerobic";
export type ExerciseIntensity = "light" | "moderate" | "intense";

export interface ExerciseRecord {
  category: ExerciseCategory;
  type: string;
  duration: number;
  intensity: ExerciseIntensity;
  distance?: number;
}

export interface MealRecord {
  tags: string[];
  note: string;
}

export interface SnackRecord {
  type: string;
}

export interface BodyMeasurements {
  waist: number | null;   // 腰围 cm
  hip: number | null;     // 臀围
  thigh: number | null;   // 大腿围
  arm: number | null;     // 手臂围
  chest: number | null;   // 胸围
}

export type DietRating = "good" | "ok" | "bad";

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
  note?: string;
  completed: boolean;
}

export interface AppData {
  startDate: string;
  startWeight: number | null;
  targetWeight: number | null;
  records: DailyRecord[];
}
