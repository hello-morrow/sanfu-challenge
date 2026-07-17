import type { AppData, DailyRecord } from "./types";
import { MEASUREMENT_LABELS, EXERCISE_MAP } from "./constants";

/** Escape CSV field */
function esc(v: unknown): string {
  const s = String(v ?? "");
  return s.includes(",") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Build diet summary string */
function dietSummary(r: DailyRecord): string {
  const parts: string[] = [];
  if (r.breakfast.tags.length) parts.push("早:" + r.breakfast.tags.join("/"));
  if (r.lunch.tags.length) parts.push("午:" + r.lunch.tags.join("/"));
  if (r.dinner.tags.length) parts.push("晚:" + r.dinner.tags.join("/"));
  if (r.snack) parts.push("加餐:" + r.snack.type);
  if (r.dietRating) parts.push("评价:" + r.dietRating);
  return parts.join("; ");
}

/** Export all records as CSV */
export function exportCSV(data: AppData): string {
  const headers = [
    "日期", "体重(kg)", "饮水(ml)",
    "早餐", "午餐", "晚餐", "加餐", "饮食评价",
    "运动", "时长(min)", "强度",
    "睡眠", "腰围(cm)", "臀围(cm)", "大腿围(cm)", "手臂围(cm)", "胸围(cm)",
    "今日状态", "心情备注", "备注", "是否完成",
  ];

  const rows = data.records.map(r => {
    const exSummary = r.exercise.map(e => `${e.type}(${e.intensity})`).join("+");
    const exDuration = r.exercise.reduce((s, e) => s + e.duration, 0);
    const exIntensity = r.exercise.map(e => e.intensity).join("+");
    return [
      r.date, r.weight ?? "", r.water,
      r.breakfast.tags.join("/") || r.breakfast.note,
      r.lunch.tags.join("/") || r.lunch.note,
      r.dinner.tags.join("/") || r.dinner.note,
      r.snack?.type ?? "",
      r.dietRating ?? "",
      exSummary, exDuration || "", exIntensity,
      r.sleep ?? "",
      r.measurements?.waist ?? "",
      r.measurements?.hip ?? "",
      r.measurements?.thigh ?? "",
      r.measurements?.arm ?? "",
      r.measurements?.chest ?? "",
      r.mood?.type ?? "",
      r.mood?.note ?? "",
      r.note ?? "",
      r.completed ? "是" : "否",
    ].map(esc);
  });

  return [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
}

/** Export all data as JSON */
export function exportJSON(data: AppData): string {
  return JSON.stringify(data, null, 2);
}

/** Trigger file download in browser */
export function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob(["\uFEFF" + content], { type: mime }); // BOM for Excel UTF-8
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
