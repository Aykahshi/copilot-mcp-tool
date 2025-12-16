const fs = require('fs');
const path = require('path');

const validationResults = {
  passed: [],
  failed: [],
  warnings: []
};

function validateStructure() {
  console.log('\n=== Validating Plugin Structure ===');

  // Check required directories
  const requiredDirs = [
    '.claude-plugin',
    'agents',
    'commands',
    'skills',
    'scripts'
  ];

  requiredDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      validationResults.passed.push(`✓ Directory ${dir} exists`);
    } else {
      validationResults.failed.push(`✗ Missing directory: ${dir}`);
    }
  });

  // Check required files
  const requiredFiles = [
    '.claude-plugin/marketplace.json',
    '.mcp.json',
    'README.md',
    '.gitignore',
  ];

  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      validationResults.passed.push(`✓ File ${file} exists`);
    } else {
      validationResults.failed.push(`✗ Missing file: ${file}`);
    }
  });
}

function validatePluginJson() {
  console.log('\n=== Validating plugin.json ===');

  try {
    const pluginJson = JSON.parse(fs.readFileSync('.claude-plugin/plugin.json', 'utf8'));

    // Check required fields
    const requiredFields = ['name', 'version', 'description'];
    requiredFields.forEach(field => {
      if (pluginJson[field]) {
        validationResults.passed.push(`✓ plugin.json has ${field}`);
      } else {
        validationResults.failed.push(`✗ plugin.json missing ${field}`);
      }
    });

    // Note: Components are auto-discovered by Claude Code, no need to specify in plugin.json

  } catch (error) {
    validationResults.failed.push(`✗ Invalid plugin.json: ${error.message}`);
  }
}

function validateCommands() {
  console.log('\n=== Validating Commands ===');

  const expectedCommands = ['analyze', 'design', 'implement', 'review', 'deliver'];
  const commandFiles = fs.readdirSync('commands').filter(f => f.endsWith('.md'));

  expectedCommands.forEach(cmd => {
    const file = `${cmd}.md`;
    if (commandFiles.includes(file)) {
      validationResults.passed.push(`✓ Command ${cmd} exists`);

      // Check frontmatter
      try {
        const content = fs.readFileSync(path.join('commands', file), 'utf8');
        if (content.includes('---') && content.includes('name:')) {
          validationResults.passed.push(`✓ Command ${cmd} has valid frontmatter`);
        } else {
          validationResults.warnings.push(`⚠ Command ${cmd} missing frontmatter`);
        }
      } catch (error) {
        validationResults.failed.push(`✗ Cannot read command ${cmd}: ${error.message}`);
      }
    } else {
      validationResults.failed.push(`✗ Missing command: ${cmd}`);
    }
  });
}

function validateSkills() {
  console.log('\n=== Validating Skills ===');

  const skillDir = 'skills/copilot-flow-integration';
  const skillFile = path.join(skillDir, 'SKILL.md');

  if (fs.existsSync(skillFile)) {
    validationResults.passed.push('✓ Skill SKILL.md exists');

    const content = fs.readFileSync(skillFile, 'utf8');
    if (content.includes('觸發條件') || content.includes('Trigger')) {
      validationResults.passed.push('✓ Skill has trigger conditions');
    } else {
      validationResults.warnings.push('⚠ Skill missing trigger conditions');
    }
  } else {
    validationResults.failed.push('✗ Missing skill SKILL.md');
  }
}

function validateAgent() {
  console.log('\n=== Validating Agent ===');

  const agentFile = 'agents/workflow-orchestrator.md';

  if (fs.existsSync(agentFile)) {
    validationResults.passed.push('✓ Agent workflow-orchestrator.md exists');

    const content = fs.readFileSync(agentFile, 'utf8');
    if (content.includes('---') && content.includes('identifier:')) {
      validationResults.passed.push('✓ Agent has valid frontmatter');
    } else {
      validationResults.failed.push('✗ Agent missing frontmatter');
    }

    if (content.includes('whenToUse:')) {
      validationResults.passed.push('✓ Agent has whenToUse section');
    } else {
      validationResults.warnings.push('⚠ Agent missing whenToUse section');
    }
  } else {
    validationResults.failed.push('✗ Missing agent: workflow-orchestrator.md');
  }
}

function validateMcpConfig() {
  console.log('\n=== Validating MCP Configuration ===');

  try {
    const mcpConfig = JSON.parse(fs.readFileSync('.mcp.json', 'utf8'));

    if (mcpConfig.mcpServers && mcpConfig.mcpServers.copilot) {
      validationResults.passed.push('✓ MCP has copilot server configuration');

      const copilotConfig = mcpConfig.mcpServers.copilot;
      if (copilotConfig.command) {
        validationResults.passed.push('✓ Copilot MCP has command');
        if (copilotConfig.args) {
          validationResults.passed.push(`✓ Copilot MCP has args: ${copilotConfig.args.join(' ') || 'None'}`);
        }
      } else {
        validationResults.failed.push('✗ Copilot MCP missing command');
      }
    } else {
      validationResults.failed.push('✗ MCP missing copilot server configuration');
    }
  } catch (error) {
    validationResults.failed.push(`✗ Invalid .mcp.json: ${error.message}`);
  }
}

function runValidation() {
  console.log('Validating copilot-flow plugin...');

  validateStructure();
  validatePluginJson();
  validateCommands();
  validateSkills();
  validateAgent();
  validateMcpConfig();

  // Print results
  console.log('\n=== Validation Results ===');

  if (validationResults.passed.length > 0) {
    console.log('\n✅ Passed Checks:');
    validationResults.passed.forEach(msg => console.log(`  ${msg}`));
  }

  if (validationResults.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    validationResults.warnings.forEach(msg => console.log(`  ${msg}`));
  }

  if (validationResults.failed.length > 0) {
    console.log('\n❌ Failed Checks:');
    validationResults.failed.forEach(msg => console.log(`  ${msg}`));
  }

  // Summary
  const total = validationResults.passed.length + validationResults.failed.length;
  const passedPercent = ((validationResults.passed.length / total) * 100).toFixed(1);

  console.log(`\n=== Summary ===`);
  console.log(`Passed: ${validationResults.passed.length}/${total} (${passedPercent}%)`);
  console.log(`Warnings: ${validationResults.warnings.length}`);
  console.log(`Failed: ${validationResults.failed.length}`);

  if (validationResults.failed.length === 0) {
    console.log('\n🎉 Plugin validation passed!');
    process.exit(0);
  } else {
    console.log('\n⛔ Plugin validation failed. Please fix the issues above.');
    process.exit(1);
  }
}

// Run validation
runValidation();