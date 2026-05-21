import inquirer from 'inquirer';
import chalk from 'chalk';
import { nanoid } from 'nanoid';
import { loadData, saveData } from '../lib/storage.js';
import { STATUSES, type Application } from '../lib/types.js';

interface AddAnswers {
  company: string;
  role: string;
  url: string;
  source: string;
  status: Application['status'];
  notes: string;
}

const SOURCES = [
  'LinkedIn',
  'Company site',
  'Referral',
  'Wellfound',
  'Indeed',
  'Hacker News',
  'Other',
];

export async function addCommand(): Promise<void> {
  const answers = await inquirer.prompt<AddAnswers>([
    {
      name: 'company',
      message: 'Company:',
      type: 'input',
      validate: (v: string) => v.trim().length > 0 || 'Required',
    },
    {
      name: 'role',
      message: 'Role:',
      type: 'input',
      validate: (v: string) => v.trim().length > 0 || 'Required',
    },
    { name: 'url', message: 'Job posting URL (optional):', type: 'input' },
    {
      name: 'source',
      message: 'Source:',
      type: 'list',
      choices: SOURCES,
    },
    {
      name: 'status',
      message: 'Status:',
      type: 'list',
      choices: STATUSES,
      default: 'applied',
    },
    { name: 'notes', message: 'Notes (optional):', type: 'input' },
  ]);

  const data = await loadData();
  const now = new Date().toISOString();
  const application: Application = {
    id: nanoid(8),
    company: answers.company.trim(),
    role: answers.role.trim(),
    url: answers.url.trim() || undefined,
    source: answers.source,
    status: answers.status,
    notes: answers.notes.trim() || undefined,
    appliedAt: now,
    updatedAt: now,
  };

  data.applications.push(application);
  await saveData(data);

  console.log(
    chalk.green(`\n✓ Logged: ${application.role} @ ${application.company}`)
  );
  console.log(chalk.dim(`  ID: ${application.id}`));
}
