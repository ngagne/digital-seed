# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0/).

## [1.1.7] - 2026-02-26

### Added
- Add `release-fast` skill with optimized git operations and batched staging for faster releases

## [1.1.6] - 2026-02-26

### Added
- Add PowerShell, shell, and TypeScript sync scripts for skills management

## [1.1.5] - 2026-02-26

### Changed
- Update project configuration files and VS Code settings

## [1.1.4] - 2026-02-25

### Added
- Add Bruno API testing configurations for GraphQL queries and health checks

## [1.1.3] - 2026-02-25

### Changed
- Update `commit` skill documentation

## [1.1.2] - 2026-02-25

### Changed
- Update `release` and `commit` skills documentation

## [1.1.1] - 2026-02-25

### Added
- Add `add-graphql-operation` skill for end-to-end GraphQL Query and Mutation management

## [1.1.0] - 2026-02-25

### Added
- Add `book(id: ID!): Book` query to fetch a single book by id
- Add resolver and tests for book lookup by id, including not-found behavior

## [1.2.3] - 2026-02-17

### Added
- Add an `update-seed` skill to sync from seed with exclusion rules, test validation, and release chaining

## [1.2.2] - 2026-02-15

### Added
- Add an `update-npm-dependencies` skill that runs test checks, dependency update, audit fix, and release in sequence

### Changed
- Update the changelog skill instructions to consistently target `CHANGELOG.md`

## [1.2.1] - 2026-02-15

### Added
- Add a release skill that runs semver bump, changelog update, and commit in order

### Changed
- Refine the commit skill instructions for Conventional Commit automation

## [1.2.0] - 2026-02-15

### Changed
- Update the home route welcome message to a fixed text response

### Removed
- Remove the date value from the home route response message

## [1.1.0] - 2026-02-13

### Added
- Include current date in the home welcome message
