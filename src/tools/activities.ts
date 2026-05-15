import { NinjaOneClient } from '../client.js';
import { clean } from '../utils.js';
import { ToolDef } from './types.js';

export const activityTools: ToolDef[] = [
  {
    tool: {
      name: 'ninja_list_activities',
      description:
        'Get the system activity log. Filter by class (SYSTEM/DEVICE/USER), date range, type, status, user, or device.',
      inputSchema: {
        type: 'object',
        properties: {
          class: {
            type: 'string',
            enum: ['SYSTEM', 'DEVICE', 'USER', 'ALL'],
            description: 'Activity class filter (default: ALL)',
          },
          before: {
            type: 'string',
            description: 'Return activities before this date/time (ISO 8601)',
          },
          after: {
            type: 'string',
            description: 'Return activities after this date/time (ISO 8601)',
          },
          olderThan: {
            type: 'number',
            description: 'Return activities with ID older than this value (pagination)',
          },
          newerThan: {
            type: 'number',
            description: 'Return activities with ID newer than this value (pagination)',
          },
          type: { type: 'string', description: 'Activity type filter' },
          status: { type: 'string', description: 'Activity status filter' },
          user: { type: 'string', description: 'Filter by technician username' },
          seriesUid: {
            type: 'string',
            description: 'Return activities related to a specific alert series UID',
          },
          df: { type: 'string', description: 'Device filter expression' },
          pageSize: { type: 'number', description: 'Max results to return (10–1000, default 200)' },
          lang: { type: 'string', description: 'Language tag (e.g. en)' },
          tz: { type: 'string', description: 'Time zone tag (e.g. America/Chicago)' },
        },
      },
    },
    handler: async (args, client: NinjaOneClient) => client.get('/activities', clean(args)),
  },
];
