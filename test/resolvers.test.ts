/* eslint-disable @typescript-eslint/no-explicit-any */
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

  test('genres query returns all genres', () => {
    const result = resolvers.Query.genres();
    expect(result).toEqual(expect.arrayContaining([{ id: '1', name: 'Classics' }]));
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  test('genre query returns matching genre or null', () => {
    const good = resolvers.Query.genre(null, { id: '2' });
    expect(good).toEqual({ id: '2', name: 'Science Fiction' });
    const bad = resolvers.Query.genre(null, { id: '999' });
    expect(bad).toBeNull();
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

  test('Book.genres resolver returns correct genre list', () => {
    const single = books.find((b) => b.genreIds && b.genreIds.length === 1)!;
    const multiple = books.find((b) => b.genreIds && b.genreIds.length > 1)!;
    const none = books.find((b) => !b.genreIds || b.genreIds.length === 0)!;

    expect(resolvers.Book.genres(single as any)).toEqual(
      expect.arrayContaining([{ id: single.genreIds![0], name: expect.any(String) }])
    );
    expect(resolvers.Book.genres(multiple as any).length).toBeGreaterThan(1);
    expect(resolvers.Book.genres(none as any)).toEqual([]);
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
    const result = resolvers.Mutation.addBook(null, input as any);
    expect(result).toMatchObject(input);
    expect(result.id).toBe(String(originalBookCount + 1));
    expect(books.length).toBe(originalBookCount + 1);
    expect(books[originalBookCount]).toEqual(result);
    // the author resolver should still function for the newly added book
    const authorForNew = resolvers.Book.author(result as any);
    expect(authorForNew).toEqual(authors.find((a) => a.id === input.authorId));
    // newly created book should have an empty genres array by default
    expect(resolvers.Book.genres(result as any)).toEqual([]);
  });

  afterAll(() => {
    // restore original arrays to avoid side effects on other tests
    authors.splice(originalAuthorCount);
    books.splice(originalBookCount);
  });

});
