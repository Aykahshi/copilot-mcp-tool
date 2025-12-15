# Contributing to Copilot MCP Server

We welcome contributions to the Copilot MCP Server! This document outlines the process for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/copilot-mcp-tool.git`
3. Install dependencies: `npm install`
4. Build the project: `npm run build`

## Development Process

1. Create a new branch for your changes: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Run `npm run lint` to ensure code style compliance (we use Biome)
4. Run `npm run lint:fix` to automatically fix formatting issues
5. Commit your changes with clear commit messages
6. Submit a pull request

## Code Style

This project uses [Biome](https://biomejs.dev/) for linting and formatting:

- Run `npm run lint` to check for issues
- Run `npm run lint:fix` to auto-fix issues
- Run `npm run format` to format code
- All commits should pass linting

## Project Structure

```
src/
├── copilot/          # Main Copilot CLI integration
│   ├── index.ts      # Entry point
│   ├── server.ts     # Server configuration
│   ├── cli.ts        # Copilot CLI execution
│   ├── session.ts    # Session management
│   ├── constants.ts  # Configuration & models
│   ├── types.ts      # Type definitions
│   ├── tools/        # MCP Tools
│   └── resources/    # MCP Resources
├── server/           # MCP Server core
├── shared/           # Shared utilities
└── types.ts          # Global types
```

## Adding New Tools

To add a new tool to the Copilot MCP Server:

1. Create a new file in `src/copilot/tools/` (e.g., `src/copilot/tools/my-tool.ts`)
2. Implement the tool following the pattern of existing tools
3. Export a registration function: `export function registerMyTool(server: McpServer): void`
4. Register it in `src/copilot/tools/index.ts`

Example:

```typescript
import { z } from 'zod';
import type { McpServer } from '../../server/mcp.js';
import type { CallToolResult } from '../../types.js';
import { checkCopilotInstalled, executeCopilotCommand, createErrorResult } from '../cli.js';

export function registerMyTool(server: McpServer): void {
  server.registerTool(
    'my-tool',
    {
      title: 'My Tool',
      description: 'Description of what this tool does',
      inputSchema: {
        param1: z.string().describe('Parameter description')
      }
    },
    async ({ param1 }): Promise<CallToolResult> => {
      try {
        const isInstalled = await checkCopilotInstalled();
        if (!isInstalled) {
          return createNotInstalledError();
        }
        const prompt = `Your prompt here: ${param1}`;
        const result = await executeCopilotCommand(prompt);
        return { content: [{ type: 'text', text: result }] };
      } catch (error) {
        return createErrorResult(error);
      }
    }
  );
}
```

## Updating Supported Models

To add new AI models:

1. Update the `SUPPORTED_MODELS` array in `src/copilot/constants.ts`
2. Models will automatically be available in all tools that support model selection

## Pull Request Guidelines

- Follow the existing code style (Biome will help ensure this)
- Keep changes focused and atomic
- Provide a clear description of changes in the PR
- Reference any related issues
- Test your changes thoroughly

## Testing

While the project doesn't have comprehensive automated tests yet, you should:

1. Build the project: `npm run build`
2. Run the test harness: `node test-detailed.js`
3. Verify the server starts and responds to MCP requests

## Reporting Issues

- Use the [GitHub issue tracker](https://github.com/Aykahshi/copilot-mcp-tool/issues)
- Search existing issues before creating a new one
- Provide clear reproduction steps and environment details

## Code of Conduct

This project follows our [Code of Conduct](CODE_OF_CONDUCT.md). Please review it before contributing.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to open an issue or discussion if you have questions about contributing!