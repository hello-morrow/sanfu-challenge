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

// ── Comic Chapters ──
export const COMIC_CHAPTERS = [
  { episode: 1,  title: "炎热的第一天",     text: "窗外的蝉鸣震耳欲聋。40天，从今天开始。", unlockedDay: 1 },
  { episode: 2,  title: "第一次适应高温",   text: "出汗成了日常。身体开始接受这个节奏。", unlockedDay: 7 },
  { episode: 3,  title: "补给的重要性",     text: "水不是选择，是生存必需品。", unlockedDay: 10 },
  { episode: 4,  title: "真正困难的是坚持", text: "第20天。新鲜感早已消失，剩下的只有习惯。", unlockedDay: 20 },
  { episode: 5,  title: "身体的回答",       text: "围度在变，体重在降。身体用数据回应了你的坚持。", unlockedDay: 25 },
  { episode: 6,  title: "最后的冲刺",       text: "最后10天。训练基地已初具规模。", unlockedDay: 30 },
  { episode: 7,  title: "最终挑战完成",     text: "40天。你不是瘦了多少，你是变成了一个能坚持40天的人。", unlockedDay: 40 },
];

// ── Base Stages ──
export const BASE_STAGES: { stage: import("./types").BaseStage; fromDay: number; name: string; emoji: string; desc: string }[] = [
  { stage: "abandoned", fromDay: 1,  name: "废弃训练基地", emoji: "🏚️",  desc: "一切从这里开始" },
  { stage: "water",     fromDay: 7,  name: "初级基地",     emoji: "🌱",  desc: "水站已建立 · 植物开始生长" },
  { stage: "repair",    fromDay: 15, name: "修复基地",     emoji: "🏠",  desc: "小屋修复 · 简易跑道建成" },
  { stage: "training",  fromDay: 30, name: "训练基地",     emoji: "🏋️",  desc: "完整训练区域投入使用" },
  { stage: "complete",  fromDay: 40, name: "SANFU CAMP",   emoji: "🏆",  desc: "40天挑战达成！" },
];

export type Level = number; // 1-40

// ── Level System (LV 1-40, based on streak) ──
export const LEVEL_THRESHOLDS = [
  { level: 1,  minStreak: 0,  name: "新手幸存者" },
  { level: 5,  minStreak: 3,  name: "适应者" },
  { level: 10, minStreak: 7,  name: "训练兵" },
  { level: 15, minStreak: 14, name: "战士" },
  { level: 20, minStreak: 21, name: "精英" },
  { level: 30, minStreak: 30, name: "SANFU大师" },
  { level: 40, minStreak: 40, name: "传奇幸存者" },
];
