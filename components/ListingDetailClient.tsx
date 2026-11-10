"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ListingForm from "@/components/ListingForm";
import { JVListing } from "@/types/listing";
import { useAuth } from "@/components/AuthContext";
import {
  IconArrowRight,
  IconSquare,
  IconStar,
  IconSparkles,
  IconEdit,
  IconTrash,
  IconCheckCircle,
  IconShield,
} from "./Icons";

export default function ListingDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { user, isAdmin } = useAuth();

  const [listing, setListing] = useState<JVListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Customer Inquiry form state
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquirySent, setInquirySent] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch(`/api/listings/${encodeURIComponent(id)}`);
        const data = await res.json();
        if (!ignore && data.success) {
          setListing(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [id]);

  const handleDelete = async () => {
    if (!isAdmin) {
      alert("Only administrators can delete property listings.");
      return;
    }

    if (!confirm("Are you sure you want to delete this JV listing record?")) {
      return;
    }

    try {
      const res = await fetch(`/api/listings/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("Listing deleted successfully.");
        router.push("/listings");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting listing");
    }
  };

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = inquiryName.trim() || user?.name || "Customer";
    const finalEmail = inquiryEmail.trim() || user?.email || "";
    if (!finalName || !finalEmail) return;

    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing?.id,
          propertyLocation: listing?.location,
          senderName: finalName,
          senderEmail: finalEmail,
          message: inquiryMessage || "Interested in partnership memorandum.",
        }),
      });
    } catch (err) {
      console.error("Error submitting inquiry:", err);
    }

    setInquirySent(true);
    showToast("Your investment inquiry has been forwarded to the JV feasibility team.");
    setInquiryMessage("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex bg-[#F8FAFC]">
        <Sidebar
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
        <div className="flex-1 p-8 text-center flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold text-slate-800">JV Record Not Found</h2>
          <p className="text-xs text-slate-500 mt-2">
            The requested JV record could not be found in storage.
          </p>
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Sidebar with Responsive Drawer & Screen lower end alignment */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title={`JV Deal ${listing.id}`}
          onAddProperty={() => setIsEditOpen(true)}
          showAddButton={false}
          onToggleSidebar={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">
          {/* Breadcrumb / Back button */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Link
              href="/listings"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
            >
              <span className="rotate-180 inline-block">
                <IconArrowRight className="w-3.5 h-3.5" />
              </span>
              <span>Back to All Properties</span>
            </Link>

            {/* Admin Action Buttons */}
            {isAdmin && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <IconEdit className="w-3.5 h-3.5 text-blue-600" />
                  <span>Edit JV Record</span>
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <IconTrash className="w-3.5 h-3.5 text-rose-600" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>

          {toastMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 animate-fade-in">
              <IconCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Hero Property Overview Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    JV ID: {listing.id}
                  </span>
                  {listing.reraNo && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
                      REA: {listing.reraNo}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    <IconStar className="w-3 h-3 text-amber-500 fill-amber-500" />
                    Rating: {String(listing.ratings)}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {listing.location}
                </h1>

                {listing.googlePin && (
                  <p className="text-xs text-indigo-600 mt-2 font-medium">
                    <a
                      href={listing.googlePin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-indigo-800 inline-flex items-center gap-1"
                    >
                      <span>Open in Google Maps ↗</span>
                    </a>
                  </p>
                )}

                {/* Key Spec Badges */}
                <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-50 text-indigo-600">
                      <IconSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">
                        Total Area
                      </p>
                      <p className="font-extrabold text-slate-900">
                        {listing.area || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-50 text-indigo-600">
                      <IconArrowRight className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">
                        Road Width
                      </p>
                      <p className="font-extrabold text-slate-900">
                        {listing.roadWidth || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-50 text-indigo-600">
                      <IconShield className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">
                        Feasibility Done By
                      </p>
                      <p className="font-extrabold text-slate-900">
                        {listing.feasibilityMadeBy || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Goodwill & Terms Box */}
              <div className="lg:text-right bg-slate-50/80 p-5 rounded-2xl border border-slate-100 min-w-[240px]">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Goodwill Valuation
                </p>
                <p className="text-3xl font-black text-slate-900 mt-1">
                  {listing.goodwill || "TBD"}
                </p>
                <p className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-block mt-2">
                  Sharing Ratio: {listing.sharing || "TBD"}
                </p>
              </div>
            </div>
          </div>

          {/* Joint Venture Partnership Terms Card */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
                <IconSparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Spreadsheet Feasibility Record
                </h3>
                <p className="text-xs text-indigo-200">
                  Preserved original property parameters from spreadsheet
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
                <span className="text-[11px] uppercase font-semibold text-indigo-200">
                  Sharing Ratio
                </span>
                <div className="text-2xl font-black mt-1">
                  {listing.sharing || "TBD"}
                </div>
                <span className="text-[10px] text-indigo-300">Investor / Landowner</span>
              </div>

              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
                <span className="text-[11px] uppercase font-semibold text-indigo-200">
                  Goodwill
                </span>
                <div className="text-2xl font-black mt-1">
                  {listing.goodwill || "TBD"}
                </div>
                <span className="text-[10px] text-indigo-300">Upfront payment</span>
              </div>

              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
                <span className="text-[11px] uppercase font-semibold text-indigo-200">
                  Feasibility By
                </span>
                <div className="text-2xl font-black mt-1 text-emerald-300">
                  {listing.feasibilityMadeBy || "—"}
                </div>
                <span className="text-[10px] text-indigo-300">Technical evaluator</span>
              </div>

              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
                <span className="text-[11px] uppercase font-semibold text-indigo-200">
                  Updated By
                </span>
                <div className="text-2xl font-black mt-1">
                  {listing.updatedBy || "—"}
                </div>
                <span className="text-[10px] text-indigo-300">Last reviewer</span>
              </div>
            </div>
          </div>

          {/* Legal Status & Inquiry Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Documentation & Status */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Documentation & Workflow Status
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">LOI Status</p>
                    <p className="font-semibold text-slate-800 mt-1">{listing.loiStatus || "Not Sent"}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">MOU</p>
                    <p className="font-semibold text-slate-800 mt-1">{listing.mou || "Pending"}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">JDA / LLP</p>
                    <p className="font-semibold text-slate-800 mt-1">{listing.jdaLlp || "Under Draft"}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Deal Status</p>
                    <p className="font-semibold text-slate-800 mt-1">{listing.status || "Active Feasibility"}</p>
                  </div>
                </div>

                {listing.notes && (
                  <div className="pt-3 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-700 mb-1">
                      Notes & Observations
                    </h4>
                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {listing.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6">
                <h4 className="text-xs font-bold text-slate-900 mb-1">
                  Request JV Memorandum
                </h4>
                <p className="text-[11px] text-slate-400 mb-4">
                  Inquire regarding partnership sharing or schedule a site visit.
                </p>

                {inquirySent ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                    <p className="font-bold">Inquiry Transmitted!</p>
                    <p className="mt-1 text-[11px]">
                      The feasibility specialist ({listing.feasibilityMadeBy}) has been notified.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSendInquiry} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={inquiryName !== "" ? inquiryName : (user?.name || "")}
                        onChange={(e) => setInquiryName(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Your Email
                      </label>
                      <input
                        type="email"
                        value={inquiryEmail !== "" ? inquiryEmail : (user?.email || "")}
                        onChange={(e) => setInquiryEmail(e.target.value)}
                        placeholder="john@example.com"
                        required
                        className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Message / Syndicate Interest
                      </label>
                      <textarea
                        rows={2}
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        placeholder={`Interested in JV #${listing.id} at ${listing.location}...`}
                        className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold transition shadow-md shadow-indigo-600/20 cursor-pointer"
                    >
                      Submit JV Inquiry
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Edit Form Modal */}
      <ListingForm
        isOpen={isEditOpen}
        initialData={listing}
        onClose={() => setIsEditOpen(false)}
        onSuccess={(saved) => {
          setListing(saved);
          showToast("Listing updated successfully.");
        }}
      />
    </div>
  );
}
