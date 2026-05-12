export type OfficeContact = {
  id: string;
  name: string;
  phone: string;
  email: string;
  hours: string;
  handles: string[]; // issue keywords
};

export const OFFICE_CONTACTS: OfficeContact[] = [
  {
    id: 'financial-aid',
    name: 'Student Financial Aid Office',
    phone: '(562) 985-4141',
    email: 'financialaid@csulb.edu',
    hours: 'Mon – Fri, 9:00 am to 5:00 pm',
    handles: ['financial-aid', 'fafsa', 'sap', 'loans', 'grants'],
  },
  {
    id: 'registrar',
    name: "Registrar's Office",
    phone: '(562) 985-5471',
    email: 'registrar@csulb.edu',
    hours: 'Mon – Fri, 8:00 am to 5:00 pm',
    handles: ['transfer-credits', 'enrollment', 'transcripts', 'records'],
  },
  {
    id: 'advising',
    name: 'Academic Advising Center',
    phone: '(562) 985-4837',
    email: 'advising@csulb.edu',
    hours: 'Mon – Fri, 8:00 am to 5:00 pm',
    handles: ['academic-plan', 'major', 'graduation', 'prerequisites'],
  },
];
