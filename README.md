# copilot-agent-skills

A collection of agents, skills, prompts for GitHub Copilot (or similar), with a minimal Node 24 + TypeScript example using Fastify and Apollo Server with a simple GraphQL endpoint and Jest tests, useful for testing with Copilot.

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
    author {
      id
      name
      birthdate
    }
  }
  authors {
    id
    name
  }
}
```

You can also fetch a single author by id:

```graphql
query {
  author(id: "2") {
    id
    name
    birthdate
    books {
      id
      title
    }
  }
}
```
