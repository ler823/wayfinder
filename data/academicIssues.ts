export type AcademicIssueType = 'probation' | 'transfer-credit-gap' | 'course-failure' | 'sap-warning';

export type RecoveryStep = {
  number: number;
  label: string;
};

export type AcademicIssue = {
  id: string;
  title: string;
  issueType: AcademicIssueType;
  explanation: string;
  steps: RecoveryStep[];
  contactScript: string;
  officeId: string;
};

export const ACADEMIC_ISSUES: AcademicIssue[] = [
  {
    id: 'probation',
    title: 'Academic Probation',
    issueType: 'probation',
    explanation:
      "You've been placed on academic probation because your GPA fell below 2.0. This doesn't mean you're being dismissed — it means the university is flagging you as needing support. You can recover from this, but you'll need to take specific steps this semester.",
    steps: [
      {
        number: 1,
        label: 'Meet with your academic advisor to review your degree plan and create a recovery strategy.',
      },
      {
        number: 2,
        label: 'Review which courses you can retake to improve your GPA. Grade forgiveness may apply — ask your advisor.',
      },
      {
        number: 3,
        label: 'Find out the minimum GPA you need this semester to return to good standing. Your advisor can calculate this for you.',
      },
      {
        number: 4,
        label: 'Check whether you need to sign a probationary contract with your department.',
      },
      {
        number: 5,
        label: 'If anything is affecting your ability to study — health, work, or family — connect with Student Support Services.',
      },
    ],
    contactScript:
      "Hi, my name is [your name] and I'm a [year, e.g. sophomore] student in [your major]. I just found out I'm on academic probation and I'd like to schedule an appointment to talk through my options and make a recovery plan. Is there availability this week or next?",
    officeId: 'advising',
  },
  {
    id: 'transfer-credit-gap',
    title: 'Transfer Credits Under Review',
    issueType: 'transfer-credit-gap',
    explanation:
      "Some of your transfer credits haven't been fully evaluated yet, or credits you expected to count toward your degree may not apply as planned. This can affect how many units you still need — but in many cases it's fixable through an appeal.",
    steps: [
      {
        number: 1,
        label: "Request your Transfer Credit Evaluation from the Registrar's Office if you haven't received one.",
      },
      {
        number: 2,
        label: 'Identify which courses were not accepted and why — common reasons are unit count, grade, or no matching CSULB course.',
      },
      {
        number: 3,
        label: 'Talk to your academic advisor about alternative courses that could satisfy the same requirement.',
      },
      {
        number: 4,
        label: "If a decision seems wrong, ask the Registrar about the appeal process — you may be able to petition for the credit.",
      },
    ],
    contactScript:
      "Hi, I'm [your name], a transfer student in [your major]. I have some questions about my transfer credit evaluation — some credits I expected to count toward my degree haven't been applied. Can I schedule an appointment to discuss my options and whether I can petition for credit?",
    officeId: 'registrar',
  },
  {
    id: 'course-failure',
    title: 'Course Failure',
    issueType: 'course-failure',
    explanation:
      "You received a failing grade (D or F) in a course. Depending on your major and whether the course is required, this may affect your GPA, your ability to advance in the program, or your enrollment in future courses. Here's how to move forward.",
    steps: [
      {
        number: 1,
        label: 'Check your transcript to confirm the grade — grades are sometimes entered incorrectly. Contact the instructor if you believe there was an error.',
      },
      {
        number: 2,
        label: 'Find out if grade forgiveness applies: CSULB allows you to retake certain courses and replace the grade (once per course, up to 16 units total).',
      },
      {
        number: 3,
        label: 'Determine if the failed course is a prerequisite for anything in your plan — if so, reschedule those courses.',
      },
      {
        number: 4,
        label: 'Talk to your advisor about how this affects your graduation timeline and what to enroll in next semester.',
      },
    ],
    contactScript:
      "Hi, my name is [your name] and I'm a [year] student in [your major]. I received a failing grade in [course name] and I'd like to understand my options — including grade forgiveness and how this might affect my graduation plan. Can I schedule an appointment?",
    officeId: 'advising',
  },
  {
    id: 'sap-warning',
    title: 'Financial Aid SAP Warning',
    issueType: 'sap-warning',
    explanation:
      "You've received a Satisfactory Academic Progress (SAP) warning, which means your academic progress isn't meeting the federal requirements to keep your financial aid. This doesn't mean you've lost aid yet — but you need to act quickly.",
    steps: [
      {
        number: 1,
        label: 'Read your SAP notification carefully — it explains which requirement you failed to meet: GPA, completion rate, or maximum timeframe.',
      },
      {
        number: 2,
        label: 'Contact the Financial Aid Office right away to understand whether you can submit an appeal.',
      },
      {
        number: 3,
        label: "If appealing, you'll need to explain what affected your progress and submit an academic plan — your advisor can help with this.",
      },
      {
        number: 4,
        label: 'Keep attending class and finish the semester — dropping or failing more courses will make the appeal harder.',
      },
    ],
    contactScript:
      "Hi, I'm [your name] and I'm a CSULB student. I received a SAP warning and I'm worried about losing my financial aid. Can I schedule an appointment to understand my options and find out if I'm eligible to appeal?",
    officeId: 'financial-aid',
  },
];
