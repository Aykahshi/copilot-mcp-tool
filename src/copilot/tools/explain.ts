/**
 * Explain Code tool - Get detailed explanations of code or technical concepts
 */

import { z } from 'zod';
import type { McpServer } from '../../server/mcp.js';
import type { CallToolResult } from '../../types.js';
import {
  checkCopilotInstalled,
  createErrorResult,
  createNotInstalledError,
  executeCopilotCommand
} from '../cli.js';
import { SUPPORTED_MODELS } from '../constants.js';

/**
 * Register the copilot-explain tool
 */
export function registerExplainTool(server: McpServer): void {
  server.registerTool(
    'copilot-explain',
    {
      title: 'Explain Code with Copilot',
      description: 'Get detailed explanations of code or technical concepts',
      inputSchema: {
        code: z.string().describe('The code or concept to explain'),
        model: z
          .enum(SUPPORTED_MODELS)
          .optional()
          .default('claude-sonnet-4.5')
          .describe('AI model to use (default: claude-sonnet-4.5)')
      }
    },
    async ({ code, model }): Promise<CallToolResult> => {
      try {
        const isInstalled = await checkCopilotInstalled();
        if (!isInstalled) {
          return createNotInstalledError();
        }

        const prompt = `Please explain this code:\n\n${code}`;
        const result = await executeCopilotCommand(prompt, { model });
        return { content: [{ type: 'text', text: result }] };
      } catch (error) {
        return createErrorResult(error);
      }
    }
  );
}