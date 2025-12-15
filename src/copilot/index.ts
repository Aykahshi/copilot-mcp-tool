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
import { type ModelPreference, setModelPreference } from './constants.js';
import { createServer } from './server.js';
import { createSession, getCurrentSessionId } from './session.js';

/**
 * Parse command line arguments
 */
function parseArgs(): { prefer: ModelPreference } {
  const args = process.argv.slice(2);
  let prefer: ModelPreference = 'claude';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--prefer' && i + 1 < args.length) {
      const value = args[i + 1].toLowerCase();
      if (value === 'claude' || value === 'gpt') {
        prefer = value;
      } else {
        console.error(`⚠️  Invalid --prefer value: ${value}. Using default: claude`);
      }
      break;
    }
  }

  return { prefer };
}

/**
 * Main entry point - Start the Copilot MCP Server
 */
async function main(): Promise<void> {
  console.error('🚀 Starting GitHub Copilot MCP Server...');

  // Parse command line arguments
  const { prefer } = parseArgs();
  setModelPreference(prefer);
  console.error(`🎯 Model preference: ${prefer}`);

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
