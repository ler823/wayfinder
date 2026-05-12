export type TopicSource = 'system' | 'user';

export type AdvisingTopic = {
  id: string;
  label: string;
  reason: string; // why it was surfaced
  source: TopicSource;
  checked: boolean;
};

export type PrepSheetItem = {
  id: string;
  label: string;
  notes: string;
  discussed: boolean;
};

export type FollowUpTask = {
  id: string;
  label: string;
  done: boolean;
  addedAt: string;
};

export type AdvisingState = {
  topics: AdvisingTopic[];
  prepSheet: PrepSheetItem[] | null;
  followUps: FollowUpTask[];
};
