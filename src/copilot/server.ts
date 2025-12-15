/**
 * Server configuration and setup
 */

import { McpServer } from '../server/mcp.js';
import { SERVER_INFO } from './constants.js';
import { registerAllResources } from './resources/index.js';
import { registerAllTools } from './tools/index.js';

/**
 * Create and configure the MCP server with all tools and resources
 */
export function createServer(): McpServer {
  const server = new McpServer({
    name: SERVER_INFO.name,
    version: SERVER_INFO.version,
    description: SERVER_INFO.description
  });

  // Register all tools
  registerAllTools(server);

  // Register all resources
  registerAllResources(server);

  return server;
}

export { McpServer };
