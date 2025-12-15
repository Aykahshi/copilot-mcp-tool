/**
 * Session Resources - MCP resources for session data access
 */

import type { McpServer } from '../../server/mcp.js';
import { ResourceTemplate } from '../../server/mcp.js';
import { getAllSessionSummaries, getSession, hasSession } from '../session.js';

/**
 * Register the session-history resource
 */
export function registerSessionHistoryResource(server: McpServer): void {
  server.registerResource(
    'session-history',
    new ResourceTemplate('copilot://session/{sessionId}/history', { list: undefined }),
    {
      title: 'Copilot Session History',
      description: 'Access conversation history for a specific session'
    },
    async (uri, { sessionId }) => {
      if (!hasSession(sessionId as string)) {
        throw new Error(`Session not found: ${sessionId}`);
      }

      const session = getSession(sessionId as string)!;
      const historyJson = JSON.stringify(session, null, 2);

      return {
        contents: [
          {
            uri: uri.href,
            text: historyJson,
            mimeType: 'application/json'
          }
        ]
      };
    }
  );
}

/**
 * Register the sessions-list resource
 */
export function registerSessionsListResource(server: McpServer): void {
  server.registerResource(
    'sessions-list',
    new ResourceTemplate('copilot://sessions', { list: undefined }),
    {
      title: 'All Copilot Sessions',
      description: 'List all active Copilot sessions'
    },
    async (uri) => {
      const sessionsList = getAllSessionSummaries();

      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(sessionsList, null, 2),
            mimeType: 'application/json'
          }
        ]
      };
    }
  );
}

/**
 * Register all session-related resources
 */
export function registerSessionResources(server: McpServer): void {
  registerSessionHistoryResource(server);
  registerSessionsListResource(server);
}
