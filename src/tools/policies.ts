import { NinjaOneClient } from '../client.js';
import { clean } from '../utils.js';
import { ToolDef } from './types.js';

export const policyTools: ToolDef[] = [
  {
    tool: {
      name: 'ninja_list_policies',
      description: 'List all policies configured in NinjaOne.',
      inputSchema: { type: 'object', properties: {} },
    },
    handler: async (_args, client: NinjaOneClient) => client.get('/policies'),
  },
  {
    tool: {
      name: 'ninja_get_device_policy_overrides',
      description: 'Get policy overrides applied to a specific device.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Device ID' },
        },
      },
    },
    handler: async ({ id }, client: NinjaOneClient) =>
      client.get(`/device/${id}/policy/overrides`),
  },
  {
    tool: {
      name: 'ninja_query_policy_overrides',
      description: 'Query policy overrides across all managed devices.',
      inputSchema: {
        type: 'object',
        properties: {
          df: { type: 'string', description: 'Device filter expression' },
          pageSize: { type: 'number', description: 'Max results to return' },
          cursor: { type: 'string', description: 'Pagination cursor' },
        },
      },
    },
    handler: async (args, client: NinjaOneClient) =>
      client.get('/queries/policy-overrides', clean(args)),
  },
  {
    tool: {
      name: 'ninja_list_node_roles',
      description: 'List all available device/node roles.',
      inputSchema: { type: 'object', properties: {} },
    },
    handler: async (_args, client: NinjaOneClient) => client.get('/roles'),
  },
];
