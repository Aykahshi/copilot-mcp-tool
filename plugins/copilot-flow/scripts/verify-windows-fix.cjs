#!/usr/bin/env node

/**
 * Verification Script for Windows CMD Window Fix
 * 
 * This script checks if the windowsHide fix has been properly applied
 * to the MCP server wrapper script.
 * 
 * Usage:
 *   node scripts/verify-windows-fix.js
 */

const fs = require('fs');
const path = require('path');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function checkNodeVersion() {
  const version = process.version;
  const match = version.match(/^v(\d+)\.(\d+)\.(\d+)/);
  
  if (!match) {
    log('⚠️  Warning: Could not parse Node.js version', 'yellow');
    return true;
  }

  const major = parseInt(match[1], 10);
  const minor = parseInt(match[2], 10);

  // windowsHide is supported since Node.js v7.6.0
  if (major < 7 || (major === 7 && minor < 6)) {
    log(`❌ Node.js version ${version} is too old`, 'red');
    log('   windowsHide requires Node.js v7.6.0 or higher', 'red');
    return false;
  }

  log(`✅ Node.js version ${version} supports windowsHide`, 'green');
  return true;
}

function checkMcpServerScript() {
  const scriptPath = path.join(__dirname, 'mcp-server.cjs');
  
  if (!fs.existsSync(scriptPath)) {
    log('❌ MCP server script not found:', 'red');
    log(`   Expected: ${scriptPath}`, 'red');
    return false;
  }

  log('✅ MCP server script found', 'green');

  const content = fs.readFileSync(scriptPath, 'utf-8');

  // Check for windowsHide option
  const hasWindowsHide = content.includes('windowsHide');
  const hasWindowsHideTrue = /windowsHide\s*:\s*true/.test(content);

  if (!hasWindowsHide) {
    log('❌ windowsHide option not found in script', 'red');
    log('   Please update the script with the fix', 'red');
    return false;
  }

  if (!hasWindowsHideTrue) {
    log('⚠️  Warning: windowsHide found but not set to true', 'yellow');
    return false;
  }

  log('✅ windowsHide: true is properly configured', 'green');

  // Check spawn configuration
  const spawnRegex = /spawn\s*\([^)]+\)\s*,\s*\{([^}]+)\}/;
  const match = content.match(spawnRegex);

  if (match) {
    const config = match[1];
    log('\n📋 Spawn Configuration:', 'cyan');
    console.log(config.trim().split('\n').map(line => `   ${line.trim()}`).join('\n'));
  }

  return true;
}

function checkMcpConfig() {
  const configPath = path.join(__dirname, '..', '.mcp.json');
  
  if (!fs.existsSync(configPath)) {
    log('⚠️  Warning: .mcp.json not found', 'yellow');
    return true;
  }

  log('✅ .mcp.json found', 'green');

  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    
    if (config.mcpServers?.copilot?.command) {
      log(`   Command: ${config.mcpServers.copilot.command}`, 'cyan');
      
      if (config.mcpServers.copilot.command.includes('mcp-server.cjs')) {
        log('✅ MCP config points to mcp-server.cjs', 'green');
      }
    }
  } catch (error) {
    log(`⚠️  Warning: Could not parse .mcp.json: ${error.message}`, 'yellow');
  }

  return true;
}

function provideSuggestions(allChecksPass) {
  console.log('\n' + '='.repeat(60));
  
  if (allChecksPass) {
    log('\n🎉 All checks passed!', 'green');
    log('\nNext steps:', 'blue');
    log('1. Restart Claude Desktop completely', 'cyan');
    log('2. Test with: /copilot:analyze "test task"', 'cyan');
    log('3. Confirm no CMD windows appear', 'cyan');
  } else {
    log('\n⚠️  Some checks failed', 'yellow');
    log('\nRecommended actions:', 'blue');
    log('1. Update Node.js to v7.6.0 or higher (if needed)', 'cyan');
    log('2. Ensure windowsHide: true is in mcp-server.cjs', 'cyan');
    log('3. Run this script again to verify', 'cyan');
    log('4. See docs/FIX-CMD-WINDOWS.md for details', 'cyan');
  }

  console.log('='.repeat(60) + '\n');
}

function main() {
  log('\n🔍 Verifying Windows CMD Window Fix', 'blue');
  log('='.repeat(60) + '\n', 'blue');

  const checks = [
    { name: 'Node.js Version', fn: checkNodeVersion },
    { name: 'MCP Server Script', fn: checkMcpServerScript },
    { name: 'MCP Configuration', fn: checkMcpConfig }
  ];

  let allPass = true;

  checks.forEach(check => {
    log(`\n🔎 Checking: ${check.name}`, 'blue');
    const result = check.fn();
    if (!result) {
      allPass = false;
    }
  });

  provideSuggestions(allPass);

  process.exit(allPass ? 0 : 1);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { checkNodeVersion, checkMcpServerScript, checkMcpConfig };