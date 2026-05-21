import chalk from 'chalk';
import { loadData } from '../lib/storage.js';
import { calculateStreak } from '../lib/streak.js';

const BAR_WIDTH = 24;

export async function todayCommand(): Promise<void> {
  const data = await loadData();
  const stats = calculateStreak(data.applications);
  const target = data.config.dailyTarget;
  const ratio = target === 0 ? 1 : stats.todayCount / target;
  const pct = Math.min(100, Math.round(ratio * 100));

  const filled = Math.min(BAR_WIDTH, Math.round(ratio * BAR_WIDTH));
  const bar = '█'.repeat(filled) + '░'.repeat(BAR_WIDTH - filled);

  const color =
    stats.todayCount >= target
      ? chalk.green
      : stats.todayCount > 0
        ? chalk.yellow
        : chalk.red;

  console.log();
  console.log(chalk.bold('Today'));
  console.log(`  ${color(bar)}  ${stats.todayCount}/${target}  (${pct}%)`);
  console.log();

  if (stats.todayCount >= target) {
    console.log(chalk.green('✓ Target hit. Keep the streak going tomorrow.'));
  } else {
    const remaining = target - stats.todayCount;
    console.log(
      chalk.yellow(
        `${remaining} more to hit today's target. Current streak: ${stats.current}d.`
      )
    );
  }
  console.log();
}
