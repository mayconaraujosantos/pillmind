import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@pillmind/postponed-doses/v1';

export interface PostponedDoseRecord {
  medicineId: string;
  scheduledTime: string;
  dateKey: string;
  postponedUntil: string;
  notificationId?: string;
}

function todayDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function buildDoseKey(medicineId: string, scheduledTime: string, dateKey: string): string {
  return `${medicineId}::${scheduledTime}::${dateKey}`;
}

async function readAll(): Promise<Record<string, PostponedDoseRecord>> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as Record<string, PostponedDoseRecord>;
    return parsed ?? {};
  } catch {
    return {};
  }
}

async function writeAll(data: Record<string, PostponedDoseRecord>): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function getTodayPostponedDoses(
  date: Date = new Date()
): Promise<PostponedDoseRecord[]> {
  const dateKey = todayDateKey(date);
  const all = await readAll();
  const now = new Date();

  const activeEntries = Object.values(all).filter((entry) => {
    if (entry.dateKey !== dateKey) return false;
    return new Date(entry.postponedUntil).getTime() > now.getTime();
  });

  const cleanedEntries = Object.fromEntries(
    Object.entries(all).filter(([, entry]) => {
      if (entry.dateKey !== dateKey) return false;
      return new Date(entry.postponedUntil).getTime() > now.getTime();
    })
  );

  if (Object.keys(cleanedEntries).length !== Object.keys(all).length) {
    await writeAll(cleanedEntries);
  }

  return activeEntries;
}

export async function upsertTodayPostponedDose(
  medicineId: string,
  scheduledTime: string,
  postponedUntil: Date,
  notificationId?: string
): Promise<void> {
  const dateKey = todayDateKey();
  const all = await readAll();
  const key = buildDoseKey(medicineId, scheduledTime, dateKey);
  all[key] = {
    medicineId,
    scheduledTime,
    dateKey,
    postponedUntil: postponedUntil.toISOString(),
    notificationId,
  };
  await writeAll(all);
}

export async function clearTodayPostponedDose(
  medicineId: string,
  scheduledTime: string,
  date: Date = new Date()
): Promise<PostponedDoseRecord | null> {
  const dateKey = todayDateKey(date);
  const all = await readAll();
  const key = buildDoseKey(medicineId, scheduledTime, dateKey);
  const existing = all[key] ?? null;
  if (existing) {
    delete all[key];
    await writeAll(all);
  }
  return existing;
}
