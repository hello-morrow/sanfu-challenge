import type { ExerciseType } from "./types";

export const WATER_GOAL = 2000;
export const WATER_STEP = 250;

export const BREAKFAST_TAGS = ["鸡蛋", "奇亚籽", "咖啡", "牛奶", "水果"];
export const LUNCH_TAGS = ["米饭", "肉类", "蔬菜"];
export const DINNER_TAGS = ["蛋白质", "蔬菜", "少碳水"];

export const SNACK_OPTIONS = ["无", "零食", "水果", "饮料"];

export const EXERCISE_OPTIONS = [
  "跑步3km", "跑步5km", "跑步8km", "力量训练", "拉伸",
];

export const EXERCISE_MAP: Record<string, { type: ExerciseType; distance?: number }> = {
  "跑步3km": { type: "run3", distance: 3 },
  "跑步5km": { type: "run5", distance: 5 },
  "跑步8km": { type: "run8", distance: 8 },
  "力量训练": { type: "strength" },
  "拉伸": { type: "stretch" },
};

export const SLEEP_OPTIONS = [
  { value: "less6", label: "小于6小时" },
  { value: "6to7", label: "6-7小时" },
  { value: "above7", label: "7小时以上" },
] as const;

export const STORAGE_KEY = "sanfu-data";
export const TOTAL_DAYS = 40;
