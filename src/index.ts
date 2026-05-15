#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { NinjaOneClient } from './client.js';
import { ALL_TOOLS } from './tools/index.js';

const { NINJA_BASE_URL, NINJA_CLIENT_ID, NINJA_CLIENT_SECRET } = process.env;

if (!NINJA_BASE_URL || !NINJA_CLIENT_ID || !NINJA_CLIENT_SECRET) {
  process.stderr.write(
    'Error: Missing required environment variables:\n' +
      '  NINJA_BASE_URL      - NinjaOne instance URL (e.g. https://app.ninjarmm.com)\n' +
      '  NINJA_CLIENT_ID     - OAuth2 client ID from NinjaOne Developer Portal\n' +
      '  NINJA_CLIENT_SECRET - OAuth2 client secret from NinjaOne Developer Portal\n',
  );
  process.exit(1);
}

const ninjaClient = new NinjaOneClient(NINJA_BASE_URL, NINJA_CLIENT_ID, NINJA_CLIENT_SECRET);
const toolMap = new Map(ALL_TOOLS.map((def) => [def.tool.name, def.handler]));

const server = new Server(
  { name: 'ninjaone-mcp', version: '1.0.0' },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: ALL_TOOLS.map((def) => def.tool),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const handler = toolMap.get(name);

  if (!handler) {
    return {
      content: [{ type: 'text', text: `Unknown tool: ${name}` }],
      isError: true,
    };
  }

  try {
    const result = await handler(
      (args ?? {}) as Record<string, unknown>,
      ninjaClient,
    );
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  } catch (err) {
    return {
      content: [{ type: 'text', text: err instanceof Error ? err.message : String(err) }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
