import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  semesterPlanReducer,
  initialSemesterPlan,
  type SemesterPlanAction,
} from '@/reducers/semesterPlanReducer';
import type { SemesterPlan } from '@/types/course';

const STORAGE_KEY = '@wayfinder_semester_plan';

type SemesterPlanContextValue = {
  plan: SemesterPlan;
  dispatch: React.Dispatch<SemesterPlanAction>;
};

const SemesterPlanContext = createContext<SemesterPlanContextValue | null>(null);

export function SemesterPlanProvider({ children }: { children: React.ReactNode }) {
  const [plan, dispatch] = useReducer(semesterPlanReducer, initialSemesterPlan);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const saved = JSON.parse(raw) as SemesterPlan;
          saved.courses.forEach((c) => dispatch({ type: 'ADD_COURSE', course: c }));
        } catch {}
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  }, [plan]);

  return (
    <SemesterPlanContext.Provider value={{ plan, dispatch }}>
      {children}
    </SemesterPlanContext.Provider>
  );
}

export function useSemesterPlan() {
  const ctx = useContext(SemesterPlanContext);
  if (!ctx) throw new Error('useSemesterPlan must be used within SemesterPlanProvider');
  return ctx;
}
