/**
 * Tools index - Register all Copilot tools
 */

import type { McpServer } from '../../server/mcp.js';
import { registerAskTool } from './ask.js';
import { registerDebugTool } from './debug.js';
import { registerExplainTool } from './explain.js';
import { registerRefactorTool } from './refactor.js';
import { registerReviewTool } from './review.js';
import { registerSessionTools } from './session.js';
import { registerSuggestTool } from './suggest.js';
import { registerTestGenerateTool } from './test-generate.js';

/**
 * Register all Copilot tools with the MCP server
 */
export function registerAllTools(server: McpServer): void {
  registerAskTool(server);
  registerExplainTool(server);
  registerSuggestTool(server);
  registerDebugTool(server);
  registerRefactorTool(server);
  registerTestGenerateTool(server);
  registerReviewTool(server);
  registerSessionTools(server);
}

export {
  registerAskTool,
  registerExplainTool,
  registerSuggestTool,
  registerDebugTool,
  registerRefactorTool,
  registerTestGenerateTool,
  registerReviewTool,
  registerSessionTools
};
