import type { Application } from './types.js';

export interface StreakStats {
  current: number;
  longest: number;
  todayCount: number;
  daysActive: number;
}

/**
 * Returns YYYY-MM-DD for the given Date in UTC.
 * Using UTC keeps streak calculations consistent across timezones.
 */
function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function subtractDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() - days);
  return next;
}

function groupByDay(apps: Application[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const app of apps) {
    const day = app.appliedAt.slice(0, 10);
    map.set(day, (map.get(day) ?? 0) + 1);
  }
  return map;
}

/**
 * Calculate streak statistics for a list of applications.
 *
 * A day "counts" toward a streak if at least one application was logged.
 * The current streak walks backward from today (or yesterday if nothing
 * logged today yet — the day isn't over).
 */
export function calculateStreak(
  apps: Application[],
  today: Date = new Date()
): StreakStats {
  const byDay = groupByDay(apps);
  const todayStr = dateKey(today);
  const todayCount = byDay.get(todayStr) ?? 0;

  // --- current streak ---
  let current = 0;
  let cursor = todayCount > 0 ? today : subtractDays(today, 1);
  while (byDay.has(dateKey(cursor))) {
    current += 1;
    cursor = subtractDays(cursor, 1);
  }

  // --- longest streak ---
  const sortedDays = Array.from(byDay.keys()).sort();
  let longest = 0;
  let run = 0;
  let prev: string | null = null;

  for (const day of sortedDays) {
    if (prev === null) {
      run = 1;
    } else {
      const prevDate = new Date(`${prev}T00:00:00.000Z`);
      const expected = dateKey(
        new Date(prevDate.getTime() + 24 * 60 * 60 * 1000)
      );
      run = day === expected ? run + 1 : 1;
    }
    if (run > longest) longest = run;
    prev = day;
  }

  return {
    current,
    longest,
    todayCount,
    daysActive: byDay.size,
  };
}
