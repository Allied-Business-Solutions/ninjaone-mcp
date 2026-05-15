import { NinjaOneClient } from '../client.js';
import { clean } from '../utils.js';
import { ToolDef } from './types.js';

export const backupTools: ToolDef[] = [
  {
    tool: {
      name: 'ninja_get_backup_jobs',
      description: 'Get backup job history and status across managed devices.',
      inputSchema: {
        type: 'object',
        properties: {
          df: { type: 'string', description: 'Device filter expression' },
          pageSize: { type: 'number', description: 'Max results to return' },
          cursor: { type: 'string', description: 'Pagination cursor from previous response' },
        },
      },
    },
    handler: async (args, client: NinjaOneClient) =>
      client.get('/backup/jobs', clean(args)),
  },
  {
    tool: {
      name: 'ninja_get_integrity_check_jobs',
      description: 'Get backup integrity check job results.',
      inputSchema: {
        type: 'object',
        properties: {
          df: { type: 'string', description: 'Device filter expression' },
          pageSize: { type: 'number', description: 'Max results to return' },
          cursor: { type: 'string', description: 'Pagination cursor from previous response' },
        },
      },
    },
    handler: async (args, client: NinjaOneClient) =>
      client.get('/backup/integrity-check-jobs', clean(args)),
  },
];
