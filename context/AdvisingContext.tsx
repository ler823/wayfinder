import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  advisingReducer,
  initialAdvisingState,
  type AdvisingAction,
} from '@/reducers/advisingReducer';
import type { AdvisingState } from '@/types/advising';

const STORAGE_KEY = '@wayfinder_advising';

type AdvisingContextValue = {
  state: AdvisingState;
  dispatch: React.Dispatch<AdvisingAction>;
};

const AdvisingContext = createContext<AdvisingContextValue | null>(null);

export function AdvisingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(advisingReducer, initialAdvisingState);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const saved = JSON.parse(raw) as AdvisingState;
          dispatch({ type: 'SET_TOPICS', topics: saved.topics });
        } catch {}
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <AdvisingContext.Provider value={{ state, dispatch }}>
      {children}
    </AdvisingContext.Provider>
  );
}

export function useAdvising() {
  const ctx = useContext(AdvisingContext);
  if (!ctx) throw new Error('useAdvising must be used within AdvisingProvider');
  return ctx;
}
