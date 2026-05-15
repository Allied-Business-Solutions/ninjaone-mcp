import { activityTools } from './activities.js';
import { alertTools } from './alerts.js';
import { backupTools } from './backup.js';
import { deviceTools } from './devices.js';
import { organizationTools } from './organizations.js';
import { policyTools } from './policies.js';
import { queryTools } from './queries.js';
import { systemTools } from './system.js';
import { ticketingTools } from './ticketing.js';
import { userTools } from './users.js';
export type { ToolDef } from './types.js';

export const ALL_TOOLS = [
  ...deviceTools,
  ...organizationTools,
  ...alertTools,
  ...activityTools,
  ...ticketingTools,
  ...queryTools,
  ...policyTools,
  ...userTools,
  ...backupTools,
  ...systemTools,
];
