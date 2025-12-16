#!/usr/bin/env node

/**
 * MCP Server Wrapper Script for copilot-flow plugin
 * 
 * This script acts as a bridge between the Claude plugin system and the
 * copilot-mcp-server package. It ensures cross-platform compatibility
 * (Windows, macOS, Linux) by using npx to run the MCP server.
 * 
 * Usage:
 * - Automatically invoked by Claude when the plugin is loaded
 * - No manual execution required
 */

const { spawn } = require('child_process');
const path = require('path');
const process = require('process');

// Determine the npx command based on platform
const isWindows = process.platform === 'win32';
const npxCommand = isWindows ? 'npx.cmd' : 'npx';

// MCP server package and arguments
const packageName = '@aykahshi/copilot-mcp-server';
const args = ['-y', packageName];

// Spawn the MCP server process
const child = spawn(npxCommand, args, {
  stdio: 'inherit',     // Pass through stdin, stdout, stderr
  shell: isWindows,     // Use shell on Windows for proper command resolution
  windowsHide: true,    // Hide CMD window on Windows
  env: process.env      // Inherit environment variables
});

// Handle process exit
child.on('error', (error) => {
  console.error(`Failed to start MCP server: ${error.message}`);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  if (code !== null) {
    process.exit(code);
  } else if (signal !== null) {
    console.error(`MCP server terminated by signal: ${signal}`);
    process.exit(1);
  }
});

// Handle parent process termination
process.on('SIGINT', () => {
  child.kill('SIGINT');
});

process.on('SIGTERM', () => {
  child.kill('SIGTERM');
});