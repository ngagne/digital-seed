import { resolvers, books } from '../src/resolvers';

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
});
