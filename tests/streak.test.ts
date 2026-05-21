import { describe, it, expect } from 'vitest';
import { calculateStreak } from '../src/lib/streak.js';
import type { Application } from '../src/lib/types.js';

function makeApp(date: string, suffix = '0'): Application {
  return {
    id: `${date}-${suffix}`,
    company: 'TestCo',
    role: 'SRE',
    status: 'applied',
    appliedAt: `${date}T10:00:00.000Z`,
    updatedAt: `${date}T10:00:00.000Z`,
  };
}

describe('calculateStreak', () => {
  it('returns zeros for empty input', () => {
    const result = calculateStreak([]);
    expect(result.current).toBe(0);
    expect(result.longest).toBe(0);
    expect(result.todayCount).toBe(0);
    expect(result.daysActive).toBe(0);
  });

  it('counts multiple applications on the same day', () => {
    const today = new Date('2026-05-22T12:00:00Z');
    const apps = [
      makeApp('2026-05-22', '1'),
      makeApp('2026-05-22', '2'),
      makeApp('2026-05-22', '3'),
    ];
    const result = calculateStreak(apps, today);
    expect(result.todayCount).toBe(3);
    expect(result.daysActive).toBe(1);
    expect(result.current).toBe(1);
  });

  it('detects a 3-day current streak ending today', () => {
    const today = new Date('2026-05-22T12:00:00Z');
    const apps = [
      makeApp('2026-05-20'),
      makeApp('2026-05-21'),
      makeApp('2026-05-22'),
    ];
    const result = calculateStreak(apps, today);
    expect(result.current).toBe(3);
    expect(result.longest).toBe(3);
  });

  it('keeps the streak alive when nothing logged today yet', () => {
    const today = new Date('2026-05-22T12:00:00Z');
    const apps = [makeApp('2026-05-20'), makeApp('2026-05-21')];
    const result = calculateStreak(apps, today);
    expect(result.current).toBe(2);
    expect(result.todayCount).toBe(0);
  });

  it('breaks the current streak when yesterday was skipped', () => {
    const today = new Date('2026-05-22T12:00:00Z');
    const apps = [
      makeApp('2026-05-19'),
      makeApp('2026-05-20'),
      // 21st skipped
      makeApp('2026-05-22'),
    ];
    const result = calculateStreak(apps, today);
    expect(result.current).toBe(1);
    expect(result.longest).toBe(2);
  });

  it('returns 0 current when the most recent app is older than yesterday', () => {
    const today = new Date('2026-05-22T12:00:00Z');
    const apps = [makeApp('2026-05-18'), makeApp('2026-05-19')];
    const result = calculateStreak(apps, today);
    expect(result.current).toBe(0);
    expect(result.longest).toBe(2);
  });

  it('finds the longest streak correctly when there are multiple runs', () => {
    const today = new Date('2026-06-01T12:00:00Z');
    const apps = [
      makeApp('2026-05-10'),
      makeApp('2026-05-11'),
      makeApp('2026-05-12'),
      makeApp('2026-05-13'), // 4-day run
      makeApp('2026-05-20'),
      makeApp('2026-05-21'), // 2-day run
    ];
    const result = calculateStreak(apps, today);
    expect(result.longest).toBe(4);
    expect(result.current).toBe(0);
  });
});
