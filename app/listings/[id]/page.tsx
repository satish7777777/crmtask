import React, { Suspense } from "react";
import ListingDetailClient from "@/components/ListingDetailClient";
import { getListings } from "@/lib/json-storage";

export const instant = false;

export async function generateStaticParams() {
  try {
    const listings = await getListings();
    return listings.map((l) => ({ id: l.id }));
  } catch {
    return [];
  }
}

async function ListingDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolved = await params;
  return <ListingDetailClient id={resolved.id} />;
}

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ListingDetailContent params={params} />
    </Suspense>
  );
}
