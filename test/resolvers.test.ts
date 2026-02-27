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

  test('Book.author resolver returns nested author object', () => {
    const book = books[0];
    const result = resolvers.Book.author(book as any);
    expect(result).toEqual(authors.find((a) => a.id === book.authorId));
  });

  test('Author.books resolver returns books list', () => {
    const author = authors[1];
    const result = resolvers.Author.books(author as any);
    expect(result).toEqual(books.filter((b) => b.authorId === author.id));
  });
});
