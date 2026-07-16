"use client";

import { useState, useEffect, useCallback } from "react";
import type { AppData, DailyRecord } from "@/lib/types";
import { loadData, saveData } from "@/lib/storage";

export function useRecords() {
  const [data, setData] = useState<AppData>(() => loadData());

  // persist to localStorage on changes
  useEffect(() => {
    saveData(data);
  }, [data]);

  const today = new Date().toISOString().slice(0, 10);

  const getRecord = useCallback(
    (date: string): DailyRecord | undefined => {
      return data.records.find((r) => r.date === date);
    },
    [data.records]
  );

  const todayRecord = getRecord(today);

  const saveRecord = useCallback(
    (record: DailyRecord) => {
      setData((prev) => {
        const idx = prev.records.findIndex((r) => r.date === record.date);
        let records;
        if (idx >= 0) {
          records = [...prev.records];
          records[idx] = record;
        } else {
          records = [...prev.records, record];
        }
        return { ...prev, records };
      });
    },
    []
  );

  const setStartInfo = useCallback(
    (startDate: string, startWeight: number) => {
      setData((prev) => ({ ...prev, startDate, startWeight }));
    },
    []
  );

  const completionRate = (): number => {
    const completed = data.records.filter((r) => r.completed).length;
    if (data.records.length === 0) return 0;
    return Math.round((completed / data.records.length) * 100);
  };

  const currentDay = (): number => {
    if (!data.startDate) return 0;
    const start = new Date(data.startDate);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
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
      if (i === 0) {
        if (!sorted[i].completed) break;
        streak++;
      } else {
        const prevDate = new Date(sorted[i - 1].date);
        const currDate = new Date(sorted[i].date);
        const diffDays =
          (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays === 1 && sorted[i].completed) {
          streak++;
        } else {
          break;
        }
      }
    }
    return streak;
  };

  return {
    data,
    today,
    todayRecord,
    saveRecord,
    setStartInfo,
    getRecord,
    completionRate,
    currentDay,
    weightChange,
    streakDays,
  };
}
