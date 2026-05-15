import { NinjaOneClient } from '../client.js';
import { clean } from '../utils.js';
import { ToolDef } from './types.js';

export const ticketingTools: ToolDef[] = [
  {
    tool: {
      name: 'ninja_create_ticket',
      description: 'Create a new support ticket. Use ninja_list_ticket_forms to find ticketFormId and ninja_list_ticket_statuses for valid status values.',
      inputSchema: {
        type: 'object',
        required: ['clientId', 'ticketFormId', 'subject', 'status', 'requesterUid'],
        properties: {
          clientId: { type: 'number', description: 'Organization (client) ID' },
          ticketFormId: { type: 'number', description: 'Ticket form ID' },
          subject: { type: 'string', maxLength: 200, description: 'Ticket subject line' },
          requesterUid: { type: 'string', description: 'UUID of the contact or user requesting the ticket' },
          status: { type: 'string', description: 'Status ID (use ninja_list_ticket_statuses; default "1000" = Open)' },
          locationId: { type: 'number', description: 'Location ID to associate' },
          nodeId: { type: 'number', description: 'Device ID to associate' },
          description: {
            type: 'object',
            description: 'Ticket body content',
            properties: {
              public: { type: 'boolean', description: 'Whether visible to end users' },
              body: { type: 'string', description: 'Plain text body' },
              htmlBody: { type: 'string', description: 'HTML body (use instead of body for rich text)' },
            },
          },
          type: {
            type: 'string',
            enum: ['PROBLEM', 'QUESTION', 'INCIDENT', 'TASK', 'CHANGE_REQUEST', 'SERVICE_REQUEST', 'PROJECT', 'APPOINTMENT', 'MISCELLANEOUS'],
            description: 'Ticket type',
          },
          severity: {
            type: 'string',
            enum: ['NONE', 'MINOR', 'MODERATE', 'MAJOR', 'CRITICAL'],
            description: 'Ticket severity',
          },
          priority: {
            type: 'string',
            enum: ['NONE', 'LOW', 'MEDIUM', 'HIGH'],
            description: 'Ticket priority',
          },
          assignedAppUserId: { type: 'number', description: 'Technician user ID to assign' },
          tags: { type: 'array', items: { type: 'string' }, description: 'Ticket tags' },
          parentTicketId: { type: 'number', description: 'Parent ticket ID (for sub-tickets)' },
        },
      },
    },
    handler: async (args, client: NinjaOneClient) => client.post('/ticketing/ticket', args),
  },
  {
    tool: {
      name: 'ninja_get_ticket',
      description: 'Get a ticket and all its details by ID.',
      inputSchema: {
        type: 'object',
        required: ['ticketId'],
        properties: {
          ticketId: { type: 'number', description: 'Ticket ID' },
        },
      },
    },
    handler: async ({ ticketId }, client: NinjaOneClient) =>
      client.get(`/ticketing/ticket/${ticketId}`),
  },
  {
    tool: {
      name: 'ninja_update_ticket',
      description: 'Update an existing ticket (status, subject, assignee, severity, priority, tags, etc.).',
      inputSchema: {
        type: 'object',
        required: ['ticketId'],
        properties: {
          ticketId: { type: 'number', description: 'Ticket ID' },
          status: { type: 'string', description: 'New status ID' },
          subject: { type: 'string', maxLength: 200, description: 'Updated subject' },
          assignedAppUserId: { type: 'number', description: 'Assigned technician user ID' },
          severity: {
            type: 'string',
            enum: ['NONE', 'MINOR', 'MODERATE', 'MAJOR', 'CRITICAL'],
          },
          priority: {
            type: 'string',
            enum: ['NONE', 'LOW', 'MEDIUM', 'HIGH'],
          },
          tags: { type: 'array', items: { type: 'string' }, description: 'Updated tags' },
          locationId: { type: 'number', description: 'Updated location ID' },
          nodeId: { type: 'number', description: 'Updated device ID' },
        },
      },
    },
    handler: async ({ ticketId, ...body }, client: NinjaOneClient) =>
      client.put(`/ticketing/ticket/${ticketId}`, body),
  },
  {
    tool: {
      name: 'ninja_add_ticket_comment',
      description: 'Add a comment to a ticket.',
      inputSchema: {
        type: 'object',
        required: ['ticketId', 'body'],
        properties: {
          ticketId: { type: 'number', description: 'Ticket ID' },
          body: { type: 'string', description: 'Comment body (plain text)' },
          htmlBody: { type: 'string', description: 'Comment body as HTML' },
          public: {
            type: 'boolean',
            description: 'Whether the comment is public (visible to end users)',
          },
          timeTracked: { type: 'number', description: 'Time tracked in seconds' },
          technicianUid: { type: 'string', description: 'UID of the technician adding the comment' },
        },
      },
    },
    handler: async ({ ticketId, ...body }, client: NinjaOneClient) =>
      client.post(`/ticketing/ticket/${ticketId}/comment`, body),
  },
  {
    tool: {
      name: 'ninja_get_ticket_log',
      description: 'Get the activity and change log entries for a ticket.',
      inputSchema: {
        type: 'object',
        required: ['ticketId'],
        properties: {
          ticketId: { type: 'number', description: 'Ticket ID' },
          pageSize: { type: 'number', description: 'Max entries to return' },
          after: { type: 'number', description: 'Pagination cursor' },
        },
      },
    },
    handler: async ({ ticketId, ...params }, client: NinjaOneClient) =>
      client.get(`/ticketing/ticket/${ticketId}/log-entry`, clean(params)),
  },
  {
    tool: {
      name: 'ninja_get_tickets_by_board',
      description: 'Query tickets on a specific ticketing board. Use ninja_list_boards to find board IDs.',
      inputSchema: {
        type: 'object',
        required: ['boardId'],
        properties: {
          boardId: { type: 'number', description: 'Board ID' },
          pageSize: { type: 'number', description: 'Max tickets to return' },
          pageIndex: { type: 'number', description: 'Page index for pagination (0-based)' },
          sortBy: { type: 'string', description: 'Field to sort by' },
          sortDirection: {
            type: 'string',
            enum: ['ASC', 'DESC'],
            description: 'Sort direction',
          },
        },
      },
    },
    handler: async ({ boardId, ...body }, client: NinjaOneClient) =>
      client.post(`/ticketing/trigger/board/${boardId}/run`, body),
  },
  {
    tool: {
      name: 'ninja_list_boards',
      description: 'List all available ticketing boards.',
      inputSchema: { type: 'object', properties: {} },
    },
    handler: async (_args, client: NinjaOneClient) =>
      client.get('/ticketing/trigger/boards'),
  },
  {
    tool: {
      name: 'ninja_list_ticket_statuses',
      description: 'List all available ticket statuses.',
      inputSchema: { type: 'object', properties: {} },
    },
    handler: async (_args, client: NinjaOneClient) => client.get('/ticketing/statuses'),
  },
  {
    tool: {
      name: 'ninja_list_ticket_forms',
      description: 'List all available ticket forms.',
      inputSchema: { type: 'object', properties: {} },
    },
    handler: async (_args, client: NinjaOneClient) => client.get('/ticketing/ticket-form'),
  },
  {
    tool: {
      name: 'ninja_get_ticket_form',
      description: 'Get details of a specific ticket form including its fields.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'Ticket form ID' },
        },
      },
    },
    handler: async ({ id }, client: NinjaOneClient) =>
      client.get(`/ticketing/ticket-form/${id}`),
  },
  {
    tool: {
      name: 'ninja_list_ticketing_users',
      description: 'List all app users and contacts available in the ticketing system.',
      inputSchema: { type: 'object', properties: {} },
    },
    handler: async (_args, client: NinjaOneClient) =>
      client.get('/ticketing/app-user-contact'),
  },
  {
    tool: {
      name: 'ninja_get_ticket_attributes',
      description: 'Get the custom attribute definitions available for tickets.',
      inputSchema: { type: 'object', properties: {} },
    },
    handler: async (_args, client: NinjaOneClient) => client.get('/ticketing/attributes'),
  },
];
