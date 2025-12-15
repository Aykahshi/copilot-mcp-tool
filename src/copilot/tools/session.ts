/**
 * Session Management tools - Start and manage Copilot conversation sessions
 */

import { z } from 'zod';
import type { McpServer } from '../../server/mcp.js';
import type { CallToolResult } from '../../types.js';
import { createSession, getCurrentSessionId, getSession, hasSession } from '../session.js';

/**
 * Register the copilot-session-start tool
 */
export function registerSessionStartTool(server: McpServer): void {
  server.registerTool(
    'copilot-session-start',
    {
      title: 'Start New Session',
      description: 'Start a new Copilot conversation session',
      inputSchema: {}
    },
    async (): Promise<CallToolResult> => {
      const sessionId = createSession();
      return {
        content: [
          {
            type: 'text',
            text: `New session started: ${sessionId}\nAll subsequent interactions will be tracked in this session.`
          }
        ]
      };
    }
  );
}

/**
 * Register the copilot-session-history tool
 */
export function registerSessionHistoryTool(server: McpServer): void {
  server.registerTool(
    'copilot-session-history',
    {
      title: 'Get Session History',
      description: 'Retrieve the conversation history for the current session',
      inputSchema: {
        sessionId: z.string().optional().describe('Session ID (defaults to current session)')
      }
    },
    async ({ sessionId }): Promise<CallToolResult> => {
      const targetId = sessionId || getCurrentSessionId();

      if (!targetId || !hasSession(targetId)) {
        return {
          content: [
            {
              type: 'text',
              text: 'No session found. Start a new session with copilot-session-start.'
            }
          ],
          isError: true
        };
      }

      const session = getSession(targetId)!;
      const historyText = session.history
        .map(
          (entry, i) =>
            `\n[${i + 1}] ${entry.timestamp.toISOString()}\nPrompt: ${entry.prompt}\nResponse: ${entry.response.substring(0, 200)}...`
        )
        .join('\n');

      return {
        content: [
          {
            type: 'text',
            text: `Session: ${session.id}\nStarted: ${session.startTime.toISOString()}\nLast Activity: ${session.lastActivity.toISOString()}\n\nHistory:${historyText || ' (empty)'}`
          }
        ]
      };
    }
  );
}

/**
 * Register all session-related tools
 */
export function registerSessionTools(server: McpServer): void {
  registerSessionStartTool(server);
  registerSessionHistoryTool(server);
}
