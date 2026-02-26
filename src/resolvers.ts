export const books = [
  { id: '1', title: 'The Odyssey', author: 'Homer' },
  { id: '2', title: 'Pride and Prejudice', author: 'Jane Austen' }
];

export const resolvers = {
  Query: {
    hello: () => 'Hello from Fastify + Apollo',
    books: () => books
  }
};
