import Fastify from 'fastify';
import { ApolloServer } from '@apollo/server';
import fastifyApollo from '@as-integrations/fastify';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';

const server = new ApolloServer({ typeDefs, resolvers });

async function start() {
  const app = Fastify();

  await server.start();

  app.register(fastifyApollo(server), { path: '/graphql' });

  app.get('/', async () => ({ status: 'ok', message: 'Hello from Fastify + Apollo' }));

  try {
    const port = Number(process.env.PORT) || 4000;
    await app.listen({ port });
    console.log(`Server listening at http://localhost:${port}/graphql`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
