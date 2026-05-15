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
  {
    id: 'fafsa-deadline',
    title: 'FAFSA Submission Deadline',
    category: 'financial-aid',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    consequence:
      'Submitting FAFSA late can cost you thousands in grants and loans that are first-come, first-served. Some aid runs out before the deadline.',
    officeId: 'financial-aid',
    steps: [
      { id: 'fafsa-1', label: 'Create or log in to your StudentAid.gov account', status: 'pending' },
      { id: 'fafsa-2', label: 'Gather your (and parent\'s, if applicable) tax information', status: 'pending' },
      { id: 'fafsa-3', label: 'Complete and submit the FAFSA form', status: 'pending' },
      { id: 'fafsa-4', label: 'Check your student email for a confirmation and next steps', status: 'pending' },
    ],
  },
  {
    id: 'sap-appeal',
    title: 'SAP Appeal Deadline',
    category: 'academic',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    consequence:
      'Satisfactory Academic Progress (SAP) appeals must be submitted by this date or your financial aid will be suspended for the next semester.',
    officeId: 'financial-aid',
    steps: [
      { id: 'sap-1', label: 'Download the SAP Appeal form from the financial aid portal', status: 'pending' },
      { id: 'sap-2', label: 'Write a personal statement explaining your situation', status: 'pending' },
      { id: 'sap-3', label: 'Attach supporting documentation (medical, personal, etc.)', status: 'pending' },
      { id: 'sap-4', label: 'Submit the completed appeal to the Financial Aid Office', status: 'pending' },
    ],
  },
  {
    id: 'advisor-appt',
    title: 'Schedule Your Advising Appointment',
    category: 'advising',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    consequence:
      'Without an advising appointment, you may register for courses that do not count toward your degree — losing time and money.',
    officeId: 'advising',
    steps: [
      { id: 'adv-1', label: 'Log in to your student portal and find the advising scheduler', status: 'pending' },
      { id: 'adv-2', label: 'Prepare a list of courses you plan to take next semester', status: 'pending' },
      { id: 'adv-3', label: 'Attend your appointment and confirm your course plan', status: 'pending' },
    ],
  },
  {
    id: 'grade-forgiveness',
    title: 'Grade Forgiveness Application',
    category: 'academic',
    dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    consequence:
      'Grade forgiveness can remove a failing grade from your GPA calculation, but only if you apply before this deadline. Missing it means the original grade stays.',
    officeId: 'registrar',
    steps: [
      { id: 'gf-1', label: 'Confirm you have re-taken (or are re-taking) the same course', status: 'pending' },
      { id: 'gf-2', label: 'Pick up the Grade Forgiveness form from the Registrar\'s Office', status: 'pending' },
      { id: 'gf-3', label: 'Get your advisor\'s signature on the form', status: 'pending' },
      { id: 'gf-4', label: 'Submit the signed form to the Registrar\'s Office', status: 'pending' },
    ],
  },
];
