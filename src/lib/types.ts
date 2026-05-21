export type ApplicationStatus =
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'ghosted';

export interface Application {
  id: string;
  company: string;
  role: string;
  url?: string;
  source?: string;
  status: ApplicationStatus;
  notes?: string;
  appliedAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface Config {
  dailyTarget: number;
}

export interface JobTrackerData {
  applications: Application[];
  config: Config;
}

export const STATUSES: ApplicationStatus[] = [
  'applied',
  'screening',
  'interview',
  'offer',
  'rejected',
  'ghosted',
];
