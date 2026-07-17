export type ExerciseType = "run3" | "run5" | "run8" | "strength" | "stretch";

export interface ExerciseRecord {
  type: ExerciseType;
  distance?: number;
  minutes: number;
}

export interface MealRecord {
  tags: string[];
  note: string;
}

export interface SnackRecord {
  type: string; // "none" | "零食" | "水果" | "饮料" | custom string
}

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
  note?: string;
  completed: boolean;
}

export interface AppData {
  startDate: string;
  startWeight: number | null;
  targetWeight: number | null;
  records: DailyRecord[];
}
