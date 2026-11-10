import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

const INQUIRIES_FILE_PATH = path.join(process.cwd(), "data", "jv-inquiries.json");

interface InquiryRecord {
  id: string;
  listingId?: string;
  propertyLocation?: string;
  senderName: string;
  senderEmail: string;
  message: string;
  status: string;
  createdAt: string;
  notes?: string;
}

async function getInquiries(): Promise<InquiryRecord[]> {
  try {
    const dir = path.dirname(INQUIRIES_FILE_PATH);
    await mkdir(dir, { recursive: true });
    const raw = await readFile(INQUIRIES_FILE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const role = searchParams.get("role");

    let items = await getInquiries();

    // If requester is a customer or non-admin email provided, filter strictly to their own inquiries
    const isAdmin = role === "admin" || email?.toLowerCase() === "admin@crm.com";

    if (!isAdmin && email) {
      const lowerEmail = email.toLowerCase().trim();
      items = items.filter(
        (inq) => inq.senderEmail?.toLowerCase().trim() === lowerEmail
      );
    } else if (!isAdmin && !email) {
      // Non-admin without identifying email cannot view arbitrary inquiries
      items = [];
    }

    return NextResponse.json({
      success: true,
      count: items.length,
      data: items,
      isAdmin,
    });
  } catch (err) {
    console.error("GET /api/inquiries error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.senderName || !body.senderEmail) {
      return NextResponse.json(
        { success: false, message: "Name and email are required" },
        { status: 400 }
      );
    }

    const items = await getInquiries();

    const newInquiry: InquiryRecord = {
      id: `INQ-${Math.floor(100 + Math.random() * 900)}`,
      listingId: body.listingId || "",
      propertyLocation: body.propertyLocation || "General JV Inquiry",
      senderName: body.senderName.trim(),
      senderEmail: body.senderEmail.trim(),
      message: body.message?.trim() || "Interested in partnership memorandum.",
      status: "New",
      createdAt: new Date().toISOString(),
      notes: body.notes || "",
    };

    items.unshift(newInquiry);

    await writeFile(INQUIRIES_FILE_PATH, JSON.stringify(items, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: "Inquiry saved successfully",
      data: newInquiry,
    });
  } catch (err) {
    console.error("POST /api/inquiries error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to save inquiry" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Inquiry ID is required" },
        { status: 400 }
      );
    }

    const items = await getInquiries();
    const index = items.findIndex((inq) => inq.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Inquiry not found" },
        { status: 404 }
      );
    }

    if (status) items[index].status = status;
    if (notes !== undefined) items[index].notes = notes;

    await writeFile(INQUIRIES_FILE_PATH, JSON.stringify(items, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: "Inquiry updated successfully",
      data: items[index],
    });
  } catch (err) {
    console.error("PUT /api/inquiries error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to update inquiry" },
      { status: 500 }
    );
  }
}
