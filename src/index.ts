#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { addCommand } from './commands/add.js';
import { listCommand } from './commands/list.js';
import { todayCommand } from './commands/today.js';
import { streakCommand } from './commands/streak.js';
import { updateCommand } from './commands/update.js';
import { statsCommand } from './commands/stats.js';

const program = new Command();

program
  .name('jobhunt')
  .description('Track job applications, daily targets, and streaks.')
  .version('0.1.0');

program
  .command('add')
  .description('Log a new application (interactive).')
  .action(addCommand);

program
  .command('list')
  .description('Show recent applications.')
  .option('-s, --status <status>', 'Filter by status')
  .option('-n, --limit <number>', 'Limit number of results', '20')
  .action(listCommand);

program
  .command('today')
  .description("Show today's progress against your daily target.")
  .action(todayCommand);

program
  .command('streak')
  .description('Show current and longest streaks.')
  .action(streakCommand);

program
  .command('update <id>')
  .description('Update status or notes for an existing application.')
  .action(updateCommand);

program
  .command('stats')
  .description('Show aggregate statistics and response rate.')
  .action(statsCommand);

program.parseAsync(process.argv).catch((err: unknown) => {
  console.error(chalk.red('Error:'), err instanceof Error ? err.message : err);
  process.exit(1);
});
