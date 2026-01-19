# copilot-flow

[![Plugin Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

[繁體中文](README-zh.md)

AI collaboration workflow plugin - Implements automated collaborative development process between Claude and Copilot through Copilot MCP

## ✨ Features

- 🔄 **Automated 5-stage development workflow** (Requirements Analysis → Architecture Design → Implementation → Review → Delivery)
- 🤖 **Smart model selection** (Automatically selects the most suitable Copilot model based on task type)
- 👀 **Preview mode** (Shows plan before execution, requires confirmation)
- 🎯 **Responsibility separation** (Copilot provides suggestions, Claude executes code changes)
- 🛠️ **Error handling** (Clear prompts when MCP is unavailable)
- 📊 **State management** (Supports interruption recovery)
- 💡 **Optional memory** (Recommend using claude-mem plugin for advanced session tracking)

## 🔧 Prerequisites

### Required

1. **Claude Code CLI**
   ```bash
   npm install -g @anthropic-ai/claude-code
   ```

2. **Copilot MCP Server** (⚠️ Must install before plugin)
   ```bash
   npm install -g @aykahshi/copilot-mcp-server
   ```

3. **Copilot CLI Authentication**
   ```bash
   npm install -g @github/copilot
   copilot /login
   ```



## 🚀 Installation

### Step 1: Install Copilot MCP Server (Required)

**⚠️ IMPORTANT: You must install this globally first!**

```bash
npm install -g @aykahshi/copilot-mcp-server
```

Verify installation:
```bash
copilot-mcp-server --version
```

### Step 2: Install Plugin

```bash
# Add plugin marketplace
/plugin marketplace add Aykahshi/copilot-mcp-tool

# Install plugin
/plugin install copilot-flow
```

## Usage

### Execute Full Workflow
```
請 Copilot 協助我實現用戶認證功能
```

### Stage-by-Stage Execution
```
/copilot-flow:analyze   # Requirements analysis
/copilot-flow:design    # Architecture design
/copilot-flow:implement # Implementation
/copilot-flow:review    # Review
/copilot-flow:deliver   # Delivery
```

### Shortcuts
```
c-flow:analyze   # Analyze requirements
c-flow:design    # Design architecture
c-flow:implement # Implement code
c-flow:review    # Review code
c-flow:deliver   # Deliver results
```

## Model Selection Rules

- **Architecture Design and Code Issues** → `claude-opus-4.5`, `claude-sonnet-4.5`
- **Google Ecosystem** (Flutter/Angular/GCP/Firebase etc.) → `gemini-3-pro-preview`
- **Quick Code QA** → `claude-haiku-4.5`
- **Non-code Quick QA** → `gpt-5-mini`
- **High-Difficulty Complex Tasks** → `gpt-5.2-codex`

## Workflow

1. **Preview Mode**: Claude proposes initial plan
2. **Execute after Confirmation**: Enter Copilot interaction flow
3. **Automatic Context**: Leverage Claude's native memory for conversation continuity
4. **Recovery Mechanism**: Can recover interrupted workflows through session context


## 📝 Session Recording (Optional)

copilot-flow focuses on workflow automation and doesn't include built-in session recording. If you need advanced memory and context management, we recommend using:

### 💡 Recommended: claude-mem Plugin

The [claude-mem](https://github.com/thedotmack/claude-mem) plugin provides powerful memory capabilities:

- **Automatic Memory**: Captures and stores conversation context
- **Semantic Search**: Find relevant past conversations
- **Long-term Context**: Maintain context across multiple sessions

**Installation**:
```
/plugin marketplace add thedotmack/claude-mem

/plugin install claude-mem
```

**Benefits for copilot-flow**:
- Automatically remembers your workflow decisions
- Recalls past implementations and patterns
- Provides better context for multi-session projects
- No manual session management needed

## ⚠️ Important Notes

- 🎯 **Responsibility Separation**: Copilot only provides suggestions, does not directly modify code
- 💻 **Code Execution**: All code modifications are executed by Claude based on Copilot suggestions
- 🔗 **MCP Dependency**: Ensure Copilot MCP server is available
- 💾 **State Persistence**: Workflow state saved in `.claude/workflow-state.json`
- 📝 **Memory**: Use claude-mem plugin for advanced session recording (optional)
- 🔄 **Minimal Dependencies**: Core functionality works out of the box

## 🛠️ Troubleshooting

### Common Issues

**Q: MCP Server status shows "failed"?**

A: Make sure you have installed `@aykahshi/copilot-mcp-server` globally:
```bash
npm install -g @aykahshi/copilot-mcp-server

# Verify installation
copilot-mcp-server --version
```

Then restart Claude Desktop completely.

**Q: Commands not showing in help?**

A: 
1. Check if plugin is properly installed: `/plugin list`
2. Verify MCP server is installed globally
3. Restart Claude Desktop completely

**Q: "copilot-mcp-server: command not found"?**

A: The MCP server is not installed or not in PATH:
```bash
# Install globally
npm install -g @aykahshi/copilot-mcp-server

# On Windows, you may need to restart your terminal/Claude Desktop
# On macOS/Linux, ensure npm global bin is in PATH:
export PATH="$PATH:$(npm config get prefix)/bin"
```

**Q: Workflow stuck?**

A: Delete `.claude/workflow-state.json` to reset

**Q: Need to check MCP connection?**

A: Run the MCP server directly to test:
```bash
copilot-mcp-server
# Should start without errors
# Press Ctrl+C to exit
```
## 📚 Documentation

- [Changelog](CHANGELOG.md) - Version update records
- [Plugin Structure](skills/copilot-flow-integration/SKILL.md) - Technical documentation
- [MCP Tools Guide](skills/copilot-mcp-server/SKILL.md) - Copilot MCP usage guide

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📄 License

MIT License - See [LICENSE](LICENSE) file