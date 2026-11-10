import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { JVListing } from "@/types/listing";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "jv-listings.json");

/**
 * Ensures data directory exists and returns safe file path.
 */
async function ensureStorageFile(): Promise<void> {
  const dir = path.dirname(DATA_FILE_PATH);
  try {
    await mkdir(dir, { recursive: true });
  } catch {
    // Directory already exists or cannot be created
  }
}

/**
 * getListings()
 * Responsibility: Read all JV listing records from jv-listings.json using fs/promises.
 */
export async function getListings(): Promise<JVListing[]> {
  try {
    await ensureStorageFile();
    const raw = await readFile(DATA_FILE_PATH, "utf-8");
    if (!raw.trim()) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      // File does not exist yet; initialize it
      await writeFile(DATA_FILE_PATH, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    console.error("Error in getListings():", error);
    return [];
  }
}

/**
 * getListingById(id)
 * Responsibility: Find one JV listing record by its unique JV ID.
 */
export async function getListingById(id: string): Promise<JVListing | null> {
  const listings = await getListings();
  const found = listings.find((item) => item.id.toLowerCase() === id.trim().toLowerCase());
  return found || null;
}

/**
 * createListing(data)
 * Responsibility: Add a new JV listing record.
 * Generates an ID if not provided, preserves original values, and appends to storage.
 */
export async function createListing(data: Partial<JVListing>): Promise<JVListing> {
  const listings = await getListings();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.toLocaleString("en-US", { month: "short" }).toUpperCase();

  // If ID is not provided, generate in format YYYY.MMM.XXX
  const generatedId =
    data.id && data.id.trim() !== ""
      ? data.id.trim()
      : `${year}.${month}.${String(listings.length + 100)}`;

  const newListing: JVListing = {
    id: generatedId,
    feasibilityMadeBy: data.feasibilityMadeBy || "",
    updatedBy: data.updatedBy || "",
    reraNo: data.reraNo || "",
    ratings: data.ratings !== undefined ? data.ratings : 3,
    googlePin: data.googlePin || "",
    location: data.location || "",
    area: data.area || "",
    roadWidth: data.roadWidth || "",
    goodwill: data.goodwill || "",
    sharing: data.sharing || "",
    loiStatus: data.loiStatus || "",
    mou: data.mou || "",
    jdaLlp: data.jdaLlp || "",
    status: data.status || "",
    notes: data.notes || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Add to beginning of array so newest shows first
  listings.unshift(newListing);
  await ensureStorageFile();
  await writeFile(DATA_FILE_PATH, JSON.stringify(listings, null, 2), "utf-8");

  return newListing;
}

/**
 * updateListing(id, data)
 * Responsibility: Update an existing JV listing record by its JV ID.
 */
export async function updateListing(
  id: string,
  data: Partial<JVListing>
): Promise<JVListing | null> {
  const listings = await getListings();
  const index = listings.findIndex(
    (item) => item.id.toLowerCase() === id.trim().toLowerCase()
  );

  if (index === -1) {
    return null;
  }

  const existing = listings[index];
  const updated: JVListing = {
    ...existing,
    ...data,
    id: existing.id, // Immutable ID
    updatedAt: new Date().toISOString(),
  };

  listings[index] = updated;
  await ensureStorageFile();
  await writeFile(DATA_FILE_PATH, JSON.stringify(listings, null, 2), "utf-8");

  return updated;
}

/**
 * deleteListing(id)
 * Responsibility: Delete a JV listing record by its JV ID.
 */
export async function deleteListing(id: string): Promise<boolean> {
  const listings = await getListings();
  const index = listings.findIndex(
    (item) => item.id.toLowerCase() === id.trim().toLowerCase()
  );

  if (index === -1) {
    return false;
  }

  listings.splice(index, 1);
  await ensureStorageFile();
  await writeFile(DATA_FILE_PATH, JSON.stringify(listings, null, 2), "utf-8");

  return true;
}

// Aliases for compatibility
export const readListingsFromFile = getListings;
export const writeListingsToFile = async (listings: JVListing[]): Promise<boolean> => {
  try {
    await ensureStorageFile();
    await writeFile(DATA_FILE_PATH, JSON.stringify(listings, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("writeListingsToFile error:", error);
    return false;
  }
};
