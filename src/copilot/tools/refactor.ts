/**
 * Refactor Code tool - Suggest refactoring improvements for code
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

/**
 * Register the copilot-refactor tool
 */
export function registerRefactorTool(server: McpServer): void {
  server.registerTool(
    'copilot-refactor',
    {
      title: 'Refactor Code',
      description: 'Suggest refactoring improvements for code',
      inputSchema: {
        code: z.string().describe('The code to refactor'),
        goal: z
          .string()
          .optional()
          .describe(
            'Specific refactoring goal (e.g., "improve performance", "increase readability")'
          )
      }
    },
    async ({ code, goal }): Promise<CallToolResult> => {
      try {
        const isInstalled = await checkCopilotInstalled();
        if (!isInstalled) {
          return createNotInstalledError();
        }

        const prompt = `Please refactor this code${goal ? ` to ${goal}` : ''}:

\`\`\`
${code}
\`\`\`

Provide:
1. Refactored code
2. Explanation of changes
3. Benefits of the refactoring
4. Any trade-offs or considerations`;

        const result = await executeCopilotCommand(prompt);
        return { content: [{ type: 'text', text: result }] };
      } catch (error) {
        return createErrorResult(error);
      }
    }
  );
}
