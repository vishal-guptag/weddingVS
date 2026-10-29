import { describe, expect, it } from 'vitest';
import { getCountdown, pad2 } from './countdown';
import { COUNTDOWN_TARGET_ISO } from '../data/wedding';

const target = new Date(COUNTDOWN_TARGET_ISO).getTime();

describe('countdown target', () => {
  it('is 12 Dec 2026, 7:00 PM IST = 13:30 UTC', () => {
    expect(new Date(target).toISOString()).toBe('2026-12-12T13:30:00.000Z');
  });

  it('renders as 7:00 PM in Asia/Kolkata', () => {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date(target));
    expect(parts).toBe('12/12/2026, 19:00');
  });
});

describe('getCountdown', () => {
  it('splits a known interval into days/hours/minutes/seconds', () => {
    const now = target - ((3 * 24 + 4) * 3600 + 5 * 60 + 6) * 1000;
    expect(getCountdown(COUNTDOWN_TARGET_ISO, now)).toEqual({ days: 3, hours: 4, minutes: 5, seconds: 6, done: false });
  });

  it('accepts a Date as the clock', () => {
    const c = getCountdown(COUNTDOWN_TARGET_ISO, new Date(target - 61_000));
    expect(c).toMatchObject({ days: 0, hours: 0, minutes: 1, seconds: 1, done: false });
  });

  it('shows 0:00:00:01 one second before the target', () => {
    expect(getCountdown(COUNTDOWN_TARGET_ISO, target - 1000)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 1, done: false });
  });

  it('is done exactly at the target', () => {
    expect(getCountdown(COUNTDOWN_TARGET_ISO, target)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0, done: true });
  });

  it('never returns negative values after the target', () => {
    for (const offset of [1, 1000, 86_400_000, 365 * 86_400_000]) {
      const c = getCountdown(COUNTDOWN_TARGET_ISO, target + offset);
      expect(c.done).toBe(true);
      expect([c.days, c.hours, c.minutes, c.seconds].every((n) => n === 0)).toBe(true);
    }
  });

  it('handles an invalid target safely', () => {
    expect(getCountdown('not-a-date', target).done).toBe(true);
  });

  it('gives the same result regardless of viewer timezone (absolute instant)', () => {
    const now = Date.UTC(2026, 11, 10, 13, 30, 0); // 2 days before
    expect(getCountdown(COUNTDOWN_TARGET_ISO, now).days).toBe(2);
  });
});

describe('pad2', () => {
  it('pads single digits', () => {
    expect(pad2(0)).toBe('00');
    expect(pad2(7)).toBe('07');
    expect(pad2(42)).toBe('42');
  });
});
