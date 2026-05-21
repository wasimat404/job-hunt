import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import type { JobTrackerData } from './types.js';

const DATA_DIR = path.join(os.homedir(), '.jobtracker');
const DATA_FILE = path.join(DATA_DIR, 'data.json');

const DEFAULT_DATA: JobTrackerData = {
  applications: [],
  config: { dailyTarget: 6 },
};

async function ensureDataDir(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function loadData(): Promise<JobTrackerData> {
  try {
    const contents = await fs.readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(contents) as Partial<JobTrackerData>;
    return {
      applications: parsed.applications ?? [],
      config: { ...DEFAULT_DATA.config, ...(parsed.config ?? {}) },
    };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      await ensureDataDir();
      await saveData(DEFAULT_DATA);
      return DEFAULT_DATA;
    }
    throw err;
  }
}

export async function saveData(data: JobTrackerData): Promise<void> {
  await ensureDataDir();
  // Atomic write: write to temp file, then rename. Prevents corruption if
  // the process is killed mid-write.
  const tmp = `${DATA_FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf-8');
  await fs.rename(tmp, DATA_FILE);
}

export function getDataFilePath(): string {
  return DATA_FILE;
}
