export type RequirementCategory =
  | 'Core Requirement'
  | 'Upper Division Elective'
  | 'General Education'
  | 'Elective';

export type Course = {
  id: string;
  name: string;
  units: number;
  requirementCategory: RequirementCategory;
  prerequisites: string[]; // course IDs
  corequisites: string[];
};

export type PlannedCourse = Course & {
  hasPrerequisiteWarning: boolean;
};

export type SemesterPlan = {
  courses: PlannedCourse[];
  savedAt: string | null;
};
