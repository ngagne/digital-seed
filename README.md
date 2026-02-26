# Example Fastify + Apollo (TypeScript)

Minimal Node 24 + TypeScript example using Fastify and Apollo Server with a simple GraphQL endpoint and Jest tests.

Commands

Install dependencies:

```bash
npm install
```

Run in development (hot restart):

```bash
npm run dev
```

Build and run:

```bash
npm run build
npm run start
```

Run tests:

```bash
npm run test
```

GraphQL endpoint: http://localhost:4000/graphql

Sample query:

```graphql
query {
  hello
  books {
    id
    title
    author
  }
}
```
