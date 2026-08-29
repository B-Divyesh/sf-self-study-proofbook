import type { Attempt, AttemptStatus, ProofbookState, Revision, Topic } from './types';

const statuses = new Set<AttemptStatus>(['working', 'revised', 'mastered']);
const MAX_ID_LENGTH = 160;
const MAX_NOTES_LENGTH = 100_000;

export class ArchiveValidationError extends Error {
  constructor(detail: string) {
    super(`This archive is invalid (${detail}). Your current proofbook was not changed.`);
    this.name = 'ArchiveValidationError';
  }
}

function record(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function text(value: unknown, label: string, minimum = 0, maximum = MAX_NOTES_LENGTH): string {
  if (typeof value !== 'string' || value.length < minimum || value.length > maximum) {
    throw new ArchiveValidationError(`${label} must be text between ${minimum} and ${maximum} characters`);
  }
  return value;
}

function id(value: unknown, label: string): string {
  const result = text(value, label, 1, MAX_ID_LENGTH);
  if (!result.trim()) throw new ArchiveValidationError(`${label} cannot be blank`);
  return result;
}

function timestamp(value: unknown, label: string): string {
  const result = text(value, label, 1, 64);
  if (!Number.isFinite(Date.parse(result))) throw new ArchiveValidationError(`${label} must be a valid date`);
  return result;
}

function url(value: unknown, label: string): string {
  const result = text(value, label, 0, 2_048);
  if (!result) return result;
  try {
    const parsed = new URL(result);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') throw new Error();
    return result;
  } catch {
    throw new ArchiveValidationError(`${label} must be an http or https URL`);
  }
}

function wholeNumber(value: unknown, label: string, minimum: number, maximum: number): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < minimum || value > maximum) {
    throw new ArchiveValidationError(`${label} must be a whole number from ${minimum} to ${maximum}`);
  }
  return value;
}

function topic(value: unknown, index: number): Topic {
  const item = record(value);
  if (!item) throw new ArchiveValidationError(`topic ${index + 1} must be an object`);
  return {
    id: id(item.id, `topic ${index + 1} id`),
    name: text(item.name, `topic ${index + 1} name`, 1, 60),
    goal: text(item.goal, `topic ${index + 1} goal`, 0, 140),
  };
}

function revision(value: unknown, attemptIndex: number, index: number): Revision {
  const item = record(value);
  if (!item) throw new ArchiveValidationError(`attempt ${attemptIndex + 1} revision ${index + 1} must be an object`);
  return {
    id: id(item.id, `attempt ${attemptIndex + 1} revision ${index + 1} id`),
    at: timestamp(item.at, `attempt ${attemptIndex + 1} revision ${index + 1} date`),
    solution: text(item.solution, `attempt ${attemptIndex + 1} revision ${index + 1} solution`),
    reflection: text(item.reflection, `attempt ${attemptIndex + 1} revision ${index + 1} reflection`),
  };
}

function attempt(value: unknown, index: number): Attempt {
  const item = record(value);
  if (!item) throw new ArchiveValidationError(`attempt ${index + 1} must be an object`);
  if (!Array.isArray(item.revisions)) throw new ArchiveValidationError(`attempt ${index + 1} revisions must be a list`);
  if (!statuses.has(item.status as AttemptStatus)) throw new ArchiveValidationError(`attempt ${index + 1} has an unknown evidence status`);
  const timerStartedAt = item.timerStartedAt === null ? null : timestamp(item.timerStartedAt, `attempt ${index + 1} timer start`);
  const revisions = item.revisions.map((entry, revisionIndex) => revision(entry, index, revisionIndex));
  const revisionIds = new Set(revisions.map((entry) => entry.id));
  if (revisionIds.size !== revisions.length) throw new ArchiveValidationError(`attempt ${index + 1} has duplicate revision ids`);
  return {
    id: id(item.id, `attempt ${index + 1} id`),
    topicId: id(item.topicId, `attempt ${index + 1} topic id`),
    title: text(item.title, `attempt ${index + 1} title`, 1, 100),
    source: text(item.source, `attempt ${index + 1} source`, 1, 120),
    sourceUrl: url(item.sourceUrl, `attempt ${index + 1} source link`),
    problemRef: text(item.problemRef, `attempt ${index + 1} problem reference`, 1, 100),
    startedAt: timestamp(item.startedAt, `attempt ${index + 1} start date`),
    elapsedSeconds: wholeNumber(item.elapsedSeconds, `attempt ${index + 1} elapsed seconds`, 0, 31_536_000),
    timerStartedAt,
    status: item.status as AttemptStatus,
    confidence: wholeNumber(item.confidence, `attempt ${index + 1} confidence`, 1, 4) as 1 | 2 | 3 | 4,
    solution: text(item.solution, `attempt ${index + 1} solution`),
    reflection: text(item.reflection, `attempt ${index + 1} reflection`),
    revisions,
    createdAt: timestamp(item.createdAt, `attempt ${index + 1} creation date`),
    updatedAt: timestamp(item.updatedAt, `attempt ${index + 1} update date`),
  };
}

/** Validates an imported archive before any confirmation or IndexedDB write. */
export function validateArchive(value: unknown): ProofbookState {
  const archive = record(value);
  if (!archive || !Array.isArray(archive.topics) || !Array.isArray(archive.attempts)) {
    throw new ArchiveValidationError('it needs topics and attempts lists');
  }
  const topics = archive.topics.map(topic);
  const topicIds = new Set(topics.map((entry) => entry.id));
  if (topicIds.size !== topics.length) throw new ArchiveValidationError('it has duplicate topic ids');
  const attempts = archive.attempts.map(attempt);
  const attemptIds = new Set(attempts.map((entry) => entry.id));
  if (attemptIds.size !== attempts.length) throw new ArchiveValidationError('it has duplicate attempt ids');
  for (const entry of attempts) {
    if (!topicIds.has(entry.topicId)) throw new ArchiveValidationError(`attempt “${entry.title}” points to a missing topic`);
  }
  if (archive.selectedAttemptId !== null && (typeof archive.selectedAttemptId !== 'string' || !attemptIds.has(archive.selectedAttemptId))) {
    throw new ArchiveValidationError('its selected attempt does not exist');
  }
  return {
    topics,
    attempts,
    selectedAttemptId: archive.selectedAttemptId as string | null,
    updatedAt: timestamp(archive.updatedAt, 'archive update date'),
  };
}
