import chalk from 'chalk';
import { loadData } from '../lib/storage.js';
import { STATUSES, type ApplicationStatus } from '../lib/types.js';

export async function statsCommand(): Promise<void> {
  const data = await loadData();
  const apps = data.applications;
  const total = apps.length;

  if (total === 0) {
    console.log(chalk.dim('No applications yet. Run `jobs add` to log one.'));
    return;
  }

  const byStatus = Object.fromEntries(
    STATUSES.map((s) => [s, 0])
  ) as Record<ApplicationStatus, number>;

  for (const app of apps) {
    byStatus[app.status] = (byStatus[app.status] ?? 0) + 1;
  }

  // Response = anything other than "applied" (no reply) or "ghosted" (no reply ever).
  const noResponseStatuses: ApplicationStatus[] = ['applied', 'ghosted'];
  const responded = total - noResponseStatuses.reduce((sum, s) => sum + byStatus[s], 0);
  const responseRate = ((responded / total) * 100).toFixed(1);

  console.log();
  console.log(chalk.bold('Stats'));
  console.log(`  Total applications: ${chalk.bold(total)}`);
  console.log(`  Response rate: ${chalk.bold(`${responseRate}%`)}`);
  console.log();
  console.log(chalk.bold('Breakdown:'));

  for (const status of STATUSES) {
    const count = byStatus[status];
    if (count === 0) continue;
    const pct = ((count / total) * 100).toFixed(0);
    console.log(
      `  ${status.padEnd(10)} ${chalk.bold(String(count).padStart(3))} (${pct}%)`
    );
  }
  console.log();
}
