/**
 * Review Code tool - Get a code review with suggestions
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
 * Register the copilot-review tool
 */
export function registerReviewTool(server: McpServer): void {
  server.registerTool(
    'copilot-review',
    {
      title: 'Review Code',
      description: 'Get a code review with suggestions',
      inputSchema: {
        code: z.string().describe('The code to review'),
        focusAreas: z
          .array(z.string())
          .optional()
          .describe('Specific areas to focus on (e.g., ["security", "performance"])'),
        model: z
          .enum(SUPPORTED_MODELS)
          .optional()
          .describe(`AI model to use (default: ${getDefaultModel('review')})`)
      }
    },
    async ({ code, focusAreas, model }): Promise<CallToolResult> => {
      try {
        const isInstalled = await checkCopilotInstalled();
        if (!isInstalled) {
          return createNotInstalledError();
        }

        const prompt = `Please review the following code and provide feedback on:
1. Code quality and style
2. Potential bugs or issues
3. Performance considerations
4. Security concerns
5. Best practices

Code:
\`\`\`
${code}
\`\`\`

${focusAreas && focusAreas.length > 0 ? `Focus areas: ${focusAreas.join(', ')}` : ''}

Provide specific, actionable feedback.`;

        const effectiveModel = model || getDefaultModel('review');
        const result = await executeCopilotCommand(prompt, { model: effectiveModel });
        return { content: [{ type: 'text', text: result }] };
      } catch (error) {
        return createErrorResult(error);
      }
    }
  );
}
