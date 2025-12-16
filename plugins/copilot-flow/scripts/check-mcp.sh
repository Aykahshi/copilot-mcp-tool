#!/bin/bash

# Check Copilot MCP server connection
echo "Checking Copilot MCP server..."

# Try to list MCP servers
claude mcp list 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ MCP service is available"

    # Check if copilot server is configured
    if claude mcp list | grep -q "copilot"; then
        echo "✅ Copilot MCP server is configured"

        # Test connection by trying to use a tool
        echo "Testing Copilot connection..."
        echo "Use mcp__copilot__ask-copilot with prompt=\"test connection\""
    else
        echo "❌ Copilot MCP server is not configured"
        echo "Please run:"
        echo "  npm install -g copilot-mcp-server"
        echo "  claude mcp add copilot -- copilot-mcp-server"
    fi
else
    echo "❌ MCP service is not available"
    echo "Please ensure MCP is properly configured"
fi