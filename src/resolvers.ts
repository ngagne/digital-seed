// Static data representing a simple in-memory catalog.  
// The schema now models authors as a first‑class type, so books
// reference their author via `authorId` instead of a plain string.
export const books = [
  // examples demonstrating a book with a single genre, multiple genres,
  // and no genres at all
  { id: '1', title: 'The Odyssey', authorId: '1', genreIds: ['1'] },
  { id: '2', title: 'Pride and Prejudice', authorId: '2', genreIds: ['1', '3'] },
  { id: '3', title: '1984', authorId: '3', genreIds: ['2'] },
  { id: '4', title: 'To Kill a Mockingbird', authorId: '4', genreIds: [] },
  { id: '5', title: 'The Great Gatsby', authorId: '5', genreIds: ['1'] },
  { id: '6', title: 'Jane Eyre', authorId: '6', genreIds: ['3'] },
  { id: '7', title: 'Wuthering Heights', authorId: '7', genreIds: ['1', '3'] },
  { id: '8', title: 'Moby Dick', authorId: '8', genreIds: ['1'] },
  { id: '9', title: 'War and Peace', authorId: '9', genreIds: ['1', '2'] },
  { id: '10', title: 'The Catcher in the Rye', authorId: '10', genreIds: [] }
];

export const authors = [
  { id: '1', name: 'Homer', birthdate: '0800-01-01' },
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

export const genres = [
  { id: '1', name: 'Classics' },
  { id: '2', name: 'Science Fiction' },
  { id: '3', name: 'Romance' },
  { id: '4', name: 'Non-Fiction' }
];

export const resolvers = {
  Query: {
    hello: () => 'Hello from Fastify + Apollo',
    books: () => [...books],
    book: (_parent: unknown, args: { id: string }) => books.find((book) => book.id === args.id) ?? null,
    authors: () => [...authors],
    author: (_parent: unknown, args: { id: string }) =>
      authors.find((a) => a.id === args.id) ?? null,
    genres: () => [...genres],
    genre: (_parent: unknown, args: { id: string }) => genres.find((g) => g.id === args.id) ?? null
  },

  Mutation: {
    // add a new author to the in-memory list and return it
    addAuthor: (_parent: unknown, args: { name: string; birthdate: string }) => {
      const nextId = String(authors.length + 1);
      const newAuthor = { id: nextId, name: args.name, birthdate: args.birthdate };
      authors.push(newAuthor);
      return newAuthor;
    },

    // add a new book; author existence is not validated here so that the
    // resolver for `Book.author` can demonstrate the nullable branch
    // newly created books receive an empty genreIds array by default
    addBook: (_parent: unknown, args: { title: string; authorId: string }) => {
      const nextId = String(books.length + 1);
      const newBook = { id: nextId, title: args.title, authorId: args.authorId, genreIds: [] };
      books.push(newBook);
      return newBook;
    }
  },

  Book: {
    // resolve author field by looking up the corresponding author record
    author: (book: { authorId: string }) =>
      authors.find((a) => a.id === book.authorId) ?? null,
    // return genre objects for the book; gracefully handle absent lists
    genres: (book: { genreIds?: string[] }) =>
      genres.filter((g) => book.genreIds?.includes(g.id))
  },

  Author: {
    // for an author, return all books that reference them
    books: (author: { id: string }) => books.filter((b) => b.authorId === author.id)
  }
};
