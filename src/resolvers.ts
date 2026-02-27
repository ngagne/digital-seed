// Static data representing a simple in-memory catalog.  
// The schema now models authors as a first‑class type, so books
// reference their author via `authorId` instead of a plain string.
export const books = [
  { id: '1', title: 'The Odyssey', authorId: '1' },
  { id: '2', title: 'Pride and Prejudice', authorId: '2' },
  { id: '3', title: '1984', authorId: '3' },
  { id: '4', title: 'To Kill a Mockingbird', authorId: '4' },
  { id: '5', title: 'The Great Gatsby', authorId: '5' },
  { id: '6', title: 'Jane Eyre', authorId: '6' },
  { id: '7', title: 'Wuthering Heights', authorId: '7' },
  { id: '8', title: 'Moby Dick', authorId: '8' },
  { id: '9', title: 'War and Peace', authorId: '9' },
  { id: '10', title: 'The Catcher in the Rye', authorId: '10' }
];

export const authors = [
  { id: '1', name: 'Homer', birthdate: '-0800-01-01' },
  { id: '2', name: 'Jane Austen', birthdate: '1775-12-16' },
  { id: '3', name: 'George Orwell', birthdate: '1903-06-25' },
  { id: '4', name: 'Harper Lee', birthdate: '1926-04-28' },
  { id: '5', name: 'F. Scott Fitzgerald', birthdate: '1896-09-24' },
  { id: '6', name: 'Charlotte Brontë', birthdate: '1816-04-21' },
  { id: '7', name: 'Emily Brontë', birthdate: '1818-07-30' },
  { id: '8', name: 'Herman Melville', birthdate: '1819-08-01' },
  { id: '9', name: 'Leo Tolstoy', birthdate: '1828-09-09' },
  { id: '10', name: 'J.D. Salinger', birthdate: '1919-01-01' }
];

export const resolvers = {
  Query: {
    hello: () => 'Hello from Fastify + Apollo',
    books: () => books,
    book: (_parent: unknown, args: { id: string }) => books.find((book) => book.id === args.id) ?? null,
    authors: () => authors,
    author: (_parent: unknown, args: { id: string }) =>
      authors.find((a) => a.id === args.id) ?? null
  },

  Book: {
    // resolve author field by looking up the corresponding author record
    author: (book: { authorId: string }) =>
      authors.find((a) => a.id === book.authorId) ?? null
  },

  Author: {
    // for an author, return all books that reference them
    books: (author: { id: string }) => books.filter((b) => b.authorId === author.id)
  }
};
