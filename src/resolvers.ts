export const books = [
  { id: '1', title: 'The Odyssey', author: 'Homer' },
  { id: '2', title: 'Pride and Prejudice', author: 'Jane Austen' },
  { id: '3', title: '1984', author: 'George Orwell' },
  { id: '4', title: 'To Kill a Mockingbird', author: 'Harper Lee' },
  { id: '5', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
  { id: '6', title: 'Jane Eyre', author: 'Charlotte Brontë' },
  { id: '7', title: 'Wuthering Heights', author: 'Emily Brontë' },
  { id: '8', title: 'Moby Dick', author: 'Herman Melville' },
  { id: '9', title: 'War and Peace', author: 'Leo Tolstoy' },
  { id: '10', title: 'The Catcher in the Rye', author: 'J.D. Salinger' }
];

export const resolvers = {
  Query: {
    hello: () => 'Hello from Fastify + Apollo',
    books: () => books,
    book: (_parent: unknown, args: { id: string }) => books.find((book) => book.id === args.id) ?? null
  }
};
