export type AttemptStatus = 'working' | 'revised' | 'mastered';

export interface Revision {
  id: string;
  at: string;
  solution: string;
  reflection: string;
}

export interface Attempt {
  id: string;
  topicId: string;
  title: string;
  source: string;
  sourceUrl: string;
  problemRef: string;
  startedAt: string;
  elapsedSeconds: number;
  timerStartedAt: string | null;
  status: AttemptStatus;
  confidence: 1 | 2 | 3 | 4;
  solution: string;
  reflection: string;
  revisions: Revision[];
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  name: string;
  goal: string;
}

export interface ProofbookState {
  topics: Topic[];
  attempts: Attempt[];
  selectedAttemptId: string | null;
  updatedAt: string;
}

export interface LicenseState {
  token: string;
  valid: boolean;
  checkedAt: number;
}
