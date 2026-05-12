import type { Deadline } from '@/types/deadline';
import { SEED_DEADLINES } from '@/data/deadlines';

export type DeadlinesAction =
  | { type: 'SET_STEP_STATUS'; deadlineId: string; stepId: string; status: 'pending' | 'done' | 'in-progress' }
  | { type: 'SAVE_PROGRESS'; deadlineId: string }
  | { type: 'RESET' };

export type DeadlinesState = {
  deadlines: Deadline[];
  savedDeadlineIds: string[];
};

export const initialDeadlinesState: DeadlinesState = {
  deadlines: SEED_DEADLINES,
  savedDeadlineIds: [],
};

export function deadlinesReducer(
  state: DeadlinesState,
  action: DeadlinesAction,
): DeadlinesState {
  switch (action.type) {
    case 'SET_STEP_STATUS':
      return {
        ...state,
        deadlines: state.deadlines.map((d) =>
          d.id !== action.deadlineId
            ? d
            : {
                ...d,
                steps: d.steps.map((s) =>
                  s.id !== action.stepId ? s : { ...s, status: action.status },
                ),
              },
        ),
      };
    case 'SAVE_PROGRESS':
      return {
        ...state,
        savedDeadlineIds: state.savedDeadlineIds.includes(action.deadlineId)
          ? state.savedDeadlineIds
          : [...state.savedDeadlineIds, action.deadlineId],
      };
    case 'RESET':
      return initialDeadlinesState;
    default:
      return state;
  }
}
