import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  deadlinesReducer,
  initialDeadlinesState,
  type DeadlinesAction,
  type DeadlinesState,
} from '@/reducers/deadlinesReducer';

const STORAGE_KEY = '@wayfinder_deadlines';

type DeadlinesContextValue = {
  state: DeadlinesState;
  dispatch: React.Dispatch<DeadlinesAction>;
};

const DeadlinesContext = createContext<DeadlinesContextValue | null>(null);

export function DeadlinesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(deadlinesReducer, initialDeadlinesState);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const saved = JSON.parse(raw) as Partial<DeadlinesState>;
          if (saved.deadlines) {
            saved.deadlines.forEach((d) => {
              d.steps.forEach((s) => {
                if (s.status !== 'pending') {
                  dispatch({ type: 'SET_STEP_STATUS', deadlineId: d.id, stepId: s.id, status: s.status });
                }
              });
            });
          }
        } catch {}
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <DeadlinesContext.Provider value={{ state, dispatch }}>
      {children}
    </DeadlinesContext.Provider>
  );
}

export function useDeadlines() {
  const ctx = useContext(DeadlinesContext);
  if (!ctx) throw new Error('useDeadlines must be used within DeadlinesProvider');
  return ctx;
}
