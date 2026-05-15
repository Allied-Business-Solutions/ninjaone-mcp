import { NinjaOneClient } from '../client.js';
import { clean } from '../utils.js';
import { ToolDef } from './types.js';

export const userTools: ToolDef[] = [
  {
    tool: {
      name: 'ninja_list_users',
      description: 'List all users in NinjaOne. Optionally filter by user type (TECHNICIAN or END_USER).',
      inputSchema: {
        type: 'object',
        properties: {
          userType: {
            type: 'string',
            enum: ['TECHNICIAN', 'END_USER'],
            description: 'Filter by user type',
          },
        },
      },
    },
    handler: async (args, client: NinjaOneClient) => client.get('/users', clean(args)),
  },
  {
    tool: {
      name: 'ninja_list_technicians',
      description: 'List all technician accounts.',
      inputSchema: {
        type: 'object',
        properties: {
          pageSize: { type: 'number', description: 'Max results to return' },
          after: { type: 'number', description: 'Last technician ID for pagination' },
        },
      },
    },
    handler: async (args, client: NinjaOneClient) =>
      client.get('/user/technicians', clean(args)),
  },
  {
    tool: {
      name: 'ninja_get_technician',
      description: 'Get a technician account by ID.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Technician user ID' },
        },
      },
    },
    handler: async ({ id }, client: NinjaOneClient) =>
      client.get(`/user/technician/${id}`),
  },
  {
    tool: {
      name: 'ninja_list_end_users',
      description: 'List all end users.',
      inputSchema: {
        type: 'object',
        properties: {
          pageSize: { type: 'number', description: 'Max results to return' },
          after: { type: 'number', description: 'Last end user ID for pagination' },
          organizationId: { type: 'number', description: 'Filter by organization' },
        },
      },
    },
    handler: async (args, client: NinjaOneClient) =>
      client.get('/user/end-users', clean(args)),
  },
  {
    tool: {
      name: 'ninja_get_end_user',
      description: 'Get an end user by ID.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'End user ID' },
        },
      },
    },
    handler: async ({ id }, client: NinjaOneClient) =>
      client.get(`/user/end-user/${id}`),
  },
  {
    tool: {
      name: 'ninja_list_user_roles',
      description: 'List all user roles defined in NinjaOne.',
      inputSchema: { type: 'object', properties: {} },
    },
    handler: async (_args, client: NinjaOneClient) => client.get('/user/roles'),
  },
  {
    tool: {
      name: 'ninja_list_contacts',
      description: 'List all contacts.',
      inputSchema: {
        type: 'object',
        properties: {
          pageSize: { type: 'number', description: 'Max results to return' },
          after: { type: 'number', description: 'Last contact ID for pagination' },
        },
      },
    },
    handler: async (args, client: NinjaOneClient) => client.get('/contacts', clean(args)),
  },
];
