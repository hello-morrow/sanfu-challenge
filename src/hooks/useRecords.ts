"use client";

import { useState, useEffect, useCallback } from "react";
import type { AppData, DailyRecord, Level, BaseStage } from "@/lib/types";
import { loadData, saveData } from "@/lib/storage";
import { WATER_GOAL, BASE_STAGES, LEVEL_THRESHOLDS } from "@/lib/constants";

export function useRecords() {
  const [data, setData] = useState<AppData>(() => loadData());
  useEffect(() => { saveData(data); }, [data]);

  const today = new Date().toISOString().slice(0, 10);
  const getRecord = useCallback((d: string) => data.records.find(r => r.date === d), [data.records]);
  const todayRecord = getRecord(today);

  const saveRecord = useCallback((record: DailyRecord) => {
    setData(prev => {
      const idx = prev.records.findIndex(r => r.date === record.date);
      const records = idx >= 0
        ? [...prev.records.slice(0, idx), record, ...prev.records.slice(idx + 1)]
        : [...prev.records, record];
      return { ...prev, records };
    });
  }, []);

  const setStartInfo = useCallback((startDate: string, startWeight: number, targetWeight: number | null) => {
    setData(prev => ({ ...prev, startDate, startWeight, targetWeight }));
  }, []);

  const currentDay = (): number => {
    if (!data.startDate) return 0;
    const diff = Math.floor((new Date().getTime() - new Date(data.startDate).getTime()) / 86400000) + 1;
    return Math.max(0, Math.min(diff, 40));
  };

  const weightChange = (): number | null => {
    if (data.startWeight === null || !todayRecord?.weight) return null;
    return todayRecord.weight - data.startWeight;
  };

  const compRate = (): number => {
    const done = data.records.filter(r => r.completed).length;
    return data.records.length === 0 ? 0 : Math.round((done / data.records.length) * 100);
  };

  const streakDays = (): number => {
    let s = 0;
    const sorted = [...data.records].sort((a, b) => b.date.localeCompare(a.date));
    for (let i = 0; i < sorted.length; i++) {
      const r = sorted[i];
      const ok = [
        r.water >= WATER_GOAL,
        !!(r.breakfast?.tags?.length || r.lunch?.tags?.length || r.dinner?.tags?.length || r.snack),
        r.exercise.length > 0,
        !!r.sleep,
      ].filter(Boolean).length >= 3;
      if (i === 0) { if (ok) s++; else break; }
      else if ((new Date(sorted[i-1].date).getTime() - new Date(r.date).getTime()) / 86400000 === 1 && ok) s++;
      else break;
    }
    return s;
  };

  const streak = streakDays();

  const playerLevel: { level: Level; name: string; emoji: string } = (() => {
    let l = LEVEL_THRESHOLDS[0];
    for (const t of LEVEL_THRESHOLDS) if (streak >= t.minStreak) l = t;
    return { level: l.level, name: l.name, emoji: l.emoji };
  })();

  const baseStage: { stage: BaseStage; name: string; emoji: string; desc: string } = (() => {
    const day = currentDay();
    let s = BASE_STAGES[0];
    for (const b of BASE_STAGES) if (day >= b.fromDay) s = b;
    return s;
  })();

  return {
    data, today, todayRecord, saveRecord, setStartInfo, getRecord,
    completionRate: compRate, currentDay, weightChange, streakDays,
    streak, playerLevel, baseStage,
  };
}
