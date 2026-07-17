import type { AppData, DailyRecord, MealRecord, ExerciseRecord, BodyMeasurements } from "./types";
import { STORAGE_KEY, EXERCISE_LEGACY_MAP } from "./constants";

function getDefaultData(): AppData {
  return { startDate: "", startWeight: null, targetWeight: null, records: [] };
}

function migrateRecord(r: Record<string, unknown>): DailyRecord {
  // Exercise migration
  let exercise: ExerciseRecord[] = [];
  const ex = r.exercise;
  if (Array.isArray(ex)) {
    exercise = (ex as Array<Record<string, unknown>>).map((e: Record<string, unknown>) => {
      // Check if it's already V2 format
      if (e.category && e.intensity) return e as unknown as ExerciseRecord;
      // V1 format: { type, minutes, distance? }
      const oldType = String(e.type ?? "");
      const def = EXERCISE_LEGACY_MAP[oldType];
      return {
        category: def?.category ?? "aerobic",
        type: def?.label ?? oldType,
        duration: Number(e.minutes ?? e.duration ?? 0),
        intensity: "moderate" as const,
        distance: def?.distance ?? (e.distance as number | undefined),
      };
    });
  } else if (ex && typeof ex === "object" && (ex as Record<string, unknown>).type) {
    const oldType = String((ex as Record<string, unknown>).type);
    const def = EXERCISE_LEGACY_MAP[oldType];
    exercise = [{
      category: def?.category ?? "aerobic",
      type: def?.label ?? oldType,
      duration: Number((ex as Record<string, unknown>).minutes ?? (ex as Record<string, unknown>).duration ?? 0),
      intensity: "moderate" as const,
      distance: def?.distance ?? ((ex as Record<string, unknown>).distance as number | undefined),
    }];
  }

  function migrateMeal(key: string): MealRecord {
    const v = r[key];
    if (typeof v === "string") return { tags: v ? [v] : [], note: "" };
    if (v && typeof v === "object") {
      const obj = v as Record<string, unknown>;
      return { tags: Array.isArray(obj.tags) ? obj.tags as string[] : [], note: typeof obj.note === "string" ? obj.note : "" };
    }
    return { tags: [], note: "" };
  }

  function migrateMeasurements(): BodyMeasurements | null {
    const m = r.measurements as Record<string, unknown> | undefined;
    if (!m) return null;
    return {
      waist: typeof m.waist === "number" ? m.waist : null,
      hip: typeof m.hip === "number" ? m.hip : null,
      thigh: typeof m.thigh === "number" ? m.thigh : null,
      arm: typeof m.arm === "number" ? m.arm : null,
      chest: typeof m.chest === "number" ? m.chest : null,
    };
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
    measurements: migrateMeasurements(),
    dietRating: (["good", "ok", "bad"].includes(String(r.dietRating)) ? String(r.dietRating) : null) as DailyRecord["dietRating"],
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
