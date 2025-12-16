@echo off
echo Checking Copilot MCP server...

REM Try to list MCP servers
claude mcp list >nul 2>&1

if %errorlevel% equ 0 (
    echo ✅ MCP service is available

    REM Check if copilot server is configured
    claude mcp list | findstr /C:"copilot" >nul
    if %errorlevel% equ 0 (
        echo ✅ Copilot MCP server is configured
        echo Testing Copilot connection...
        echo Use mcp__copilot__ask-copilot with prompt="test connection"
    ) else (
        echo ❌ Copilot MCP server is not configured
        echo Please run:
        echo   npm install -g copilot-mcp-server
        echo   claude mcp add copilot -- copilot-mcp-server
    )
) else (
    echo ❌ MCP service is not available
    echo Please ensure MCP is properly configured
)

pause