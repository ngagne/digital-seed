---
name: scan-codebase
description: 'Scan a project codebase and produce an internal architecture summary focused on frameworks, entry points, API layers, data access, integrations, and module dependencies. Use when asked to analyze architecture, map layers, infer system design, or summarize how /src and /test are organized.'
---

# Scan Codebase

## Objective

Analyze only `/src` and `/test` and produce a concise internal architecture summary.

## Scope Rules

- Restrict discovery to files under `/src` and `/test`.
- Ignore `.gitignore` files entirely.
- Do not broaden scope unless the user explicitly asks.
- If `/test` does not exist, continue with `/src` and report that limitation.

## Workflow

### 1. Collect Inventory

- Enumerate files under `/src` and `/test`.
- Group files by domain/module folder.
- Identify language and framework indicators from config and imports found within scoped files.

### 2. Detect Architecture Signals

Extract and classify evidence for:

- Frameworks used (runtime, web, test, ORM/query builder, DI/container, queue/event tooling).
- Entry points (CLI/bootstrap, server start, app initialization, test bootstrap).
- API layers (controllers/routes/handlers/resolvers/middleware).
- Database interactions (ORM models, repositories, raw queries, migration access points).
- External integrations (HTTP clients, SDKs, message brokers, cache, cloud services, third-party APIs).

### 3. Build Dependency View

- Infer module-level dependencies from import/require/use statements.
- Identify high fan-in/fan-out modules and potential coupling hotspots.
- Summarize dependency direction between layers.

### 4. Infer Design Patterns

Look for explicit or implied patterns, such as:

- Layered architecture
- Hexagonal/ports-adapters
- Repository/service/controller
- CQRS/event-driven components
- Shared-kernel or feature-sliced modules

Cite the strongest file-based evidence for each pattern.

### 5. Produce the Report

Output exactly these sections:

1. Frameworks Used
2. Entry Points
3. API Layers
4. Database Interactions
5. External Integrations
6. Main Modules
7. Layer Separation
8. API Exposure
9. Data Access Patterns
10. Dependency Graph Overview
11. Observed Design Patterns
12. Assumptions and Gaps

For each section:

- Keep statements evidence-based.
- Reference concrete file paths.
- Distinguish facts vs inference.

## Output Quality Bar

- Prioritize accuracy over completeness when evidence is weak.
- Prefer short bullets over long prose.
- Call out missing signals explicitly (for example: no direct DB client usage found in scoped paths).
