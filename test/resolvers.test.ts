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
});
