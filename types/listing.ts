export interface JVListing {
  id: string; // JV ID (e.g. "2026.OCT.142")
  feasibilityMadeBy: string;
  updatedBy: string;
  reraNo: string;
  ratings: number | string;
  googlePin: string;
  location: string;
  area: string;
  roadWidth: string;
  goodwill: string;
  sharing: string;
  loiStatus: string;
  mou: string;
  jdaLlp: string;
  status: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Alias for backward compatibility if any component references Listing
export type Listing = JVListing;

export interface ListingFilterParams {
  search?: string;
  feasibilityMadeBy?: string;
  status?: string;
  location?: string;
  area?: string;
}

export interface ListingStats {
  total: number;
  active: number;
  pending: number;
  closed: number;
  totalLocations: number;
}
