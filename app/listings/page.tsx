"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import ListingFilters from "@/components/ListingFilters";
import ListingsTable from "@/components/ListingsTable";
import ListingForm from "@/components/ListingForm";
import { Listing, ListingFilterParams, ListingStats } from "@/types/listing";
import { useAuth } from "@/components/AuthContext";
import {
  IconLock,
  IconAlertTriangle,
  IconCheckCircle,
  IconX,
} from "@/components/Icons";

export default function ListingsPage() {
  const { isAdmin, quickLogin, isLoading: authLoading } = useAuth();

  const [listings, setListings] = useState<Listing[]>([]);
  const [stats, setStats] = useState<ListingStats>({
    total: 0,
    active: 0,
    pending: 0,
    closed: 0,
    totalLocations: 0,
  });

  const [filters, setFilters] = useState<ListingFilterParams>({
    search: "",
    feasibilityMadeBy: "All",
    status: "All Statuses",
    location: "All Locations",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  // Notifications & Modals
  const [toastMessage, setToastMessage] = useState("");
  const [restrictedModalOpen, setRestrictedModalOpen] = useState(false);
  const [restrictedActionName, setRestrictedActionName] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const refetch = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const params = new URLSearchParams();
        if (filters.search) params.set("search", filters.search);
        if (filters.feasibilityMadeBy && filters.feasibilityMadeBy !== "All") {
          params.set("feasibilityMadeBy", filters.feasibilityMadeBy);
        }
        if (filters.status && filters.status !== "All Statuses") {
          params.set("status", filters.status);
        }
        if (filters.location && filters.location !== "All Locations") {
          params.set("location", filters.location);
        }

        // Fetch filtered listings
        const res = await fetch(`/api/listings?${params.toString()}`);
        const data = await res.json();
        if (!ignore && data.success) {
          setListings(data.data);
        }

        // Fetch stats
        const statsRes = await fetch("/api/listings?stats=true");
        const statsData = await statsRes.json();
        if (!ignore && statsData.success) {
          setStats(statsData.data);
        }
      } catch (err) {
        console.error("Error fetching listings:", err);
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
  }, [filters, refreshKey]);

  // Handle Add New
  const handleAddNew = () => {
    if (!isAdmin) {
      setRestrictedActionName("Add New Property");
      setRestrictedModalOpen(true);
      return;
    }
    setEditingListing(null);
    setIsFormOpen(true);
  };

  // Handle Edit
  const handleEdit = (listing: Listing) => {
    if (!isAdmin) {
      setRestrictedActionName("Edit Property");
      setRestrictedModalOpen(true);
      return;
    }
    setEditingListing(listing);
    setIsFormOpen(true);
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      setRestrictedActionName("Delete Property");
      setRestrictedModalOpen(true);
      return;
    }

    if (!confirm("Are you sure you want to delete this property listing?")) {
      return;
    }

    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast("Property listing deleted successfully.");
        refetch();
      } else {
        alert(data.message || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting property");
    }
  };

  // Handle Restricted Action Notice from Table or Sidebar
  const handleRestrictedAction = (actionName: string) => {
    setRestrictedActionName(actionName);
    setRestrictedModalOpen(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Sidebar with Responsive Drawer & Viewport Bottom alignment */}
      <Sidebar
        onOpenRestrictedModal={handleRestrictedAction}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with hamburger toggle */}
        <Header
          title="Manage Properties"
          onAddProperty={handleAddNew}
          showAddButton={true}
          onToggleSidebar={() => setMobileMenuOpen(true)}
        />

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 shadow-xs animate-fade-in">
              <IconCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Stats Cards (PrimeEstate Gradient Style) */}
          <StatsCard stats={stats} variant="gradient" />

          {/* Search & Filters Card */}
          <ListingFilters
            filters={filters}
            onChange={setFilters}
            onApplyFilters={refetch}
            onResetFilters={() => {
              setFilters({
                search: "",
                feasibilityMadeBy: "All",
                status: "All Statuses",
                location: "All Locations",
              });
            }}
          />

          {/* Table Section */}
          {isLoading ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400 shadow-xs">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-semibold">
                Loading property records from JSON storage...
              </p>
            </div>
          ) : (
            <ListingsTable
              listings={listings}
              totalCount={stats.total}
              onAddNew={handleAddNew}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRestrictedAction={handleRestrictedAction}
              onImportSuccess={() => {
                showToast("JSON listings imported successfully!");
                refetch();
              }}
            />
          )}
        </main>
      </div>

      {/* Add / Edit Listing Form Modal */}
      <ListingForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={editingListing}
        onSuccess={() => {
          showToast(
            editingListing
              ? "Property listing updated successfully!"
              : "New JV property listing created!"
          );
          refetch();
        }}
      />

      {/* Customer Restricted Access Modal */}
      {restrictedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shadow-xs">
                <IconLock className="w-6 h-6 text-amber-600" />
              </div>
              <button
                onClick={() => setRestrictedModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Action Restricted: Admin Privilege Required
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Target Action: <strong className="text-slate-800">{restrictedActionName}</strong>
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs space-y-1.5">
              <p className="font-semibold flex items-center gap-1.5">
                <IconAlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                Customer Access Restriction
              </p>
              <p className="text-amber-800 text-[11px]">
                Customer accounts have <strong>View-Only</strong> access to listings. Adding, editing, deleting, or bulk importing JV properties requires an Administrator account.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  quickLogin("admin");
                  setRestrictedModalOpen(false);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-xs transition cursor-pointer shadow-md shadow-indigo-600/20"
              >
                Switch to Admin Demo
              </button>
              <button
                type="button"
                onClick={() => setRestrictedModalOpen(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
