import type { StudentProfile } from '@/types/student';

export type StudentProfileAction =
  | { type: 'SET_PROFILE'; payload: Partial<StudentProfile> }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'RESET' };

export const initialStudentProfile: StudentProfile = {
  name: '',
  school: '',
  major: '',
  standing: 'Freshman',
  isTransfer: false,
  hasFinancialAid: false,
  language: 'en',
  onboardingComplete: false,
  unitsCompleted: 0,
  unitsRequired: 120,
};

export function studentProfileReducer(
  state: StudentProfile,
  action: StudentProfileAction,
): StudentProfile {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, ...action.payload };
    case 'COMPLETE_ONBOARDING':
      return { ...state, onboardingComplete: true };
    case 'RESET':
      return initialStudentProfile;
    default:
      return state;
  }
}
