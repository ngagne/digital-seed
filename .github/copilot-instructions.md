# Copilot Instructions for This Repository

## Project Snapshot
- Runtime: Node.js `>=24`
- Language: TypeScript with ESM modules
- API stack: Fastify + Apollo Server (GraphQL endpoint at `/graphql`)
- Tests: Jest + `ts-jest` in ESM mode

## Source Layout
- `src/server.ts`: Fastify + Apollo bootstrap and route registration.
- `src/schema.ts` + `src/schemas/schema.graphql`: GraphQL schema loading and SDL.
- `src/resolvers.ts`: Query/Mutation resolvers and resolver dependency wiring.
- `src/integrations/legacy-books/*`: Downstream API client, types, transformers, and error model.
- `openapi.yaml`: Contract for the legacy downstream REST API.
- `test/*.test.ts`: Jest unit tests.

## Coding Conventions
- Keep TypeScript `strict` mode assumptions intact; avoid `any` unless unavoidable.
- Use ESM imports and include `.js` extensions in local TypeScript imports (as done in `src/*`).
- Favor explicit, narrow types for resolver args and integration payloads.
- Keep functions small and defensive, especially at API boundaries.
- Prefer immutable returns for query resolvers (`[...items]`) when returning shared in-memory arrays.

## GraphQL Change Rules
- If you change `src/schemas/schema.graphql`, update resolvers in `src/resolvers.ts` accordingly.
- Keep schema descriptions and nullability accurate; don’t widen/null fields without intent.
- When adding fields connected to downstream data, map downstream failures to GraphQL errors consistently.

## Legacy Integration Rules
- Treat downstream responses as untrusted input.
- Validate and normalize all downstream fields in `transformers.ts`.
- Throw `DownstreamError` with the correct `code` (`NOT_FOUND`, `VALIDATION_ERROR`, etc.) instead of generic errors.
- Preserve retry/timeout behavior in `LegacyBooksService` unless explicitly changing reliability semantics.
- If downstream contract assumptions change, update both `openapi.yaml` and `src/integrations/legacy-books/types.ts`.

## Testing Expectations
- Add or update Jest tests for resolver behavior and integration edge cases.
- Keep tests deterministic; avoid network calls in unit tests (mock `fetch`/service dependencies).
- Run these before completing changes:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run test`

## Change Quality Bar
- Prefer minimal, targeted diffs that follow existing file structure and naming.
- Avoid introducing new dependencies unless necessary.
- Update `README.md` and/or `CHANGELOG.md` when behavior or public contract changes.
