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
import { SUPPORTED_MODELS, getDefaultModel } from '../constants.js';

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
          .describe(`AI model to use (default: ${getDefaultModel('suggest')})`)
      }
    },
    async ({ task, model }): Promise<CallToolResult> => {
      try {
        const isInstalled = await checkCopilotInstalled();
        if (!isInstalled) {
          return createNotInstalledError();
        }

        const prompt = `Suggest a command for: ${task}`;
        const effectiveModel = model || getDefaultModel('suggest');
        const result = await executeCopilotCommand(prompt, { model: effectiveModel });
        return { content: [{ type: 'text', text: result }] };
      } catch (error) {
        return createErrorResult(error);
      }
    }
  );
}
