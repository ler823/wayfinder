import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  academicRecoveryReducer,
  initialAcademicRecoveryState,
  type AcademicRecoveryAction,
  type AcademicRecoveryState,
} from '@/reducers/academicRecoveryReducer';

const STORAGE_KEY = '@wayfinder_academic_recovery';

type AcademicRecoveryContextValue = {
  state: AcademicRecoveryState;
  dispatch: React.Dispatch<AcademicRecoveryAction>;
};

const AcademicRecoveryContext = createContext<AcademicRecoveryContextValue | null>(null);

export function AcademicRecoveryProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(academicRecoveryReducer, initialAcademicRecoveryState);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const saved = JSON.parse(raw) as AcademicRecoveryState;
          if (saved && (saved.savedIssueIds || saved.resolvedIssueIds)) {
            dispatch({ type: 'RESTORE', state: saved });
          }
        } catch {}
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <AcademicRecoveryContext.Provider value={{ state, dispatch }}>
      {children}
    </AcademicRecoveryContext.Provider>
  );
}

export function useAcademicRecovery() {
  const ctx = useContext(AcademicRecoveryContext);
  if (!ctx) throw new Error('useAcademicRecovery must be used within AcademicRecoveryProvider');
  return ctx;
}
