export type GlossaryTerm = {
  id: string;
  term: string;
  definition: string;
};

export const GLOSSARY: GlossaryTerm[] = [
  {
    id: 'financial-aid',
    term: 'Financial Aid',
    definition:
      'Money from the government, your school, or other sources to help pay for college. It can be grants (free money), loans (money you repay), or work-study (a part-time job).',
  },
  {
    id: 'sap',
    term: 'Satisfactory Academic Progress',
    definition:
      'A set of rules you need to follow to keep receiving financial aid. Usually this means maintaining a minimum GPA and completing enough of your classes each semester.',
  },
  {
    id: 'enrollment-appointment',
    term: 'Enrollment Appointment',
    definition:
      'The specific date and time when you are allowed to start registering for next semester\'s classes. Students with more credits usually get earlier appointments.',
  },
  {
    id: 'prerequisites',
    term: 'Prerequisites',
    definition:
      'Classes you must complete before you can sign up for a higher-level class. For example, you usually need to pass Calculus 1 before you can take Calculus 2.',
  },
  {
    id: 'academic-probation',
    term: 'Academic Probation',
    definition:
      'A warning status that means your GPA has dropped below the minimum required. You can usually get off probation by raising your grades the next semester.',
  },
  {
    id: 'units-credits',
    term: 'Units / Credits',
    definition:
      'A number that measures how much work a class requires. Most classes are 3 units. You need a certain total number of units to graduate.',
  },
  {
    id: 'upper-division',
    term: 'Upper Division',
    definition:
      'Classes numbered 300 or above (varies by school). These are more advanced courses typically taken in your junior and senior years.',
  },
  {
    id: 'fafsa',
    term: 'FAFSA',
    definition:
      'Free Application for Federal Student Aid. A form you fill out each year to apply for financial aid. Missing the deadline can reduce or eliminate your aid.',
  },
];
