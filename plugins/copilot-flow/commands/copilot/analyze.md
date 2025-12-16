---
name: analyze
argument-hint: "[task description]"
description: Execute the first stage of the workflow - requirements analysis (executed by Claude)
allowed-tools: ["Read", "Write", "Bash", "Glob", "Grep"]
---

# Copilot Flow: Analyze Phase

Execute the requirements analysis stage of the workflow. This stage is handled by Claude, which deeply analyzes user requirements and prepares structured prompts.

## Usage

```
/copilot:analyze [task description]
```

## Execution Steps

1. **Analyze User Request**
   - Identify core requirements
   - Find implicit constraints
   - Confirm target users

2. **Gather Context Information**
   - Scan relevant files
   - Identify existing patterns
   - Check dependencies

3. **Prepare Structured Prompt**
   ```
   # Goal
   [Broad description]

   # Requirements
   - Requirement 1
   - Requirement 2

   # Example
   Input: [...]
   Output: [...]

   # Context
   Files: [...]
   Functions/Classes: [...]
   Constraints: [...]
   ```

4. **Identify Model Requirements**
   - Select appropriate Copilot model based on task type
   - Record selection rationale

5. **Generate Analysis Summary**
   - Requirements summary
   - Technical constraints
   - Recommended next steps

## Output

- Contains prepared structured prompts
- Generates stage transition suggestions

## Example

```
/copilot:analyze Implement a REST API for user authentication with JWT token and refresh mechanism
```

The output will include:
- API endpoint requirements analysis
- Security constraint identification
- Structured prompt preparation
- Recommended architecture design model (claude-opus-4.5)

## Important Notes

- This stage does not involve Copilot MCP calls
- Focus is on requirement understanding and structuring
- Results will be used for architecture design in the next stage