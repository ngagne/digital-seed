import {
  createDownstreamIntegrationError,
  DownstreamIntegrationError
} from './errors';
import {
  LegacyBookListing,
  LegacyStore,
  ListingResponse,
  StoreResponse
} from './types';

const DATE_PATTERN =
  /^(?<month>\d{2})\/(?<day>\d{2})\/(?<year>\d{4}) (?<hour>\d{2}):(?<minute>\d{2}):(?<second>\d{2})$/;

const makeInvalidPayloadError = (field: string, value: unknown): DownstreamIntegrationError =>
  createDownstreamIntegrationError('DOWNSTREAM_INVALID_PAYLOAD', {
    context: { field, value }
  });

const requireString = (field: string, value?: string | null): string => {
  if (!value?.trim()) {
    throw makeInvalidPayloadError(field, value);
  }
  return value.trim();
};

const parseStrictDate = (field: string, input: string): string => {
  const match = input.match(DATE_PATTERN);
  if (!match?.groups) {
    throw makeInvalidPayloadError(field, input);
  }

  const month = Number(match.groups.month);
  const day = Number(match.groups.day);
  const year = Number(match.groups.year);
  const hour = Number(match.groups.hour);
  const minute = Number(match.groups.minute);
  const second = Number(match.groups.second);

  const parsedTs = Date.UTC(year, month - 1, day, hour, minute, second);
  const parsedDate = new Date(parsedTs);

  if (
    parsedDate.getUTCFullYear() !== year ||
    parsedDate.getUTCMonth() !== month - 1 ||
    parsedDate.getUTCDate() !== day ||
    parsedDate.getUTCHours() !== hour ||
    parsedDate.getUTCMinutes() !== minute ||
    parsedDate.getUTCSeconds() !== second
  ) {
    throw makeInvalidPayloadError(field, input);
  }

  return parsedDate.toISOString();
};

const parseNumeric = (field: string, value: string): number => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    throw makeInvalidPayloadError(field, value);
  }

  return numeric;
};

export const parseYesNo = (value?: string | null): boolean | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === 'yes') {
    return true;
  }

  if (normalized === 'no') {
    return false;
  }

  return null;
};

export const transformListing = (payload: ListingResponse): LegacyBookListing => ({
  storeId: requireString('storeID', payload.storeID),
  purchaseUrl: requireString('purchase_url', payload.purchase_url),
  createdAt: parseStrictDate('created_at', requireString('created_at', payload.created_at)),
  price: parseNumeric('PRICE', requireString('PRICE', payload.PRICE)),
  isInStock: parseYesNo(payload.isInStock)
});

export const transformStore = (payload: StoreResponse): LegacyStore => ({
  id: requireString('id', payload.id),
  name: requireString('name', payload.name),
  active: parseYesNo(payload.active)
});
