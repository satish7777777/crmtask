import { JVListing, ListingFilterParams, ListingStats } from "@/types/listing";
import {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  writeListingsToFile,
} from "./json-storage";

export { getListings, getListingById, createListing, updateListing, deleteListing };

/**
 * Retrieves all listings with optional multi-attribute filters.
 */
export async function getAllListings(
  filters?: ListingFilterParams
): Promise<JVListing[]> {
  const listings = await getListings();

  if (!filters) {
    return listings;
  }

  return listings.filter((item) => {
    // 1. Search term (matches JV ID, location, feasibilityMadeBy, updatedBy, or area)
    if (filters.search && filters.search.trim() !== "") {
      const q = filters.search.toLowerCase().trim();
      const matchId = item.id.toLowerCase().includes(q);
      const matchLocation = item.location.toLowerCase().includes(q);
      const matchFeasibility = item.feasibilityMadeBy.toLowerCase().includes(q);
      const matchUpdated = item.updatedBy.toLowerCase().includes(q);
      const matchArea = item.area.toLowerCase().includes(q);
      const matchRera = item.reraNo.toLowerCase().includes(q);

      if (
        !matchId &&
        !matchLocation &&
        !matchFeasibility &&
        !matchUpdated &&
        !matchArea &&
        !matchRera
      ) {
        return false;
      }
    }

    // 2. Feasibility Made By
    if (
      filters.feasibilityMadeBy &&
      filters.feasibilityMadeBy !== "All" &&
      filters.feasibilityMadeBy !== ""
    ) {
      if (
        item.feasibilityMadeBy.toLowerCase() !==
        filters.feasibilityMadeBy.toLowerCase()
      ) {
        return false;
      }
    }

    // 3. Status
    if (
      filters.status &&
      filters.status !== "All Statuses" &&
      filters.status !== ""
    ) {
      if (item.status.toLowerCase() !== filters.status.toLowerCase()) {
        return false;
      }
    }

    // 4. Location
    if (
      filters.location &&
      filters.location !== "All Locations" &&
      filters.location !== ""
    ) {
      if (
        !item.location.toLowerCase().includes(filters.location.toLowerCase())
      ) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Bulk imports listings from an array of JVListing objects.
 */
export async function importListings(newListings: JVListing[]): Promise<number> {
  const current = await getListings();
  const existingMap = new Map(current.map((item) => [item.id, item]));

  for (const item of newListings) {
    if (item.id) {
      existingMap.set(item.id, item);
    }
  }

  const merged = Array.from(existingMap.values());
  await writeListingsToFile(merged);
  return merged.length;
}

/**
 * Calculates aggregate stats for dashboard metrics.
 */
export async function getListingStats(): Promise<ListingStats> {
  const listings = await getListings();

  const total = listings.length;
  const active = listings.filter(
    (l) => l.sharing && l.sharing !== "TBD" && l.sharing !== ""
  ).length;
  const pending = listings.filter(
    (l) => !l.sharing || l.sharing === "TBD" || l.sharing === "Nil"
  ).length;
  const closed = listings.filter((l) => l.status && l.status.toLowerCase().includes("closed")).length;

  const locations = new Set(
    listings.map((l) => l.location.split(",")[0].trim()).filter(Boolean)
  );

  return {
    total,
    active,
    pending,
    closed,
    totalLocations: locations.size,
  };
}
