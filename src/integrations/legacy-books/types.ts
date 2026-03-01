export interface BookResponse {
  Title?: string | null;
  isbn?: string | null;
  listings?: ListingResponse[] | null;
}

export interface ListingResponse {
  storeID?: string | null;
  purchase_url?: string | null;
  created_at?: string | null;
  PRICE?: string | null;
  isInStock?: string | null;
}

export interface StoreResponse {
  id?: string | null;
  name?: string | null;
  active?: string | null;
}

export interface LegacyBookListing {
  storeId: string;
  purchaseUrl: string;
  createdAt: string;
  price: number;
  isInStock: boolean | null;
}

export interface LegacyStore {
  id: string;
  name: string;
  active: boolean | null;
}

export interface LegacyBook {
  title: string;
  isbn: string;
  listings: LegacyBookListing[];
}

export interface LegacyBookListingWithStore extends LegacyBookListing {
  store: LegacyStore;
}
