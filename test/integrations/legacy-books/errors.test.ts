import {
  createDownstreamIntegrationError,
  mapHttpStatusToDownstreamError,
  mapUnknownDownstreamError
} from '../../../src/integrations/legacy-books/errors';

describe('legacy-books errors', () => {
  test('creates expected code and message pairs', () => {
    const timeoutError = createDownstreamIntegrationError('DOWNSTREAM_TIMEOUT');

    expect(timeoutError.code).toBe('DOWNSTREAM_TIMEOUT');
    expect(timeoutError.message).toBe('Downstream request timed out');

    const unavailableError = mapHttpStatusToDownstreamError(503);
    expect(unavailableError.code).toBe('DOWNSTREAM_UNAVAILABLE');
    expect(unavailableError.message).toBe('Downstream service unavailable');
  });

  test('preserves cause and context metadata', () => {
    const sourceCause = new Error('socket closed');
    const error = createDownstreamIntegrationError('DOWNSTREAM_UNAVAILABLE', {
      cause: sourceCause,
      context: { service: 'legacy-books', operation: 'fetchBookByIsbn' },
      status: 503
    });

    expect(error.cause).toBe(sourceCause);
    expect(error.context).toEqual({
      service: 'legacy-books',
      operation: 'fetchBookByIsbn'
    });
    expect(error.status).toBe(503);
  });

  test('classifies unknown failures as DOWNSTREAM_UNEXPECTED', () => {
    const error = mapUnknownDownstreamError(new Error('kaboom'), {
      operation: 'fetchStoreById'
    });

    expect(error.code).toBe('DOWNSTREAM_UNEXPECTED');
    expect(error.message).toBe('Unexpected downstream failure');
    expect(error.context).toEqual({ operation: 'fetchStoreById' });
  });
});
