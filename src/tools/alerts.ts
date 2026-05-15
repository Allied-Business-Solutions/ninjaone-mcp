import { NinjaOneClient } from '../client.js';
import { clean } from '../utils.js';
import { ToolDef } from './types.js';

export const alertTools: ToolDef[] = [
  {
    tool: {
      name: 'ninja_list_alerts',
      description:
        'Get all active alerts across all devices. Filter by source type or device filter expression.',
      inputSchema: {
        type: 'object',
        properties: {
          sourceType: { type: 'string', description: 'Alert source type filter' },
          df: { type: 'string', description: 'Device filter expression' },
          lang: { type: 'string', description: 'Language tag for localized messages (e.g. en)' },
          tz: { type: 'string', description: 'Time zone for timestamps (e.g. America/Chicago)' },
        },
      },
    },
    handler: async (args, client: NinjaOneClient) => client.get('/alerts', clean(args)),
  },
  {
    tool: {
      name: 'ninja_reset_alert',
      description:
        'Reset (dismiss) an alert by its UID. Optionally provide activityData to record a resolution note.',
      inputSchema: {
        type: 'object',
        required: ['uid'],
        properties: {
          uid: { type: 'string', description: 'Alert UID' },
          activityData: {
            type: 'string',
            description: 'Resolution note to attach to the activity log entry',
          },
        },
      },
    },
    handler: async ({ uid, activityData }, client: NinjaOneClient) =>
      activityData
        ? client.post(`/alert/${uid}/reset`, { activityData })
        : client.delete(`/alert/${uid}`),
  },
];
