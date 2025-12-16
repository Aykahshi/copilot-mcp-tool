---
name: implement
argument-hint: "[design document or implementation goals]"
description: Execute the third stage of the workflow - implementation (executed by Claude based on Copilot suggestions)
allowed-tools: ["Read", "Write", "Edit", "Bash", "Glob", "Grep"]
---

# Copilot Flow: Implement Phase

Execute the implementation stage of the workflow. Claude implements actual code based on Copilot's design recommendations.

## Usage

```
/copilot:implement [design document or implementation goals]
```

## Prerequisites

- Must complete design stage first
- Have clear architecture design document
- Understand specific features to implement

## Execution Steps

1. **Load Design Document**
   - Read `architecture-design.md`
   - Understand design decisions and constraints
   - Identify key implementation points

2. **Retrieve Related Code**
   - Search for existing related implementations
   - Understand project architecture patterns
   - Identify files that need modification

3. **Create Implementation Plan**
   - Break design into specific tasks
   - Determine implementation order
   - Identify potential risk points

4. **Implement Step by Step**
   - Follow Copilot's design recommendations
   - Apply best practices
   - Ensure code quality

5. **Self-Review**
   - Check adherence to design
   - Verify code logic
   - Ensure consistency

6. **Generate Change Report**
   - List all modified files
   - Explain reasons for changes
   - Prepare diff report

## Implementation Principles

### Responsibility Separation
- **Claude**: Responsible for actual code implementation
- **Copilot**: Only provides design guidance and suggestions

### Follow Design
- Strictly follow Copilot's architecture recommendations
- Do not deviate from established design decisions
- If adjustments needed, record reasons and prepare for discussion in review stage

### Code Quality
- Follow project coding standards
- Add necessary comments
- Ensure readability and maintainability

## Output

- Actual code implementation (via Write/Edit tools)
- `implementation-report.md` - Implementation report
- `changes-summary.md` - Changes summary
- Implementation stage records

## Example

```
/copilot:implement Implement user authentication API, following the previously designed architecture
```

## Important Notes

- If design issues are discovered during implementation, record them but do not modify immediately
- Keep code clean and modular
- Prepare for the next review stage