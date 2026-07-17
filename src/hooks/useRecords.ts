"use client";

import { useState, useEffect, useCallback } from "react";
import type { AppData, DailyRecord } from "@/lib/types";
import { loadData, saveData } from "@/lib/storage";
import { WATER_GOAL } from "@/lib/constants";

export function useRecords() {
  const [data, setData] = useState<AppData>(() => loadData());

  useEffect(() => { saveData(data); }, [data]);

  const today = new Date().toISOString().slice(0, 10);

  const getRecord = useCallback(
    (date: string): DailyRecord | undefined => data.records.find((r) => r.date === date),
    [data.records]
  );

  const todayRecord = getRecord(today);

  const saveRecord = useCallback((record: DailyRecord) => {
    setData((prev) => {
      const idx = prev.records.findIndex((r) => r.date === record.date);
      const records = idx >= 0
        ? [...prev.records.slice(0, idx), record, ...prev.records.slice(idx + 1)]
        : [...prev.records, record];
      return { ...prev, records };
    });
  }, []);

  const setStartInfo = useCallback(
    (startDate: string, startWeight: number, targetWeight: number | null) => {
      setData((prev) => ({ ...prev, startDate, startWeight, targetWeight }));
    }, []
  );

  const completionRate = (): number => {
    const completed = data.records.filter((r) => r.completed).length;
    if (data.records.length === 0) return 0;
    return Math.round((completed / data.records.length) * 100);
  };

  const currentDay = (): number => {
    if (!data.startDate) return 0;
    const diff = Math.floor((new Date().getTime() - new Date(data.startDate).getTime()) / 86400000) + 1;
    return Math.max(0, Math.min(diff, 40));
  };

  const weightChange = (): number | null => {
    if (data.startWeight === null || !todayRecord?.weight) return null;
    return todayRecord.weight - data.startWeight;
  };

  const streakDays = (): number => {
    let streak = 0;
    const sorted = [...data.records].sort((a, b) => b.date.localeCompare(a.date));
    for (let i = 0; i < sorted.length; i++) {
      const r = sorted[i];
      // 3 of 4 must be done: water, diet, exercise, sleep
      const waterOk = r.water >= WATER_GOAL;
      const dietOk = !!(r.breakfast?.tags?.length || r.lunch?.tags?.length || r.dinner?.tags?.length || r.snack);
      const exerciseOk = r.exercise.length > 0;
      const sleepOk = !!r.sleep;
      const done = [waterOk, dietOk, exerciseOk, sleepOk].filter(Boolean).length >= 3;
      if (i === 0) { if (done) streak++; else break; }
      else {
        const diff = (new Date(sorted[i-1].date).getTime() - new Date(r.date).getTime()) / 86400000;
        if (diff === 1 && done) streak++; else break;
      }
    }
    return streak;
  };

  return {
    data, today, todayRecord, saveRecord, setStartInfo, getRecord,
    completionRate, currentDay, weightChange, streakDays,
  };
}
