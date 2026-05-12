import type { SemesterPlan, PlannedCourse } from '@/types/course';
import { SEED_COURSES, COMPLETED_COURSE_IDS } from '@/data/degreeRequirements';

export type SemesterPlanAction =
  | { type: 'ADD_COURSE'; course: PlannedCourse }
  | { type: 'REMOVE_COURSE'; courseId: string }
  | { type: 'SAVE_PLAN' }
  | { type: 'RESET' };

export const initialSemesterPlan: SemesterPlan = {
  courses: [],
  savedAt: null,
};

export function semesterPlanReducer(
  state: SemesterPlan,
  action: SemesterPlanAction,
): SemesterPlan {
  switch (action.type) {
    case 'ADD_COURSE': {
      if (state.courses.find((c) => c.id === action.course.id)) return state;
      const completedIds = COMPLETED_COURSE_IDS;
      const hasPrerequisiteWarning = action.course.prerequisites.some(
        (prereqId) => !completedIds.includes(prereqId),
      );
      return {
        ...state,
        courses: [...state.courses, { ...action.course, hasPrerequisiteWarning }],
      };
    }
    case 'REMOVE_COURSE':
      return {
        ...state,
        courses: state.courses.filter((c) => c.id !== action.courseId),
      };
    case 'SAVE_PLAN':
      return { ...state, savedAt: new Date().toISOString() };
    case 'RESET':
      return initialSemesterPlan;
    default:
      return state;
  }
}

export { SEED_COURSES, COMPLETED_COURSE_IDS };
