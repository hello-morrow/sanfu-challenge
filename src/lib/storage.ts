import type { AppData, DailyRecord, MealRecord, ExerciseRecord } from "./types";
import { STORAGE_KEY } from "./constants";

function getDefaultData(): AppData {
  return {
    startDate: "",
    startWeight: null,
    targetWeight: null,
    records: [],
  };
}

/** Migrate old-format records to current schema */
function migrateRecord(r: Record<string, unknown>): DailyRecord {
  // Exercise: old single object → array
  let exercise: ExerciseRecord[] = [];
  const ex = r.exercise;
  if (Array.isArray(ex)) {
    exercise = ex as ExerciseRecord[];
  } else if (ex && typeof ex === "object" && (ex as Record<string, unknown>).type) {
    exercise = [ex as ExerciseRecord];
  }

  // Meals: old string → { tags, note }
  function migrateMeal(key: string): MealRecord {
    const v = r[key];
    if (typeof v === "string") {
      return { tags: v ? [v] : [], note: "" };
    }
    if (v && typeof v === "object") {
      const obj = v as Record<string, unknown>;
      return {
        tags: Array.isArray(obj.tags) ? obj.tags as string[] : [],
        note: typeof obj.note === "string" ? obj.note : "",
      };
    }
    return { tags: [], note: "" };
  }

  return {
    date: String(r.date ?? ""),
    weight: typeof r.weight === "number" ? r.weight : null,
    water: typeof r.water === "number" ? r.water : 0,
    breakfast: migrateMeal("breakfast"),
    lunch: migrateMeal("lunch"),
    dinner: migrateMeal("dinner"),
    snack: (r.snack as DailyRecord["snack"]) ?? null,
    exercise,
    sleep: (["less6", "6to7", "above7"].includes(String(r.sleep)) ? String(r.sleep) : null) as DailyRecord["sleep"],
    note: typeof r.note === "string" ? r.note : undefined,
    completed: Boolean(r.completed),
  };
}

export function loadData(): AppData {
  if (typeof window === "undefined") return getDefaultData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultData();
    const parsed = JSON.parse(raw);
    const data: AppData = {
      startDate: String(parsed.startDate ?? ""),
      startWeight: typeof parsed.startWeight === "number" ? parsed.startWeight : null,
      targetWeight: typeof parsed.targetWeight === "number" ? parsed.targetWeight : null,
      records: Array.isArray(parsed.records)
        ? parsed.records.map((r: Record<string, unknown>) => migrateRecord(r))
        : [],
    };
    return data;
  } catch {
    return getDefaultData();
  }
}

export function saveData(data: AppData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
