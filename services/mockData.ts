
import { Procedure } from '../types';

export const CATEGORIES = [
  'Compliance', 'Risk Assessment', 'Client Onboarding', 'Internal Audit', 'Operations', 'Tax Reporting'
];

export const MANAGERS = [
  'Sarah Jenkins', 'Michael Chen', 'Elena Rodriguez', 'David Smith', 'Jessica Wu'
];

export const STATUSES = ['Active', 'In Review', 'Draft', 'Archived'];

export interface ExtendedProcedure extends Procedure {
  status: string;
  lastUpdated: string;
  completion: number;
}

export const generateProcedures = (count: number): ExtendedProcedure[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `proc-${i}`,
    title: `${CATEGORIES[i % CATEGORIES.length]} Protocol v${(i % 5) + 1}.2`,
    accountName: `Global Enterprise ${100 + i}`,
    cid: `CID-${2000 + i}`,
    pid: `PID-${5000 + i}`,
    sid: `SID-${8000 + i}`,
    category: CATEGORIES[i % CATEGORIES.length],
    relationshipManager: MANAGERS[i % MANAGERS.length],
    status: STATUSES[i % STATUSES.length],
    lastUpdated: new Date(2024, 0, 1 + (i % 30)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    completion: 45 + (i % 55),
    snippet: `This procedure outlines the necessary steps for handling ${CATEGORIES[i % CATEGORIES.length].toLowerCase()} within the account structure. It includes validation of CID ${2000 + i} and mapping to SID ${8000 + i}. Ensure all stakeholders are notified.`
  }));
};
