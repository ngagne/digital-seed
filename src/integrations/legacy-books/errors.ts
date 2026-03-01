export const DOWNSTREAM_ERROR_CODES = [
  'DOWNSTREAM_NOT_FOUND',
  'DOWNSTREAM_TIMEOUT',
  'DOWNSTREAM_UNAVAILABLE',
  'DOWNSTREAM_INVALID_PAYLOAD',
  'DOWNSTREAM_UNEXPECTED'
] as const;

export type DownstreamErrorCode = (typeof DOWNSTREAM_ERROR_CODES)[number];

export type DownstreamErrorContext = Record<string, unknown>;

const DOWNSTREAM_ERROR_MESSAGES: Record<DownstreamErrorCode, string> = {
  DOWNSTREAM_NOT_FOUND: 'Downstream resource not found',
  DOWNSTREAM_TIMEOUT: 'Downstream request timed out',
  DOWNSTREAM_UNAVAILABLE: 'Downstream service unavailable',
  DOWNSTREAM_INVALID_PAYLOAD: 'Downstream payload validation failed',
  DOWNSTREAM_UNEXPECTED: 'Unexpected downstream failure'
};

export interface DownstreamErrorOptions {
  message?: string;
  cause?: unknown;
  context?: DownstreamErrorContext;
  status?: number;
  retryable?: boolean;
}

export class DownstreamIntegrationError extends Error {
  readonly code: DownstreamErrorCode;
  readonly context?: DownstreamErrorContext;
  readonly status?: number;
  readonly retryable: boolean;

  constructor(code: DownstreamErrorCode, options: DownstreamErrorOptions = {}) {
    super(options.message ?? DOWNSTREAM_ERROR_MESSAGES[code], { cause: options.cause });
    this.name = 'DownstreamIntegrationError';
    this.code = code;
    this.context = options.context;
    this.status = options.status;
    this.retryable = options.retryable ?? (options.status !== undefined && options.status >= 500);
  }
}

export function isDownstreamIntegrationError(error: unknown): error is DownstreamIntegrationError {
  return error instanceof DownstreamIntegrationError;
}

export function createDownstreamIntegrationError(
  code: DownstreamErrorCode,
  options: DownstreamErrorOptions = {}
): DownstreamIntegrationError {
  return new DownstreamIntegrationError(code, options);
}

export function mapUnknownDownstreamError(
  error: unknown,
  context?: DownstreamErrorContext
): DownstreamIntegrationError {
  if (isDownstreamIntegrationError(error)) {
    return error;
  }

  return createDownstreamIntegrationError('DOWNSTREAM_UNEXPECTED', {
    cause: error,
    context
  });
}

export function mapHttpStatusToDownstreamError(
  status: number,
  context?: DownstreamErrorContext
): DownstreamIntegrationError {
  if (status === 404) {
    return createDownstreamIntegrationError('DOWNSTREAM_NOT_FOUND', { status, context, retryable: false });
  }

  if (status === 408 || status === 504) {
    return createDownstreamIntegrationError('DOWNSTREAM_TIMEOUT', { status, context, retryable: true });
  }

  if (status >= 500) {
    return createDownstreamIntegrationError('DOWNSTREAM_UNAVAILABLE', { status, context, retryable: true });
  }

  return createDownstreamIntegrationError('DOWNSTREAM_UNEXPECTED', { status, context, retryable: false });
}
