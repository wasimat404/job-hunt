import inquirer from 'inquirer';
import chalk from 'chalk';
import { loadData, saveData } from '../lib/storage.js';
import { STATUSES, type ApplicationStatus } from '../lib/types.js';

interface UpdateAnswers {
  status: ApplicationStatus;
  notes: string;
}

export async function updateCommand(id: string): Promise<void> {
  const data = await loadData();
  const app = data.applications.find((a) => a.id === id);

  if (!app) {
    console.log(chalk.red(`No application found with ID: ${id}`));
    console.log(chalk.dim('Run `jobs list` to see IDs.'));
    process.exitCode = 1;
    return;
  }

  console.log(
    chalk.dim(`Current: ${app.role} @ ${app.company} [${app.status}]`)
  );

  const answers = await inquirer.prompt<UpdateAnswers>([
    {
      name: 'status',
      message: 'New status:',
      type: 'list',
      choices: STATUSES,
      default: app.status,
    },
    {
      name: 'notes',
      message: 'Notes (leave blank to keep current):',
      type: 'input',
      default: app.notes ?? '',
    },
  ]);

  app.status = answers.status;
  app.notes = answers.notes.trim() || undefined;
  app.updatedAt = new Date().toISOString();

  await saveData(data);
  console.log(
    chalk.green(`✓ Updated ${app.id} → ${app.status}`)
  );
}
