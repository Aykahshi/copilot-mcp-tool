# Changelog

All notable changes to copilot-flow will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.1.0] - 2025-12-16

### 🎉 Initial Release

First official release of copilot-flow - an AI collaboration workflow plugin that enables automated development process between Claude and GitHub Copilot.

### Added

#### 5-Stage Workflow Automation
- **Analyze** (Claude) - Requirements analysis and task breakdown
- **Design** (Copilot) - Architecture design and implementation planning
- **Implement** (Claude) - Code implementation based on design
- **Review** (Copilot) - Code review and quality assurance
- **Deliver** (Claude) - Final delivery and documentation

#### Smart Model Selection
Automatically selects the best Copilot model based on task type:
- Architecture & code issues → `claude-sonnet-4.5`, `claude-opus-4.5`
- Google ecosystem (Flutter/Angular/GCP/Firebase) → `gemini-3-pro-preview`
- Quick code QA → `claude-haiku-4.5`
- Quick non-code QA → `gpt-5-mini`
- High-difficulty complex tasks → `gpt-5.1-codex`, `gpt-5.1-codex-max`

#### Workflow Management
- 🎯 **Responsibility separation** - Copilot provides suggestions, Claude executes code changes
- 👀 **Preview mode** - Shows execution plan before running, requires user confirmation
- 🔄 **Recovery mechanism** - Resume interrupted workflows via session ID
- 📊 **State management** - Interruption recovery with state saved in `.claude/workflow-state.json`
</text>
<new_text>

#### Components
- **Slash Commands**: `/copilot-flow:analyze`, `design`, `implement`, `review`, `deliver`
- **Shortcuts**: `c-flow:*` command prefix support
- **Skills**: `copilot-flow-integration` for workflow orchestration, `copilot-mcp-server` for direct MCP tool access
- **Agents**: `workflow-orchestrator` for managing the complete 5-stage execution flow

#### MCP Integration
- Integration via `copilot-mcp-server` npm package
- 9 available MCP tools: `ask-copilot`, `copilot-explain`, `copilot-suggest`, `copilot-debug`, `copilot-review`, `copilot-refactor`, `copilot-test-generate`, `copilot-session-start`, `copilot-session-history`

#### Documentation
- English (README.md) and Traditional Chinese (README-zh.md) documentation
- CLAUDE.md for developer guidance
- Complete inline documentation for all commands and components
- Usage examples for full workflow, individual stages, and MCP tools

#### Utilities
- `validate-plugin.js` - Complete plugin structure validation
- `quick-test.js` - Quick structure test
- `check-mcp.js` - MCP connection verification
- `workflow-state.js` - Workflow state management

### Installation

```bash
# Add plugin marketplace
/plugin marketplace add Aykahshi/copilot-mcp-tool

# Install plugin
/plugin install copilot-flow
```

**Prerequisites**: 
- **Required**: Claude Code CLI, GitHub Copilot CLI (authenticated), copilot-mcp-server (via npx)

### Links

- **Repository**: https://github.com/Aykahshi/copilot-mcp-tool
- **Plugin Path**: `plugins/copilot-flow`
- **License**: MIT