export type ExerciseType = "run3" | "run5" | "run8" | "strength" | "stretch";

export interface ExerciseRecord {
  type: ExerciseType;
  distance?: number;
  minutes: number;
}

export interface DailyRecord {
  date: string;
  weight: number | null;
  water: number;
  breakfast: string;
  lunch: string;
  dinner: string;
  exercise: ExerciseRecord | null;
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
