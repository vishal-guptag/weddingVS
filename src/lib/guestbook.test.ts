import { describe, expect, it } from 'vitest';
import {
  MESSAGE_MAX,
  MESSAGE_MIN,
  NAME_MAX,
  STORAGE_KEY,
  loadEntries,
  makeEntry,
  sanitize,
  saveEntries,
  validateEntry,
} from './guestbook';

function fakeStorage(initial?: string) {
  const map = new Map<string, string>();
  if (initial !== undefined) map.set(STORAGE_KEY, initial);
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    map,
  };
}

describe('validateEntry', () => {
  it('accepts a normal entry and trims whitespace', () => {
    const r = validateEntry('  Asha  ', '  Wishing you a lifetime of love!  ');
    expect(r.ok).toBe(true);
    expect(r.name).toBe('Asha');
    expect(r.message).toBe('Wishing you a lifetime of love!');
  });

  it('rejects empty name and message', () => {
    const r = validateEntry('   ', '');
    expect(r.ok).toBe(false);
    expect(r.errors.name).toBeTruthy();
    expect(r.errors.message).toBeTruthy();
  });

  it('enforces the name limit', () => {
    expect(validateEntry('a'.repeat(NAME_MAX), 'Congratulations').ok).toBe(true);
    expect(validateEntry('a'.repeat(NAME_MAX + 1), 'Congratulations').errors.name).toMatch(/characters or fewer/);
  });

  it('enforces message min and max', () => {
    expect(validateEntry('A', 'x'.repeat(MESSAGE_MIN - 1)).errors.message).toMatch(/at least/);
    expect(validateEntry('A', 'x'.repeat(MESSAGE_MAX)).ok).toBe(true);
    expect(validateEntry('A', 'x'.repeat(MESSAGE_MAX + 1)).errors.message).toMatch(/characters or fewer/);
  });

  it('treats whitespace-only input as empty', () => {
    expect(validateEntry('A', '     \t  ').errors.message).toBeTruthy();
  });
});

describe('sanitize', () => {
  it('removes control characters and collapses spaces', () => {
    expect(sanitize('a\u0000b\u0007  c')).toBe('ab c');
  });
  it('keeps markup as plain text (escaping is done by React at render time)', () => {
    expect(sanitize('<b>hi</b>')).toBe('<b>hi</b>');
  });
});

describe('storage', () => {
  it('round-trips entries', () => {
    const s = fakeStorage();
    const e = makeEntry('Asha', 'God bless you both', 1000);
    expect(saveEntries([e], s)).toBe(true);
    expect(loadEntries(s)).toEqual([e]);
  });

  it('returns [] for empty, corrupt, or wrong-shape data', () => {
    expect(loadEntries(fakeStorage())).toEqual([]);
    expect(loadEntries(fakeStorage('{not json'))).toEqual([]);
    expect(loadEntries(fakeStorage('{"a":1}'))).toEqual([]);
    expect(loadEntries(fakeStorage('[{"id":1}]'))).toEqual([]);
  });

  it('reports failure when storage is unavailable or throws', () => {
    expect(saveEntries([], null)).toBe(false);
    expect(
      saveEntries([], {
        setItem: () => {
          throw new Error('quota');
        },
      }),
    ).toBe(false);
    expect(loadEntries(null)).toEqual([]);
  });

  it('creates unique ids', () => {
    expect(makeEntry('a', 'bbb').id).not.toBe(makeEntry('a', 'bbb').id);
  });
});
