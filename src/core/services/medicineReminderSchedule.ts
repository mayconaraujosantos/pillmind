import type { Medicine } from '@features/home/domain/entities/Medicine';

const MAX_SCHEDULED_OCCURRENCES = 60;
const DEFAULT_ROLLING_WINDOW_DAYS = 30;
const MINIMUM_FUTURE_BUFFER_MS = 60 * 1000;

export interface ParsedPrescriptionFrequency {
  intervalHours?: number;
  durationDays?: number;
}

function normalizeTimeToken(token: string): string | null {
  const match = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(token.trim());
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return null;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999
  );
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

function combineDateAndTime(date: Date, normalizedTime: string): Date {
  const [hour, minute] = normalizedTime.split(':').map(Number);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hour,
    minute,
    0,
    0
  );
}

export function parsePrescriptionFrequency(
  frequency: string
): ParsedPrescriptionFrequency {
  const normalized = frequency.trim().toLowerCase();

  const intervalPatterns = [
    /(\d{1,2})\s*\/\s*(\d{1,2})\s*h(?:oras?)?/,
    /a\s*cada\s*(\d{1,2})\s*h(?:oras?)?/,
    /(\d{1,2})\s*em\s*(\d{1,2})\s*h(?:oras?)?/,
    /q(\d{1,2})h/,
  ];

  let intervalHours: number | undefined;

  for (const pattern of intervalPatterns) {
    const match = pattern.exec(normalized);
    if (!match) continue;

    const left = Number(match[1]);
    const maybeRight = match[2];
    const right = maybeRight == null ? left : Number(maybeRight);
    const candidate = Number.isFinite(right) && right > 0 ? right : left;
    if (candidate > 0) {
      intervalHours = candidate;
      break;
    }
  }

  const durationPatterns = [
    /durante\s+(\d+)\s*dias?/,
    /por\s+(\d+)\s*dias?/,
    /x\s*(\d+)\s*dias?/,
  ];

  let durationDays: number | undefined;

  for (const pattern of durationPatterns) {
    const match = pattern.exec(normalized);
    if (!match) continue;

    const candidate = Number(match[1]);
    if (candidate > 0) {
      durationDays = candidate;
      break;
    }
  }

  return { intervalHours, durationDays };
}

function resolveScheduleEnd(
  medicine: Medicine,
  parsed: ParsedPrescriptionFrequency,
  now: Date
): Date {
  if (medicine.endDate) {
    return endOfDay(medicine.endDate);
  }

  if (parsed.durationDays != null) {
    return endOfDay(
      addDays(startOfDay(medicine.startDate), parsed.durationDays - 1)
    );
  }

  return endOfDay(addDays(now, DEFAULT_ROLLING_WINDOW_DAYS));
}

function buildIntervalOccurrences(
  medicine: Medicine,
  intervalHours: number,
  scheduleEnd: Date,
  scheduleStart: Date
): Date[] {
  const anchorTime = normalizeTimeToken(medicine.times[0] ?? '');
  if (!anchorTime) return [];

  let current = combineDateAndTime(startOfDay(medicine.startDate), anchorTime);
  const occurrences: Date[] = [];

  while (current < scheduleStart) {
    current = addHours(current, intervalHours);
  }

  while (
    current <= scheduleEnd &&
    occurrences.length < MAX_SCHEDULED_OCCURRENCES
  ) {
    occurrences.push(current);
    current = addHours(current, intervalHours);
  }

  return occurrences;
}

function buildFixedTimeOccurrences(
  medicine: Medicine,
  scheduleEnd: Date,
  scheduleStart: Date
): Date[] {
  const times = (medicine.times ?? [])
    .map(normalizeTimeToken)
    .filter((value): value is string => value != null)
    .sort();

  if (times.length === 0) return [];

  const occurrences: Date[] = [];
  let cursor = startOfDay(medicine.startDate);

  while (
    cursor <= scheduleEnd &&
    occurrences.length < MAX_SCHEDULED_OCCURRENCES
  ) {
    for (const time of times) {
      const occurrence = combineDateAndTime(cursor, time);
      if (occurrence >= scheduleStart && occurrence <= scheduleEnd) {
        occurrences.push(occurrence);
      }
      if (occurrences.length >= MAX_SCHEDULED_OCCURRENCES) {
        break;
      }
    }

    cursor = addDays(cursor, 1);
  }

  return occurrences;
}

export function computeMedicineReminderOccurrences(
  medicine: Medicine,
  now: Date = new Date()
): Date[] {
  if (medicine.reminderOnEmpty === false) return [];

  const parsed = parsePrescriptionFrequency(medicine.frequency);
  const scheduleStart = new Date(now.getTime() + MINIMUM_FUTURE_BUFFER_MS);
  const scheduleEnd = resolveScheduleEnd(medicine, parsed, now);

  if (scheduleEnd < scheduleStart) {
    return [];
  }

  if (parsed.intervalHours != null && medicine.times.length === 1) {
    return buildIntervalOccurrences(
      medicine,
      parsed.intervalHours,
      scheduleEnd,
      scheduleStart
    );
  }

  return buildFixedTimeOccurrences(medicine, scheduleEnd, scheduleStart);
}

export const medicineReminderScheduleConstants = {
  MAX_SCHEDULED_OCCURRENCES,
  DEFAULT_ROLLING_WINDOW_DAYS,
};
