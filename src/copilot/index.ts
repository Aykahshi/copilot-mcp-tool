#!/usr/bin/env node

/**
 * GitHub Copilot MCP Server - Main Entry Point
 *
 * A comprehensive MCP server integrating GitHub Copilot CLI with MCP capabilities:
 * - Tools: Interactive Copilot commands (ask, explain, suggest, debug, refactor, test, review, session)
 * - Resources: Session history and sessions list
 */

import { StdioServerTransport } from '../server/stdio.js';
import { initDirectories } from './cli.js';
import { createServer } from './server.js';
import { createSession, getCurrentSessionId } from './session.js';

/**
 * Main entry point - Start the Copilot MCP Server
 */
async function main(): Promise<void> {
  console.error('🚀 Starting GitHub Copilot MCP Server...');

  // Initialize directories
  await initDirectories();

  // Create initial session
  createSession();
  console.error(`✅ Initial session created: ${getCurrentSessionId()}`);

  // Create and configure the server
  const server = createServer();

  // Connect via stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('✅ Server running on stdio');
  console.error('📦 Features enabled:');
  console.error(
    '   - 9 Tools (ask, explain, suggest, debug, refactor, test, review, session-start, session-history)'
  );
  console.error('   - 2 Resources (session history, sessions list)');
  console.error('Waiting for requests...\n');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
