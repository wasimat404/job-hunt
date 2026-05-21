import Table from 'cli-table3';
import chalk, { type ChalkInstance } from 'chalk';
import { loadData } from '../lib/storage.js';
import type { ApplicationStatus } from '../lib/types.js';

const STATUS_COLORS: Record<ApplicationStatus, ChalkInstance> = {
  applied: chalk.blue,
  screening: chalk.cyan,
  interview: chalk.yellow,
  offer: chalk.green,
  rejected: chalk.red,
  ghosted: chalk.gray,
};

interface ListOptions {
  status?: ApplicationStatus;
  limit?: string;
}

export async function listCommand(options: ListOptions): Promise<void> {
  const data = await loadData();

  let apps = [...data.applications].sort(
    (a, b) =>
      new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
  );

  if (options.status) {
    apps = apps.filter((a) => a.status === options.status);
  }

  const limit = options.limit ? Math.max(1, parseInt(options.limit, 10)) : 20;
  const displayed = apps.slice(0, limit);

  if (displayed.length === 0) {
    console.log(chalk.dim('No applications found.'));
    return;
  }

  const table = new Table({
    head: ['ID', 'Date', 'Company', 'Role', 'Status', 'Source'].map((h) =>
      chalk.bold(h)
    ),
    style: { head: [], border: ['gray'] },
  });

  for (const app of displayed) {
    const date = new Date(app.appliedAt).toLocaleDateString();
    const colorize = STATUS_COLORS[app.status] ?? chalk.white;
    table.push([
      chalk.dim(app.id),
      date,
      app.company,
      app.role,
      colorize(app.status),
      app.source ?? '',
    ]);
  }

  console.log(table.toString());
  console.log(
    chalk.dim(`Showing ${displayed.length} of ${data.applications.length} total`)
  );
}
