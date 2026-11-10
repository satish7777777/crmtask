import { NextRequest, NextResponse } from "next/server";
import {
  getAllListings,
  createListing,
  importListings,
  getListingStats,
} from "@/lib/listing-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    if (searchParams.get("stats") === "true") {
      const stats = await getListingStats();
      return NextResponse.json({ success: true, data: stats });
    }

    const search = searchParams.get("search") || undefined;
    const feasibilityMadeBy =
      searchParams.get("feasibilityMadeBy") || searchParams.get("agent") || undefined;
    const status = searchParams.get("status") || undefined;
    const location =
      searchParams.get("location") || searchParams.get("city") || undefined;

    const listings = await getAllListings({
      search,
      feasibilityMadeBy,
      status,
      location,
    });

    return NextResponse.json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (error) {
    console.error("GET /api/listings error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle bulk import
    if (body.action === "import" && Array.isArray(body.items)) {
      const count = await importListings(body.items);
      return NextResponse.json({
        success: true,
        message: `Imported ${count} listings successfully.`,
      });
    }

    if (!body.location && !body.id) {
      return NextResponse.json(
        { success: false, message: "Location or JV ID is required." },
        { status: 400 }
      );
    }

    const created = await createListing(body);
    return NextResponse.json(
      {
        success: true,
        message: "JV Listing created successfully.",
        data: created,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/listings error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create listing" },
      { status: 500 }
    );
  }
}
