---
name: add-graphql-operation
description: 'Add a new GraphQL Query or Mutation end-to-end in this project with validation and tests. Use when asked to "add a graphql query", "add a mutation", "extend graphql schema", "add resolver for graphql", or "implement graphql operation and release". Updates schema and resolvers, validates schema standards and backward compatibility, adds unit tests, ensures tests pass, and then executes the release skill.'
---

# Add GraphQL Operation

Implement a new GraphQL operation using the project workflow and existing skills.

## Workflow

### 1) Gather operation requirements

- Confirm whether the operation is a `Query` or `Mutation`.
- Confirm operation name, arguments, return type, and expected behavior.
- Confirm whether this change is additive or intentionally breaking.

### 2) Update GraphQL schema

- Edit [`src/schemas/schema.graphql`](../../../src/schemas/schema.graphql).
- Add the operation under `type Query` or `type Mutation`.
- Add or update supporting object/input types as needed.
- Keep naming and nullability choices explicit and intentional.

### 3) Validate schema standards

- Execute the `review-graphql-spec` skill.
- If schema validation/standards violations are found, fix them before moving on.

### 4) Validate backward compatibility

- Treat additive changes as backward-compatible by default.
- If editing/removing existing fields or changing argument/return type compatibility, flag this as a breaking change.
- When a breaking change is required, keep explicit justification in the final report.

### 5) Add resolver implementation

- Update [`src/resolvers.ts`](../../../src/resolvers.ts) to implement the new operation.
- Keep resolver behavior deterministic and aligned with schema types.
- If needed, add minimal supporting state/constants in the same file.

### 6) Add or update unit tests

- Update [`test/resolvers.test.ts`](../../../test/resolvers.test.ts) with coverage for the new operation.
- Verify both expected return value and core behavior.
- Keep existing tests passing and avoid weakening assertions.

### 7) Ensure unit tests pass

- Execute the `ensure-unit-tests-pass` skill.
- This must run tests, attempt one fix pass when needed, and rerun tests.
- If failures remain after the fix pass, stop and report before release.

### 8) Execute release workflow

- If tests pass, execute the `release` skill.
- Do not run release when tests are still failing.

## Guardrails

- Do not change workflow order.
- Do not claim backward compatibility if a breaking schema change was introduced.
- Keep edits focused on schema, resolver, and unit tests unless failures require related fixes.
- Report files changed and whether release completed.
