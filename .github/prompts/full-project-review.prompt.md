---
name: "full-project-review"
description: "Run a comprehensive multi-skill, multi-agent review of the repository."
---

# Full Project Review

Goal:
Perform a comprehensive technical review of this repository across architecture, security, performance, and test quality.

Execution Plan:

1. Invoke skill: `scan-codebase`
2. Invoke skill: `summarize-architecture`
3. Invoke agent: `senior-engineer-reviewer`
   - Evaluate architecture
   - Assess logic clarity
   - Identify maintainability concerns
4. Invoke agent: `security-reviewer`
   - Perform secure code review
   - Apply OWASP Top 10 principles
5. Invoke agent: `performance-reviewer`
   - Identify blocking I/O
   - Flag scalability risks
6. Invoke agent: `test-quality-reviewer`
   - Assess test quality
   - Identify missing edge case coverage
7. Invoke skill: `generate-review-report`

Output Requirements:
- Executive summary
- Findings grouped by severity (`Critical`, `High`, `Medium`, `Low`)
- File path + line number references for every finding
- Concrete remediation guidance for each issue
- Overall project risk score (0-100)
