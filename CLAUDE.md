# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Test Commands

```bash
# Build the project (ESM + CJS)
npm run build

# Development commands
npm run lint          # Check code style with Biome
npm run lint:fix      # Auto-fix linting issues
npm run format        # Format code with Biome

# Testing
npm test              # Run test harness (node test-detailed.js)
node test-detailed.js # Run detailed MCP server test
```

## Code Architecture

### High-Level Structure
This is a **Model Context Protocol (MCP) server** that bridges GitHub Copilot CLI with MCP-compatible AI clients (Claude Desktop, Cursor, etc.). The architecture follows a modular design:

```
src/
├── copilot/          # Main Copilot integration layer
│   ├── index.ts      # Server entry point (#!/usr/bin/env node)
│   ├── server.ts     # MCP server configuration & setup
│   ├── cli.ts        # Copilot CLI execution wrapper
│   ├── session.ts    # Session management & history
│   ├── constants.ts  # Models, timeouts, paths, server info
│   ├── types.ts      # Copilot-specific type definitions
│   ├── tools/        # MCP tool implementations (9 tools)
│   └── resources/    # MCP resource implementations (2 resources)
├── server/           # Core MCP server framework
│   ├── mcp.ts        # McpServer class implementation
│   ├── stdio.ts      # StdioServerTransport for communication
│   └── completable.ts# Base classes for MCP entities
├── shared/           # Shared utilities & protocols
│   ├── protocol.ts   # MCP protocol types & interfaces
│   ├── stdio.ts      # Shared stdio utilities
│   ├── transport.ts  # Transport layer abstractions
│   └── uriTemplate.ts # URI template handling for resources
└── types.ts          # Global type definitions
```

### Key Components

**1. MCP Server Core (`src/server/`)**
- Implements the MCP protocol specification
- Handles tool registration, resource management, and communication
- Provides base classes for MCP entities

**2. Copilot Integration (`src/copilot/`)**
- Wraps GitHub Copilot CLI commands
- Manages sessions and conversation history
- Implements 9 MCP tools (ask, explain, suggest, debug, refactor, test-generate, review, session-start, session-history)
- Implements 2 MCP resources (session history, sessions list)

**3. Tool Architecture**
Each tool (`src/copilot/tools/*.ts`) follows a consistent pattern:
- Validates input with Zod schemas
- Checks Copilot CLI installation
- Executes Copilot commands via `executeCopilotCommand()`
- Returns structured MCP responses

**4. Session Management**
- Tracks conversation history in `~/.copilot/mcp-sessions/`
- Maintains session IDs across tool invocations
- Enables context continuation

### Data Flow
1. MCP Client (e.g., Claude Desktop) → MCP protocol request
2. StdioServerTransport → Receives JSON-RPC messages
3. McpServer → Routes to appropriate tool/resource handler
4. Tool implementation → Executes Copilot CLI command
5. Response → Returns via MCP protocol to client

### Configuration Constants
- **Supported Models**: Defined in `SUPPORTED_MODELS` array (Claude 4.5, GPT-5.x, Gemini)
- **Timeouts**: Configurable delays for CLI startup, response waiting, command timeouts
- **Paths**: Copilot directory in user home, session storage location

### Build System
- **TypeScript**: Strict mode, ES2018 target, NodeNext modules
- **Dual Output**: Builds both ESM and CJS versions via prepare scripts
- **Entry Points**: 
  - Main: `dist/esm/copilot/index.js`
  - Binary: `copilot-mcp-server` command

## Development Guidelines

- This project uses **Biome** for linting and formatting (not ESLint)
- All tools must check Copilot installation before execution
- Session management is automatic - tools should use `getCurrentSessionId()`
- Follow existing patterns when adding new tools/resources
- Use Zod for input validation and TypeScript for type safety