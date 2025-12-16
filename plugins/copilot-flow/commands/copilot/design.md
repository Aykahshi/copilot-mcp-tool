---
name: design
argument-hint: "[design goals or analysis results]"
description: Execute the second stage of the workflow - architecture design (using Copilot MCP)
allowed-tools: ["mcp__plugin__copilot__ask-copilot", "mcp__plugin__copilot__copilot-session-start", "Write", "Read"]
---

# Copilot Flow: Design Phase

Execute the architecture design stage of the workflow. This stage uses Copilot MCP to obtain professional architecture recommendations.

## Usage

```
/copilot:design [design goals or analysis results]
```

## Prerequisites

- Must execute analyze stage first, or provide specific design goals
- Ensure Copilot MCP server is available
- Need valid Copilot CLI authentication

## Execution Steps

1. **Verify MCP Connection**
   - Check Copilot MCP server status
   - If unavailable, prompt user and exit

2. **Start Copilot Session**
   ```javascript
   Use mcp__plugin__copilot__copilot-session-start to create new session
   Record session ID for subsequent tracking
   ```

3. **Select Appropriate Model**
   Automatically select based on task type:
   - Architecture Design → `claude-sonnet-4.5`
   - Google Ecosystem → `gemini-3-pro-preview`
   - Complex System Design → `gpt-5.1-codex`

4. **Call Copilot for Design**
   Use the following MCP tools:

   - **Primary Design**: `mcp__plugin__copilot__ask-copilot`
     - prompt: [Structured prompt from analyze stage]
     - model: [Selected model]
     - allowAllTools: true (Let Copilot use all available tools)

   - **Code Explanation** (if needed): `mcp__plugin__copilot__copilot-explain`
     - code: [Code snippets to explain]
     - model: [Selected model]

   - **Technical Suggestions** (if needed): `mcp__plugin__copilot__copilot-suggest`
     - task: [Specific technical questions]
     - model: [Selected model]

5. **Record Design Decisions**
   - Save Copilot's response
   - Record selected model and rationale
   - Generate checksum summary

## Output

- `architecture-design.md` - Complete architecture design document
- `design-decisions.md` - Design decision log
- Checksum summary of design stage

## Example

```
/copilot:design Based on previous analysis results, design a scalable user authentication system
```

## Important Notes

- Copilot only provides design suggestions, does not modify any code
- All interactions are recorded for tracking and review
- Design results will be used to guide the subsequent implementation stage