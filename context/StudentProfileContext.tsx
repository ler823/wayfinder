import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  studentProfileReducer,
  initialStudentProfile,
  type StudentProfileAction,
} from '@/reducers/studentProfileReducer';
import type { StudentProfile } from '@/types/student';

const STORAGE_KEY = '@wayfinder_profile';

type StudentProfileContextValue = {
  profile: StudentProfile;
  dispatch: React.Dispatch<StudentProfileAction>;
  isLoaded: boolean;
};

const StudentProfileContext = createContext<StudentProfileContextValue | null>(null);

export function StudentProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, dispatch] = useReducer(studentProfileReducer, initialStudentProfile);
  const [isLoaded, setIsLoaded] = React.useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const saved = JSON.parse(raw) as Partial<StudentProfile>;
          dispatch({ type: 'SET_PROFILE', payload: saved });
        } catch {}
      }
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    }
  }, [profile, isLoaded]);

  return (
    <StudentProfileContext.Provider value={{ profile, dispatch, isLoaded }}>
      {children}
    </StudentProfileContext.Provider>
  );
}

export function useStudentProfile() {
  const ctx = useContext(StudentProfileContext);
  if (!ctx) throw new Error('useStudentProfile must be used within StudentProfileProvider');
  return ctx;
}
