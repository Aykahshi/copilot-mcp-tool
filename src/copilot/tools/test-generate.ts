/**
 * Generate Tests tool - Generate unit tests for code
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
 * Register the copilot-test-generate tool
 */
export function registerTestGenerateTool(server: McpServer): void {
  server.registerTool(
    'copilot-test-generate',
    {
      title: 'Generate Tests',
      description: 'Generate unit tests for code',
      inputSchema: {
        code: z.string().describe('The code to generate tests for'),
        framework: z
          .string()
          .optional()
          .describe('Testing framework to use (e.g., Jest, Mocha, pytest)'),
        model: z
          .enum(SUPPORTED_MODELS)
          .optional()
          .describe(`AI model to use (default: ${getDefaultModel('testGenerate')})`)
      }
    },
    async ({ code, framework, model }): Promise<CallToolResult> => {
      try {
        const isInstalled = await checkCopilotInstalled();
        if (!isInstalled) {
          return createNotInstalledError();
        }

        const prompt = framework
          ? `Generate ${framework} tests for this code:\n\n${code}`
          : `Generate unit tests for this code:\n\n${code}`;

        const effectiveModel = model || getDefaultModel('testGenerate');
        const result = await executeCopilotCommand(prompt, { model: effectiveModel });
        return { content: [{ type: 'text', text: result }] };
      } catch (error) {
        return createErrorResult(error);
      }
    }
  );
}
