export type DeadlineCategory = 'financial-aid' | 'academic' | 'registration' | 'advising';

export type ChecklistStep = {
  id: string;
  label: string;
  status: 'pending' | 'done' | 'in-progress';
};

export type Deadline = {
  id: string;
  title: string;
  category: DeadlineCategory;
  dueDate: string; // ISO date string
  consequence: string;
  steps: ChecklistStep[];
  officeId: string;
};
