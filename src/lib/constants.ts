import type { ExerciseCategory, MoodType } from "./types";

export const WATER_GOAL = 2000;
export const WATER_STEP = 250;

export const BREAKFAST_TAGS = ["鸡蛋", "牛奶", "咖啡", "全麦面包", "燕麦", "水果", "酸奶"];
export const LUNCH_TAGS = ["米饭", "面食", "肉类", "鱼", "蔬菜", "汤", "豆制品"];
export const DINNER_TAGS = ["沙拉", "蛋白质", "蔬菜", "粗粮", "鱼肉", "少碳水"];

export const SNACK_OPTIONS = ["无", "水果", "坚果", "饮料", "零食", "奶茶", "其他"];

// ── Mood ──
export const MOOD_OPTIONS: { value: MoodType; label: string; emoji: string }[] = [
  { value: "great",  label: "状态爆棚",   emoji: "🔥" },
  { value: "good",   label: "还能战斗",   emoji: "💪" },
  { value: "normal", label: "普普通通",   emoji: "🙂" },
  { value: "tired",  label: "有点疲惫",   emoji: "😴" },
  { value: "bad",    label: "被三伏天击败", emoji: "🥵" },
];

// ── Exercise Library ──
export interface ExerciseDef {
  label: string;
  category: ExerciseCategory;
  distance?: number;
}

export const EXERCISE_LIBRARY: ExerciseDef[] = [
  // 有氧
  { label: "跑步 3km", category: "aerobic", distance: 3 },
  { label: "跑步 5km", category: "aerobic", distance: 5 },
  { label: "跑步 8km", category: "aerobic", distance: 8 },
  { label: "游泳", category: "aerobic" },
  { label: "骑行", category: "aerobic" },
  { label: "快走", category: "aerobic" },
  { label: "跳绳", category: "aerobic" },
  { label: "椭圆机", category: "aerobic" },
  { label: "尊巴", category: "aerobic" },
  { label: "跳舞", category: "aerobic" },
  // 无氧
  { label: "力量训练", category: "anaerobic" },
  { label: "深蹲", category: "anaerobic" },
  { label: "臀桥", category: "anaerobic" },
  { label: "平板支撑", category: "anaerobic" },
  { label: "卷腹", category: "anaerobic" },
  { label: "哑铃训练", category: "anaerobic" },
  { label: "器械训练", category: "anaerobic" },
  // 恢复
  { label: "拉伸", category: "recovery" },
  { label: "瑜伽", category: "recovery" },
  { label: "普拉提", category: "recovery" },
];

export const INTENSITY_OPTIONS = [
  { value: "light", label: "轻松" },
  { value: "moderate", label: "适中" },
  { value: "intense", label: "高强度" },
] as const;

export const EXERCISE_LEGACY_MAP: Record<string, ExerciseDef> = {
  "跑步3km": { label: "跑步 3km", category: "aerobic", distance: 3 },
  "跑步5km": { label: "跑步 5km", category: "aerobic", distance: 5 },
  "跑步8km": { label: "跑步 8km", category: "aerobic", distance: 8 },
  "力量训练": { label: "力量训练", category: "anaerobic" },
  "拉伸": { label: "拉伸", category: "recovery" },
};

export const EXERCISE_OPTIONS = EXERCISE_LIBRARY.map(e => e.label);
export const EXERCISE_MAP: Record<string, ExerciseDef> = {};
EXERCISE_LIBRARY.forEach(e => { EXERCISE_MAP[e.label] = e; });

export const SLEEP_OPTIONS = [
  { value: "less6", label: "小于6小时" },
  { value: "6to7", label: "6-7小时" },
  { value: "above7", label: "7小时以上" },
] as const;

export const DIET_RATINGS = [
  { value: "good", label: "😋 健康" },
  { value: "ok", label: "😐 一般" },
  { value: "bad", label: "😈 放纵" },
] as const;

export const MEASUREMENT_LABELS: { key: keyof import("./types").BodyMeasurements; label: string }[] = [
  { key: "waist", label: "腰围" },
  { key: "hip", label: "臀围" },
  { key: "thigh", label: "大腿围" },
  { key: "arm", label: "手臂围" },
  { key: "chest", label: "胸围" },
];

export const STORAGE_KEY = "sanfu-data";
export const TOTAL_DAYS = 40;
