"use client";

import { useState, useEffect, useCallback } from "react";
import type { AppData, DailyRecord, Level, BaseStage, SurvivorProfile } from "@/lib/types";
import { loadData, saveData } from "@/lib/storage";
import { WATER_GOAL, BASE_STAGES, LEVEL_THRESHOLDS, EXP_PER_MISSION, EXP_THRESHOLDS } from "@/lib/constants";

export function useRecords() {
  const [data, setData] = useState<AppData>(() => loadData());
  const [showLevelUp, setShowLevelUp] = useState<{ from: number; to: number } | null>(null);

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

  const createSurvivor = useCallback((profile: SurvivorProfile, sd: string, sw: number, tw: number | null) => {
    setData(prev => ({ ...prev, survivor: profile, startDate: sd, startWeight: sw, targetWeight: tw }));
  }, []);

  const setStartInfo = useCallback((startDate: string, startWeight: number, targetWeight: number | null) => {
    setData(prev => ({ ...prev, startDate, startWeight, targetWeight }));
  }, []);

  const currentDay = (): number => {
    if (!data.startDate) return 0;
    return Math.max(0, Math.min(Math.floor((new Date().getTime() - new Date(data.startDate).getTime()) / 86400000) + 1, 40));
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
      const ok = [r.water>=WATER_GOAL, !!(r.breakfast?.tags?.length||r.lunch?.tags?.length||r.dinner?.tags?.length||r.snack), r.exercise.length>0, !!r.sleep].filter(Boolean).length >= 3;
      if (i===0) { if(ok) s++; else break; }
      else if ((new Date(sorted[i-1].date).getTime()-new Date(r.date).getTime())/86400000===1 && ok) s++; else break;
    }
    return s;
  };

  const streak = streakDays();

  // ── EXP ──
  const totalCompleted = data.records.filter(r => r.completed).length;
  const exp = totalCompleted * EXP_PER_MISSION;
  const prevLevel = (() => { let l=0; for(let i=0;i<LEVEL_THRESHOLDS.length;i++) if(streak>=LEVEL_THRESHOLDS[i].minStreak) l=i; return l; })();
  const levelIndex = (() => { let i=1; while(i<EXP_THRESHOLDS.length && exp>=EXP_THRESHOLDS[i]) i++; return i; })();
  const currentExp = exp - (EXP_THRESHOLDS[levelIndex-1] ?? 0);
  const nextExp = (EXP_THRESHOLDS[levelIndex] ?? EXP_THRESHOLDS[levelIndex-1]+100) - (EXP_THRESHOLDS[levelIndex-1] ?? 0);
  const expPct = nextExp > 0 ? Math.min((currentExp / nextExp) * 100, 100) : 100;

  const lvlInfo = (() => { let l=LEVEL_THRESHOLDS[0]; for(const t of LEVEL_THRESHOLDS) if(streak>=t.minStreak) l=t; return l; })();
  const playerLevel = { level: levelIndex, name: lvlInfo.name };

  const baseStage: { stage: BaseStage; name: string; emoji: string; desc: string } = (() => {
    const day = currentDay(); let s=BASE_STAGES[0]; for(const b of BASE_STAGES) if(day>=b.fromDay) s=b; return s;
  })();

  const triggerLevelUp = (from: number, to: number) => {
    setShowLevelUp({ from, to });
    setTimeout(() => setShowLevelUp(null), 2500);
  };

  return {
    data, today, todayRecord, saveRecord, setStartInfo, createSurvivor, getRecord,
    completionRate: compRate, currentDay, weightChange, streakDays,
    streak, playerLevel, baseStage,
    exp, currentExp, nextExp, expPct, levelIndex,
    showLevelUp, triggerLevelUp,
  };
}
