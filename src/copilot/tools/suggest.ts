/**
 * Suggest Commands tool - Get CLI command suggestions for specific tasks
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
 * Register the copilot-suggest tool
 */
export function registerSuggestTool(server: McpServer): void {
  server.registerTool(
    'copilot-suggest',
    {
      title: 'Get Command Suggestions',
      description: 'Get CLI command suggestions for specific tasks',
      inputSchema: {
        task: z.string().describe('The task you want to accomplish'),
        model: z
          .enum(SUPPORTED_MODELS)
          .optional()
          .default('claude-opus-4.5')
          .describe('AI model to use (default: claude-opus-4.5)')
      }
    },
    async ({ task, model }): Promise<CallToolResult> => {
      try {
        const isInstalled = await checkCopilotInstalled();
        if (!isInstalled) {
          return createNotInstalledError();
        }

        const prompt = `Suggest a command for: ${task}`;
        const result = await executeCopilotCommand(prompt, { model });
        return { content: [{ type: 'text', text: result }] };
      } catch (error) {
        return createErrorResult(error);
      }
    }
  );
}