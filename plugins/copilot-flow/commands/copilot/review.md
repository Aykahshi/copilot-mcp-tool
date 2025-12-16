---
name: review
argument-hint: "[implementation report or code paths]"
description: Execute the fourth stage of the workflow - review (using Copilot MCP)
allowed-tools: ["mcp__plugin__copilot__ask-copilot", "mcp__plugin__copilot__copilot-review", "mcp__plugin__copilot__copilot-session-start", "Read", "Write"]
---

# Copilot Flow: Review Phase

Execute the review stage of the workflow. Use Copilot MCP to perform professional review of the implemented code.

## Usage

```
/copilot:review [implementation report or code paths]
```

## Prerequisites

- Must complete implement stage first
- Have `implementation-report.md` or specific code paths
- Ensure Copilot MCP server is available

## Execution Steps

1. **Verify MCP Connection**
   - Check Copilot MCP server status
   - If unavailable, prompt user and exit

2. **Collect Review Materials**
   - Read `implementation-report.md`
   - Get code differences (changes-summary.md)
   - Identify key files that need review

3. **Start Copilot Review Session**
   ```javascript
   Use mcp__plugin__copilot__copilot-session-start
   Can restore previous session or create new session
   ```

4. **Execute Code Review**
   Use the following MCP tools:

   - **Primary Review**: `mcp__plugin__copilot__copilot-review`
     - code: [Implemented code]
     - focusAreas: ["security", "performance", "maintainability", "best-practices"]

   - **Debug Issues** (if found): `mcp__plugin__copilot__copilot-debug`
     - code: [Problematic code]
     - error: [Error message]
     - context: [Relevant context]

5. **Deep Review (Optional)**
   Use the following MCP tools for specific issues deep dive:

   - **Architecture Analysis**: `mcp__plugin__copilot__ask-copilot`
     - prompt: "Analyze the architectural consistency of this code: [code]"
     - model: [Selected model]

   - **Security Scan**: `mcp__plugin__copilot__ask-copilot`
     - prompt: "Identify security vulnerabilities in the following code: [code]"
     - model: [Selected model]

   - **Test Generation**: `mcp__plugin__copilot__copilot-test-generate`
     - code: [Code that needs testing]
     - framework: [Testing framework, e.g., jest, pytest]

6. **Generate Review Report**
   - Consolidate all findings
   - Prioritize issues
   - Provide specific improvement suggestions

## Review Focus Areas

### Security
- SQL injection protection
- XSS protection
- Authentication and authorization
- Sensitive data handling

### Performance
- Algorithm efficiency
- Database query optimization
- Caching strategies
- Concurrency handling

### Code Quality
- Readability
- Maintainability
- Error handling
- Test coverage

### Architectural Consistency
- Adherence to design document
- Modularity level
- Dependency management
- Scalability

## Output

- `code-review-report.md` - Detailed review report
- `improvement-suggestions.md` - Improvement suggestions
- Review stage records
- Generate new checksum summary

## Example

```
/copilot:review Review the newly implemented user authentication system
```

## Review Report Format

```markdown
# Code Review Report

## Overall Score
- Security: 8/10
- Performance: 7/10
- Maintainability: 9/10
- Best Practices: 8/10

## Issues Found

### High Priority
1. [Security] Need to add rate limiting
2. [Performance] N+1 query problem

### Medium Priority
1. [Readability] Suggest refactoring certain functions
2. [Testing] Missing boundary condition tests

### Low Priority
1. [Style] Unify error message format
```

## Important Notes

- Review results are suggestions only, final decisions made by Claude
- Critical issues must be resolved before delivery
- All review findings should be recorded for future reference