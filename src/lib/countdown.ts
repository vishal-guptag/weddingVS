export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** True once the target moment has been reached or passed. */
  done: boolean;
}

/**
 * Pure countdown calculation. `now` is injectable so the logic is fully testable.
 * The target is an absolute instant (ISO string with explicit +05:30 offset),
 * so the result is identical in every viewer's timezone. Never returns negatives.
 */
export function getCountdown(targetIso: string, now: number | Date = Date.now()): CountdownParts {
  const target = new Date(targetIso).getTime();
  const current = now instanceof Date ? now.getTime() : now;
  const diff = target - current;

  if (!Number.isFinite(diff) || diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }

  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    done: false,
  };
}

export const pad2 = (n: number): string => String(n).padStart(2, '0');
