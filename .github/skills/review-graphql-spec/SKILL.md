---
name: review-graphql-spec
description: 'Validate and review GraphQL schema files for technical correctness and enterprise standards compliance. Use when asked to "review my graphql schema", "review my graphql specification", "validate graphql", or "check graphql schema". Validates schema against standard rules and your enterprise guidelines, detailing violations with explanations and solutions.'
---

# Review GraphQL Spec

A specialized skill for validating and auditing GraphQL schema files against both standard validation rules and enterprise standards.

## When to Use This Skill

- User asks to "review my graphql schema"
- User wants to "review my graphql specification"
- User asks to "validate graphql" or "check graphql schema"
- User wants to ensure GraphQL schema compliance with enterprise standards
- User needs to identify issues and violations in their GraphQL definitions

## Prerequisites

- GraphQL schema files located in `/src/schemas/*.graphql`
- `@graphql-schema/validate-schema` NPM package installed in the project
- Access to enterprise standards/guidelines documentation

## Step-by-Step Workflow

### Step 1: Validate Schema Files

1. Locate all GraphQL schema files in `/src/schemas/` directory
2. Run the validation command using `@graphql-schema/validate-schema` package
3. Capture any validation errors or warnings

### Step 2: Report Validation Errors

If validation errors are found:
1. Display each error clearly to the user
2. Provide a brief explanation of what the error means
3. Suggest a solution for each error

### Step 3: Review Against Enterprise Standards

1. Analyze the schema files against enterprise guidelines (see [Enterprise GraphQL Guidelines](./references/enterprise-standards-placeholder.md))
2. Check for:
   - Naming conventions compliance
   - Required documentation (descriptions, @deprecated directives)
   - Best practices adherence
   - Security considerations
   - Best usage of available built-in scalars and custom scalars provided by [TheGuild's graphql-scalars package](https://the-guild.dev/graphql/scalars/docs/scalars/account-number)

### Step 4: Report Standards Violations

If standards violations are found:
1. Display each violation with context
2. Provide a brief explanation of why it violates the standard
3. Suggest remediation steps
4. Offer to fix the violations found

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Schema files not found | Verify files exist in `/src/schemas/` with `.graphql` extension |
| Validation package error | Ensure `@graphql-schema/validate-schema` is installed: `npm install @graphql-schema/validate-schema` |
| Unable to find enterprise standards | Refer to [Enterprise GraphQL Guidelines](./references/enterprise-standards-placeholder.md) |
| Mixed validation and standards issues | Address validation errors first, then review against standards |

## References

- [Enterprise GraphQL Guidelines](./references/enterprise-standards-placeholder.md) - Internal standards for schema design and documentation
- GraphQL Official Documentation: <https://graphql.org/learn/>
- TheGuild's Custom Scalars: <https://the-guild.dev/graphql/scalars/docs/scalars/account-number>
- Best Practices: <https://graphql.org/learn/best-practices/>

## Example Output

When reviewing a schema, the output should be structured like:

```
VALIDATION RESULTS
==================
✓ Schema syntax is valid

STANDARDS REVIEW RESULTS
========================
⚠ Type "User" missing description
⚠ Field "createdAt" should use @deprecated directive
✗ Query naming does not follow camelCase convention
```
