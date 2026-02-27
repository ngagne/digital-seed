import { resolvers, books, authors } from '../src/resolvers';

describe('resolvers', () => {
  test('hello returns expected string', () => {
    const result = resolvers.Query.hello();
    expect(result).toBe('Hello from Fastify + Apollo');
  });

  test('books returns static array', () => {
    const result = resolvers.Query.books();
    expect(result).toEqual(books);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  test('book returns matching book for valid id', () => {
    const result = resolvers.Query.book(null, { id: '3' });
    expect(result).toEqual(books[2]);
  });

  test('book returns null for unknown id', () => {
    const result = resolvers.Query.book(null, { id: '999' });
    expect(result).toBeNull();
  });

  test('authors returns static array', () => {
    const result = resolvers.Query.authors();
    expect(result).toEqual(authors);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  test('author returns matching author for valid id', () => {
    const result = resolvers.Query.author(null, { id: '2' });
    expect(result).toEqual(authors[1]);
  });

  test('author returns null for unknown id', () => {
    const result = resolvers.Query.author(null, { id: '999' });
    expect(result).toBeNull();
  });

  test('Book.author resolver returns nested author object or null', () => {
    const book = books[0];
    const result = resolvers.Book.author(book as any);
    // author field is nullable now; if the data were corrupted we would
    // expect null instead of throwing.  For our static sample it should exist.
    expect(result).not.toBeUndefined();
    expect(result).toEqual(authors.find((a) => a.id === book.authorId));
  });

  test('Author.books resolver returns books list', () => {
    const author = authors[1];
    const result = resolvers.Author.books(author as any);
    expect(result).toEqual(books.filter((b) => b.authorId === author.id));
  });
});

// ---------- mutation behavior ------------------------------------------------
describe('mutations', () => {
  const originalAuthorCount = authors.length;
  const originalBookCount = books.length;

  test('addAuthor creates and returns a new author', () => {
    const input = { name: 'New Writer', birthdate: '2000-01-01' };
    const result = resolvers.Mutation.addAuthor(null, input);
    expect(result).toMatchObject(input);
    expect(result.id).toBe(String(originalAuthorCount + 1));
    // authors array should have been mutated
    expect(authors.length).toBe(originalAuthorCount + 1);
    expect(authors[originalAuthorCount]).toEqual(result);
  });

  test('addBook creates and returns a new book', () => {
    const input = { title: 'Fresh Title', authorId: '1' };
    const result = resolvers.Mutation.addBook(null, input);
    expect(result).toMatchObject(input);
    expect(result.id).toBe(String(originalBookCount + 1));
    expect(books.length).toBe(originalBookCount + 1);
    expect(books[originalBookCount]).toEqual(result);
    // the author resolver should still function for the newly added book
    const authorForNew = resolvers.Book.author(result as any);
    expect(authorForNew).toEqual(authors.find((a) => a.id === input.authorId));
  });

  afterAll(() => {
    // restore original arrays to avoid side effects on other tests
    authors.splice(originalAuthorCount);
    books.splice(originalBookCount);
  });

});
