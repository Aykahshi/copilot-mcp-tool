/**
 * Debug Code tool - Help debug code errors and issues
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
 * Register the copilot-debug tool
 */
export function registerDebugTool(server: McpServer): void {
  server.registerTool(
    'copilot-debug',
    {
      title: 'Debug Code',
      description: 'Help debug code errors and issues',
      inputSchema: {
        code: z.string().describe('The code with the error'),
        error: z.string().describe('The error message or description'),
        context: z.string().optional().describe('Additional context about the error'),
        model: z
          .enum(SUPPORTED_MODELS)
          .optional()
          .default('claude-haiku-4.5')
          .describe('AI model to use (default: claude-haiku-4.5)')
      }
    },
    async ({ code, error, context, model }): Promise<CallToolResult> => {
      try {
        const isInstalled = await checkCopilotInstalled();
        if (!isInstalled) {
          return createNotInstalledError();
        }

        const prompt = `I'm getting an error and need help debugging:

Error: ${error}

Code:
\`\`\`
${code}
\`\`\`

${context ? `Context: ${context}` : ''}

Please help me:
1. Identify the root cause
2. Explain why the error is happening
3. Provide a fix
4. Suggest how to prevent similar errors`;

        const result = await executeCopilotCommand(prompt, { context, model });
        return { content: [{ type: 'text', text: result }] };
      } catch (error) {
        return createErrorResult(error);
      }
    }
  );
}