export type AcademicRecoveryState = {
  savedIssueIds: string[];
  resolvedIssueIds: string[];
};

export type AcademicRecoveryAction =
  | { type: 'SAVE_ISSUE'; issueId: string }
  | { type: 'RESOLVE_ISSUE'; issueId: string }
  | { type: 'RESTORE'; state: AcademicRecoveryState };

export const initialAcademicRecoveryState: AcademicRecoveryState = {
  savedIssueIds: [],
  resolvedIssueIds: [],
};

export function academicRecoveryReducer(
  state: AcademicRecoveryState,
  action: AcademicRecoveryAction,
): AcademicRecoveryState {
  switch (action.type) {
    case 'SAVE_ISSUE':
      if (state.savedIssueIds.includes(action.issueId)) return state;
      return { ...state, savedIssueIds: [...state.savedIssueIds, action.issueId] };
    case 'RESOLVE_ISSUE':
      return {
        ...state,
        savedIssueIds: state.savedIssueIds.filter((id) => id !== action.issueId),
        resolvedIssueIds: state.resolvedIssueIds.includes(action.issueId)
          ? state.resolvedIssueIds
          : [...state.resolvedIssueIds, action.issueId],
      };
    case 'RESTORE':
      return action.state;
    default:
      return state;
  }
}
