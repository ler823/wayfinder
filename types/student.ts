export type AcademicStanding = 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';

export type StudentProfile = {
  name: string;
  school: string;
  major: string;
  standing: AcademicStanding;
  isTransfer: boolean;
  hasFinancialAid: boolean;
  language: string;
  onboardingComplete: boolean;
  unitsCompleted: number;
  unitsRequired: number;
};
