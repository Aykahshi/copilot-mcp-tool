/**
 * Resources index - Register all Copilot resources
 */

import type { McpServer } from '../../server/mcp.js';
import { registerSessionResources } from './session.js';

/**
 * Register all Copilot resources with the MCP server
 */
export function registerAllResources(server: McpServer): void {
  registerSessionResources(server);
}

export { registerSessionResources } from './session.js';
