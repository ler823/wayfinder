import type { Deadline } from '@/types/deadline';

export const SEED_DEADLINES: Deadline[] = [
  {
    id: 'fa-renewal',
    title: 'Financial Aid Renewal Deadline',
    category: 'financial-aid',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    consequence:
      'Missing this deadline may delay or reduce your financial aid for next semester.',
    officeId: 'financial-aid',
    steps: [
      { id: 'fa-1', label: 'Log in to the financial aid portal', status: 'pending' },
      { id: 'fa-2', label: 'Submit required documents', status: 'pending' },
      { id: 'fa-3', label: 'Confirm submission with the financial aid office', status: 'pending' },
    ],
  },
  {
    id: 'spring-reg',
    title: 'Spring Registration Opens',
    category: 'registration',
    dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    consequence:
      'If you miss your enrollment appointment, the classes you need may fill up before you can register.',
    officeId: 'registrar',
    steps: [
      { id: 'reg-1', label: 'Review your degree progress and plan your courses', status: 'pending' },
      { id: 'reg-2', label: 'Meet with your advisor to confirm your plan', status: 'pending' },
      { id: 'reg-3', label: 'Register during your enrollment appointment window', status: 'pending' },
    ],
  },
];
