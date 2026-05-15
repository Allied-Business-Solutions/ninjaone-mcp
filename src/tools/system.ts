import { NinjaOneClient } from '../client.js';
import { clean } from '../utils.js';
import { ToolDef } from './types.js';

export const systemTools: ToolDef[] = [
  {
    tool: {
      name: 'ninja_list_groups',
      description: 'List all device groups in NinjaOne.',
      inputSchema: { type: 'object', properties: {} },
    },
    handler: async (_args, client: NinjaOneClient) => client.get('/groups'),
  },
  {
    tool: {
      name: 'ninja_get_group_device_ids',
      description: 'Get the IDs of all devices in a specific group.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Group ID' },
        },
      },
    },
    handler: async ({ id }, client: NinjaOneClient) =>
      client.get(`/group/${id}/device-ids`),
  },
  {
    tool: {
      name: 'ninja_list_scheduled_tasks',
      description: 'List all scheduled automation tasks.',
      inputSchema: { type: 'object', properties: {} },
    },
    handler: async (_args, client: NinjaOneClient) => client.get('/tasks'),
  },
  {
    tool: {
      name: 'ninja_list_automation_scripts',
      description: 'List all automation scripts available in NinjaOne.',
      inputSchema: { type: 'object', properties: {} },
    },
    handler: async (_args, client: NinjaOneClient) => client.get('/automation/scripts'),
  },
  {
    tool: {
      name: 'ninja_list_notification_channels',
      description: 'List all configured notification channels.',
      inputSchema: { type: 'object', properties: {} },
    },
    handler: async (_args, client: NinjaOneClient) =>
      client.get('/notification-channels'),
  },
  {
    tool: {
      name: 'ninja_list_custom_fields',
      description: 'List all custom field definitions configured in NinjaOne.',
      inputSchema: { type: 'object', properties: {} },
    },
    handler: async (_args, client: NinjaOneClient) => client.get('/custom-fields'),
  },
  {
    tool: {
      name: 'ninja_list_locations',
      description: 'List all locations across all organizations.',
      inputSchema: {
        type: 'object',
        properties: {
          after: { type: 'number', description: 'Last location ID for pagination' },
          pageSize: { type: 'number', description: 'Max results to return' },
          of: { type: 'string', description: 'Organization filter expression' },
        },
      },
    },
    handler: async (args, client: NinjaOneClient) =>
      client.get('/locations', clean(args)),
  },
  {
    tool: {
      name: 'ninja_list_software_products',
      description: 'List all software products tracked by NinjaOne (used in patch management).',
      inputSchema: { type: 'object', properties: {} },
    },
    handler: async (_args, client: NinjaOneClient) => client.get('/software-products'),
  },
  {
    tool: {
      name: 'ninja_configure_webhook',
      description: 'Configure a webhook endpoint to receive NinjaOne events.',
      inputSchema: {
        type: 'object',
        required: ['url'],
        properties: {
          url: { type: 'string', description: 'HTTPS URL to receive webhook payloads' },
          secret: { type: 'string', description: 'Secret for HMAC signature verification' },
          activities: {
            type: 'array',
            items: { type: 'string' },
            description: 'Activity types to subscribe to',
          },
        },
      },
    },
    handler: async (args, client: NinjaOneClient) => client.put('/webhook', args),
  },
  {
    tool: {
      name: 'ninja_disable_webhook',
      description: 'Disable the configured webhook.',
      inputSchema: { type: 'object', properties: {} },
    },
    handler: async (_args, client: NinjaOneClient) => client.delete('/webhook'),
  },
];
