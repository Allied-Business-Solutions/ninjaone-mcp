import { NinjaOneClient } from '../client.js';
import { clean } from '../utils.js';
import { ToolDef } from './types.js';

export const organizationTools: ToolDef[] = [
  {
    tool: {
      name: 'ninja_list_organizations',
      description: 'List all organizations (clients/customers) in NinjaOne. Supports filtering and pagination.',
      inputSchema: {
        type: 'object',
        properties: {
          pageSize: { type: 'number', description: 'Max organizations to return' },
          after: { type: 'number', description: 'Last org ID from previous page for pagination' },
          of: { type: 'string', description: 'Organization filter expression' },
        },
      },
    },
    handler: async (args, client: NinjaOneClient) => client.get('/organizations', clean(args)),
  },
  {
    tool: {
      name: 'ninja_get_organizations_detailed',
      description: 'List organizations with detailed settings, policy assignments, and node role mappings.',
      inputSchema: {
        type: 'object',
        properties: {
          pageSize: { type: 'number', description: 'Max organizations to return' },
          after: { type: 'number', description: 'Last org ID for pagination' },
          of: { type: 'string', description: 'Organization filter expression' },
        },
      },
    },
    handler: async (args, client: NinjaOneClient) =>
      client.get('/organizations-detailed', clean(args)),
  },
  {
    tool: {
      name: 'ninja_get_organization',
      description: 'Get detailed information about a specific organization.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Organization ID' },
        },
      },
    },
    handler: async ({ id }, client: NinjaOneClient) => client.get(`/organization/${id}`),
  },
  {
    tool: {
      name: 'ninja_create_organization',
      description: 'Create a new organization (client) in NinjaOne.',
      inputSchema: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', description: 'Organization name' },
          description: { type: 'string', description: 'Organization description' },
          nodeApprovalMode: {
            type: 'string',
            enum: ['AUTOMATIC', 'MANUAL', 'REJECT'],
            description: 'How new devices are approved',
          },
          tags: { type: 'array', items: { type: 'string' }, description: 'Organization tags' },
          fields: {
            type: 'object',
            description: 'Custom field values',
            additionalProperties: true,
          },
        },
      },
    },
    handler: async (args, client: NinjaOneClient) => client.post('/organizations', args),
  },
  {
    tool: {
      name: 'ninja_update_organization',
      description: 'Update an existing organization.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Organization ID' },
          name: { type: 'string', description: 'Organization name' },
          description: { type: 'string', description: 'Organization description' },
          nodeApprovalMode: {
            type: 'string',
            enum: ['AUTOMATIC', 'MANUAL', 'REJECT'],
            description: 'How new devices are approved',
          },
        },
      },
    },
    handler: async ({ id, ...body }, client: NinjaOneClient) =>
      client.patch(`/organization/${id}`, body),
  },
  {
    tool: {
      name: 'ninja_get_organization_devices',
      description: 'Get all devices belonging to a specific organization.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Organization ID' },
          df: { type: 'string', description: 'Device filter expression' },
          pageSize: { type: 'number', description: 'Max devices to return' },
          after: { type: 'number', description: 'Last device ID for pagination' },
        },
      },
    },
    handler: async ({ id, ...params }, client: NinjaOneClient) =>
      client.get(`/organization/${id}/devices`, clean(params)),
  },
  {
    tool: {
      name: 'ninja_get_organization_locations',
      description: 'Get all locations for an organization.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Organization ID' },
        },
      },
    },
    handler: async ({ id }, client: NinjaOneClient) =>
      client.get(`/organization/${id}/locations`),
  },
  {
    tool: {
      name: 'ninja_create_organization_location',
      description: 'Create a new location for an organization.',
      inputSchema: {
        type: 'object',
        required: ['id', 'name'],
        properties: {
          id: { type: 'number', description: 'Organization ID' },
          name: { type: 'string', description: 'Location name' },
          description: { type: 'string', description: 'Location description' },
          address: { type: 'string', description: 'Street address' },
          city: { type: 'string', description: 'City' },
          state: { type: 'string', description: 'State or province' },
          country: { type: 'string', description: 'Country code (e.g. US)' },
          zipCode: { type: 'string', description: 'Postal/ZIP code' },
        },
      },
    },
    handler: async ({ id, ...body }, client: NinjaOneClient) =>
      client.post(`/organization/${id}/locations`, body),
  },
  {
    tool: {
      name: 'ninja_get_organization_custom_fields',
      description: 'Get custom field values for an organization.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Organization ID' },
          withInheritance: {
            type: 'boolean',
            description: 'Include inherited custom field values',
          },
        },
      },
    },
    handler: async ({ id, ...params }, client: NinjaOneClient) =>
      client.get(`/organization/${id}/custom-fields`, clean(params)),
  },
  {
    tool: {
      name: 'ninja_get_organization_end_users',
      description: 'Get end users associated with an organization.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Organization ID' },
        },
      },
    },
    handler: async ({ id }, client: NinjaOneClient) =>
      client.get(`/organization/${id}/end-users`),
  },
];
