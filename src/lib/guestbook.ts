export const NAME_MAX = 40;
export const MESSAGE_MAX = 280;
export const MESSAGE_MIN = 3;
export const STORAGE_KEY = 'vs-wedding-guestbook-v1';
export const MAX_ENTRIES = 100;

export interface GuestEntry {
  id: string;
  name: string;
  message: string;
  createdAt: number;
}

export interface ValidationResult {
  ok: boolean;
  errors: { name?: string; message?: string };
  name: string;
  message: string;
}

/** Collapse whitespace and strip control characters. React escapes output; this keeps stored data tidy. */
export function sanitize(input: string): string {
  // eslint-disable-next-line no-control-regex
  return input.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').replace(/[ \t]+/g, ' ').trim();
}

export function validateEntry(rawName: string, rawMessage: string): ValidationResult {
  const name = sanitize(rawName);
  const message = sanitize(rawMessage);
  const errors: ValidationResult['errors'] = {};

  if (!name) errors.name = 'Please enter your name.';
  else if (name.length > NAME_MAX) errors.name = `Name must be ${NAME_MAX} characters or fewer.`;

  if (!message) errors.message = 'Please write a short blessing.';
  else if (message.length < MESSAGE_MIN) errors.message = `Blessing must be at least ${MESSAGE_MIN} characters.`;
  else if (message.length > MESSAGE_MAX) errors.message = `Blessing must be ${MESSAGE_MAX} characters or fewer.`;

  return { ok: Object.keys(errors).length === 0, errors, name, message };
}

function isEntry(v: unknown): v is GuestEntry {
  if (!v || typeof v !== 'object') return false;
  const e = v as Record<string, unknown>;
  return (
    typeof e.id === 'string' &&
    typeof e.name === 'string' &&
    typeof e.message === 'string' &&
    typeof e.createdAt === 'number'
  );
}

export function loadEntries(storage: Pick<Storage, 'getItem'> | null = safeStorage()): GuestEntry[] {
  if (!storage) return [];
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isEntry).slice(0, MAX_ENTRIES) : [];
  } catch {
    return [];
  }
}

/** Returns true when the save succeeded. */
export function saveEntries(
  entries: GuestEntry[],
  storage: Pick<Storage, 'setItem'> | null = safeStorage(),
): boolean {
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
    return true;
  } catch {
    return false;
  }
}

export function makeEntry(name: string, message: string, now: number = Date.now()): GuestEntry {
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${now}-${Math.random().toString(36).slice(2, 10)}`;
  return { id, name, message, createdAt: now };
}

function safeStorage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}
