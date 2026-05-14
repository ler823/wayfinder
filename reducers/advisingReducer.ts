import type { AdvisingState, AdvisingTopic, PrepSheetItem, FollowUpTask } from '@/types/advising';

export type AdvisingAction =
  | { type: 'SET_TOPICS'; topics: AdvisingTopic[] }
  | { type: 'TOGGLE_TOPIC'; topicId: string }
  | { type: 'ADD_CUSTOM_TOPIC'; label: string }
  | { type: 'REMOVE_TOPIC'; topicId: string }
  | { type: 'BUILD_PREP_SHEET' }
  | { type: 'CLEAR_PREP_SHEET' }
  | { type: 'TOGGLE_PREP_ITEM'; itemId: string }
  | { type: 'UPDATE_PREP_NOTES'; itemId: string; notes: string }
  | { type: 'ADD_FOLLOW_UP'; label: string }
  | { type: 'TOGGLE_FOLLOW_UP'; taskId: string }
  | { type: 'RESET' };

export const initialAdvisingState: AdvisingState = {
  topics: [
    {
      id: 'sys-plan',
      label: 'Confirm semester plan',
      reason: 'You have a saved tentative plan that has not been confirmed with an advisor.',
      source: 'system',
      checked: true,
    },
    {
      id: 'sys-fa',
      label: 'Clarify financial aid renewal requirement',
      reason: 'You have an upcoming financial aid deadline.',
      source: 'system',
      checked: true,
    },
    {
      id: 'sys-grad',
      label: 'Review graduation timeline',
      reason: 'Reviewing your timeline each semester helps you stay on track.',
      source: 'system',
      checked: false,
    },
  ],
  prepSheet: null,
  followUps: [],
};

export function advisingReducer(state: AdvisingState, action: AdvisingAction): AdvisingState {
  switch (action.type) {
    case 'SET_TOPICS':
      return { ...state, topics: action.topics };

    case 'TOGGLE_TOPIC':
      return {
        ...state,
        topics: state.topics.map((t) =>
          t.id === action.topicId ? { ...t, checked: !t.checked } : t,
        ),
      };

    case 'ADD_CUSTOM_TOPIC': {
      const newTopic: AdvisingTopic = {
        id: `user-${Date.now()}`,
        label: action.label,
        reason: 'Added by you.',
        source: 'user',
        checked: true,
      };
      return { ...state, topics: [...state.topics, newTopic] };
    }

    case 'REMOVE_TOPIC':
      return { ...state, topics: state.topics.filter((t) => t.id !== action.topicId) };

    case 'BUILD_PREP_SHEET': {
      const sheet: PrepSheetItem[] = state.topics
        .filter((t) => t.checked)
        .map((t) => ({ id: t.id, label: t.label, notes: '', discussed: false }));
      return { ...state, prepSheet: sheet };
    }

    case 'CLEAR_PREP_SHEET':
      return { ...state, prepSheet: null };

    case 'TOGGLE_PREP_ITEM':
      return {
        ...state,
        prepSheet: state.prepSheet?.map((item) =>
          item.id === action.itemId ? { ...item, discussed: !item.discussed } : item,
        ) ?? null,
      };

    case 'UPDATE_PREP_NOTES':
      return {
        ...state,
        prepSheet: state.prepSheet?.map((item) =>
          item.id === action.itemId ? { ...item, notes: action.notes } : item,
        ) ?? null,
      };

    case 'ADD_FOLLOW_UP': {
      const task: FollowUpTask = {
        id: `fu-${Date.now()}`,
        label: action.label,
        done: false,
        addedAt: new Date().toISOString(),
      };
      return { ...state, followUps: [...state.followUps, task] };
    }

    case 'TOGGLE_FOLLOW_UP':
      return {
        ...state,
        followUps: state.followUps.map((t) =>
          t.id === action.taskId ? { ...t, done: !t.done } : t,
        ),
      };

    case 'RESET':
      return initialAdvisingState;

    default:
      return state;
  }
}
