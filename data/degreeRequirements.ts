import type { Course } from '@/types/course';

export const SEED_COURSES: Course[] = [
  {
    id: 'cs101',
    name: 'Introduction to Computer Science',
    units: 3,
    requirementCategory: 'Core Requirement',
    prerequisites: [],
    corequisites: [],
  },
  {
    id: 'cs201',
    name: 'Data Structures',
    units: 3,
    requirementCategory: 'Core Requirement',
    prerequisites: ['cs101'],
    corequisites: [],
  },
  {
    id: 'cs301',
    name: 'Algorithms',
    units: 3,
    requirementCategory: 'Upper Division Elective',
    prerequisites: ['cs201'],
    corequisites: [],
  },
  {
    id: 'eng101',
    name: 'English Composition',
    units: 3,
    requirementCategory: 'General Education',
    prerequisites: [],
    corequisites: [],
  },
  {
    id: 'math101',
    name: 'Calculus I',
    units: 4,
    requirementCategory: 'Core Requirement',
    prerequisites: [],
    corequisites: [],
  },
  {
    id: 'math201',
    name: 'Calculus II',
    units: 4,
    requirementCategory: 'Core Requirement',
    prerequisites: ['math101'],
    corequisites: [],
  },
];

export const COMPLETED_COURSE_IDS = ['cs101', 'eng101', 'math101'];
