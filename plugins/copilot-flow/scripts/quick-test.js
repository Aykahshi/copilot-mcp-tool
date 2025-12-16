#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Copilot Flow Quick Test\n');

// Test 1: Check plugin structure
console.log('1. Checking plugin structure...');
const requiredStructure = {
  '.claude-plugin/plugin.json': 'Plugin manifest',
  '.mcp.json': 'MCP configuration',
  'commands/analyze.md': 'Analyze command',
  'commands/design.md': 'Design command',
  'commands/implement.md': 'Implement command',
  'commands/review.md': 'Review command',
  'commands/deliver.md': 'Deliver command',
  'agents/workflow-orchestrator.md': 'Workflow agent',
  'skills/copilot-flow-integration/SKILL.md': 'Integration skill'
};

let structurePassed = true;
for (const [file, desc] of Object.entries(requiredStructure)) {
  if (fs.existsSync(file)) {
    console.log(`  ✓ ${desc}`);
  } else {
    console.log(`  ✗ Missing: ${desc}`);
    structurePassed = false;
  }
}

// Test 2: Check MCP configuration
console.log('\n2. Checking MCP configuration...');
try {
  const mcpConfig = JSON.parse(fs.readFileSync('.mcp.json', 'utf8'));
  if (mcpConfig.mcpServers && mcpConfig.mcpServers.copilot) {
    console.log('  ✓ Copilot MCP server configured');
    console.log('  ✓ Command:', mcpConfig.mcpServers.copilot.command);
    console.log('  ✓ Args:', mcpConfig.mcpServers.copilot.args?.join(' ') || 'None');
  } else {
    console.log('  ✗ Copilot MCP server not found');
  }
} catch (error) {
  console.log(`  ✗ Error reading .mcp.json: ${error.message}`);
}

// Test 3: Check command frontmatter
console.log('\n3. Checking command frontmatter...');
const commands = ['analyze', 'design', 'implement', 'review', 'deliver'];
commands.forEach(cmd => {
  const file = `commands/${cmd}.md`;
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('name:') && content.includes('description:')) {
      console.log(`  ✓ ${cmd} has valid frontmatter`);
    } else {
      console.log(`  ⚠ ${cmd} missing frontmatter fields`);
    }
  }
});

// Test 4: Check agent configuration
console.log('\n4. Checking agent configuration...');
const agentFile = 'agents/workflow-orchestrator.md';
if (fs.existsSync(agentFile)) {
  const content = fs.readFileSync(agentFile, 'utf8');
  const hasFrontmatter = content.includes('---') && content.includes('identifier:');
  const hasWhenToUse = content.includes('whenToUse:');
  const hasSystemPrompt = content.includes('systemPrompt:');

  console.log(`  ${hasFrontmatter ? '✓' : '✗'} Has frontmatter`);
  console.log(`  ${hasWhenToUse ? '✓' : '✗'} Has whenToUse`);
  console.log(`  ${hasSystemPrompt ? '✓' : '✗'} Has systemPrompt`);
}

// Test 5: Check file sizes (basic quality check)
console.log('\n5. Checking file sizes...');
const sizeChecks = [
  ['README.md', 500, 'Documentation'],
  ['commands/analyze.md', 50, 'Analyze command'],
  ['commands/design.md', 100, 'Design command'],
  ['commands/implement.md', 100, 'Implement command'],
  ['commands/review.md', 100, 'Review command'],
  ['commands/deliver.md', 100, 'Deliver command'],
  ['skills/copilot-flow-integration/SKILL.md', 500, 'Skill documentation'],
  ['agents/workflow-orchestrator.md', 1000, 'Agent documentation']
];

sizeChecks.forEach(([file, minSize, desc]) => {
  if (fs.existsSync(file)) {
    const stats = fs.statSync(file);
    const sizeKB = Math.round(stats.size / 1024 * 100) / 100;
    if (stats.size >= minSize) {
      console.log(`  ✓ ${desc}: ${sizeKB}KB`);
    } else {
      console.log(`  ⚠ ${desc}: ${sizeKB}KB (might be too short)`);
    }
  }
});

// Summary
console.log('\n=== Quick Test Summary ===');
console.log('Plugin structure:', structurePassed ? '✅ PASSED' : '❌ FAILED');
console.log('To run full validation: node scripts/validate-plugin.js');
console.log('To test MCP connection: node scripts/check-mcp.js');
console.log('\nFor detailed testing, see TESTING.md');