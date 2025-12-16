---
name: deliver
argument-hint: "[review report or delivery goals]"
description: Execute the final stage of the workflow - delivery (consolidated by Claude with all feedback)
allowed-tools: ["Read", "Write", "Edit", "Bash"]
---

# Copilot Flow: Deliver Phase

Execute the delivery stage of the workflow. Claude consolidates results and feedback from all stages to provide the final deliverables.

## Usage

```
/copilot:deliver [review report or delivery goals]
```

## Prerequisites

- Must complete all preceding stages (analyze, design, implement, review)
- Have `code-review-report.md` or specific delivery requirements
- Critical review issues have been addressed

## Execution Steps

1. **Collect All Stage Outputs**
   - Analysis results (`analysis-result.md`)
   - Design document (`architecture-design.md`)
   - Implementation report (`implementation-report.md`)
   - Review report (`code-review-report.md`)

2. **Comprehensive Assessment**
   - Compare original requirements with final implementation
   - Check if all goals are achieved
   - Identify unresolved issues

3. **Handle Review Feedback**
   - Fix high-priority issues
   - Record reasons for unadopted suggestions
   - Prepare technical debt list

4. **Generate Delivery Documentation**
   - Feature descriptions
   - API documentation
   - Deployment guide
   - Maintenance instructions

5. **Generate Final Report**
   - Workflow summary
   - List of implemented features
   - Performance metrics
   - Future improvement suggestions

## Delivery Contents

### Core Deliverables
1. **Source Code**
   - Clean and well-commented code
   - Meets project standards
   - Includes necessary configuration files

2. **Documentation**
   - API reference documentation
   - Architecture description
   - Deployment and configuration guide
   - Troubleshooting guide

3. **Tests**
   - Unit tests
   - Integration tests
   - Test reports

4. **Operational Support**
   - Monitoring configuration
   - Logging configuration
   - Backup strategy

### Optional Deliverables
- Performance benchmarking
- Security scan report
- Code coverage report
- Deployment scripts

## Output

- `delivery-package/` - Complete delivery package
- `final-delivery-report.md` - Final delivery report
- `workflow-summary.md` - Workflow summary
- Complete records of all stages

## Example

```
/copilot:deliver Prepare the final delivery of the user authentication system
```

## Final Report Format

```markdown
# Final Delivery Report

## Project Overview
- Requirements: [Original requirements]
- Implementation: [Feature list]
- Status: ✅ Complete

## Workflow Summary
| Stage | Model | Duration | Output |
|-------|-------|----------|---------|
| Analysis | Claude | 15 min | Requirements document |
| Design | Copilot | 20 min | Architecture design |
| Implementation | Claude | 60 min | Code implementation |
| Review | Copilot | 15 min | Review report |
| Delivery | Claude | 10 min | Delivery package |

## Quality Metrics
- Code Coverage: 85%
- Review Issues: 5 (4 fixed)
- Performance Tests: Passed
- Security Scan: Passed

## Next Steps
1. Deploy to test environment
2. Conduct user acceptance testing
3. Deploy to production environment
```

## Important Notes

- Ensure all deliverables undergo final checks
- Keep complete workflow records
- Prepare follow-up support plan
- Collect user feedback for improvement