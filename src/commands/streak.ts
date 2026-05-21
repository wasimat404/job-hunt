import chalk from 'chalk';
import { loadData } from '../lib/storage.js';
import { calculateStreak } from '../lib/streak.js';

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

export async function streakCommand(): Promise<void> {
  const data = await loadData();
  const stats = calculateStreak(data.applications);

  console.log();
  console.log(chalk.bold('Streak'));
  console.log(
    `  ${chalk.red('🔥')} Current: ${chalk.bold(plural(stats.current, 'day'))}`
  );
  console.log(
    `  ${chalk.yellow('🏆')} Longest: ${chalk.bold(plural(stats.longest, 'day'))}`
  );
  console.log(
    `  ${chalk.cyan('📅')} Active days: ${chalk.bold(stats.daysActive)}`
  );

  if (stats.current === 0 && data.applications.length > 0) {
    console.log();
    console.log(chalk.dim('Streak broken. Log one today to start fresh.'));
  }
  console.log();
}
