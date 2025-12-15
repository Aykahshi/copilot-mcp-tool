/**
 * Ask Copilot tool - General purpose interaction with Copilot CLI
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
 * Register the ask-copilot tool
 */
export function registerAskTool(server: McpServer): void {
  server.registerTool(
    'ask-copilot',
    {
      title: 'Ask GitHub Copilot',
      description:
        'Ask GitHub Copilot CLI to help with coding tasks, generate commands, explain code, or provide suggestions',
      inputSchema: {
        prompt: z.string().describe('The question or task to ask GitHub Copilot CLI'),
        context: z
          .string()
          .optional()
          .describe('Optional additional context (file paths, code snippets, etc.)'),
        model: z
          .enum(SUPPORTED_MODELS)
          .optional()
          .describe(`AI model to use (default: ${getDefaultModel('ask')})`),
        allowAllTools: z
          .boolean()
          .optional()
          .default(true)
          .describe('Allow all tools to run automatically without confirmation (default: true)'),
        cwd: z
          .string()
          .optional()
          .describe(
            'Working directory for Copilot CLI to execute in (required for file operations)'
          )
      }
    },
    async ({ prompt, context, model, allowAllTools = true, cwd }): Promise<CallToolResult> => {
      try {
        const isInstalled = await checkCopilotInstalled();
        if (!isInstalled) {
          return createNotInstalledError();
        }

        const effectiveModel = model || getDefaultModel('ask');
        const result = await executeCopilotCommand(prompt, {
          context,
          model: effectiveModel,
          allowAllTools,
          cwd
        });
        return { content: [{ type: 'text', text: result }] };
      } catch (error) {
        return createErrorResult(error);
      }
    }
  );
}
