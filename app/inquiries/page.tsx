"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import InquiriesStats from "@/components/InquiriesStats";
import InquiriesFilter from "@/components/InquiriesFilter";
import InquiriesTable from "@/components/InquiriesTable";
import { useAuth } from "@/components/AuthContext";
import { InquiryItem } from "@/types/inquiry";
import { IconCheckCircle } from "@/components/Icons";

export default function InquiriesPage() {
  const router = useRouter();
  const { user, isAdmin, isLoading: authLoading } = useAuth();

  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [toastMessage, setToastMessage] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const refetch = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    let ignore = false;

    async function loadInquiries() {
      try {
        const url = isAdmin
          ? "/api/inquiries?role=admin"
          : `/api/inquiries?role=customer&email=${encodeURIComponent(user?.email || "")}`;

        const res = await fetch(url);
        const data = await res.json();
        if (!ignore && data.success && Array.isArray(data.data)) {
          setInquiries(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch inquiries:", err);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadInquiries();
    return () => {
      ignore = true;
    };
  }, [user, isAdmin, refreshKey]);

  // Handle Admin Status Update
  const handleStatusChange = async (inquiryId: string, newStatus: string) => {
    if (!isAdmin) return;
    setUpdatingId(inquiryId);
    try {
      const res = await fetch("/api/inquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: inquiryId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Inquiry ${inquiryId} updated to "${newStatus}"`);
        setInquiries((prev) =>
          prev.map((item) =>
            item.id === inquiryId ? { ...item, status: newStatus } : item
          )
        );
      } else {
        alert(data.message || "Failed to update inquiry status");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating inquiry status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Filter inquiries based on search and status
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      searchTerm.trim() === "" ||
      inq.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.senderEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inq.propertyLocation &&
        inq.propertyLocation.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (inq.listingId &&
        inq.listingId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      inq.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || inq.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Sidebar with sticky viewport bottom alignment */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title={isAdmin ? "Inquiries Management" : "My JV Inquiries"}
          showAddButton={false}
          onToggleSidebar={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 shadow-xs animate-fade-in">
              <IconCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Page Banner / Header info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {isAdmin ? "All Joint Venture Inquiries" : "My Submitted Inquiries"}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isAdmin
                  ? "Incoming partnership and site viewing requests from prospective JV syndicate investors."
                  : `Showing inquiries submitted by ${user.email}. Inquiries from other customers are strictly private.`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={refetch}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs cursor-pointer transition"
              >
                ↻ Refresh
              </button>
              <Link
                href="/listings"
                className="px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition cursor-pointer"
              >
                Browse JV Properties →
              </Link>
            </div>
          </div>

          {/* 1. Inquiries Stats Component */}
          <InquiriesStats inquiries={inquiries} isAdmin={isAdmin} />

          {/* 2. Inquiries Search & Filter Component */}
          <InquiriesFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            isAdmin={isAdmin}
          />

          {/* 3. Inquiries Table Component */}
          <InquiriesTable
            inquiries={filteredInquiries}
            isAdmin={isAdmin}
            isLoading={isLoading}
            onStatusChange={handleStatusChange}
            updatingId={updatingId}
          />
        </main>
      </div>
    </div>
  );
}
