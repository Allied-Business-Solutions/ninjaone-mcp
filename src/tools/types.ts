import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { NinjaOneClient } from '../client.js';

export interface ToolDef {
  tool: Tool;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (args: any, client: NinjaOneClient) => Promise<unknown>;
}
