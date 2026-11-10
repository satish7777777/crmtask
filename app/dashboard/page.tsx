"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useAuth } from "@/components/AuthContext";
import { Listing, ListingStats } from "@/types/listing";
import { InquiryItem } from "@/types/inquiry";
import {
  IconBuilding,
  IconTicket,
  IconShield,
  IconDollar,
  IconLock,
  IconAlertTriangle,
  IconArrowRight,
  IconX,
} from "@/components/Icons";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAdmin, quickLogin, isLoading: authLoading } = useAuth();

  const [recentListings, setRecentListings] = useState<Listing[]>([]);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [stats, setStats] = useState<ListingStats>({
    total: 0,
    active: 0,
    pending: 0,
    closed: 0,
    totalLocations: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [restrictedModalOpen, setRestrictedModalOpen] = useState(false);
  const [attemptedModuleName, setAttemptedModuleName] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    let ignore = false;
    async function loadDashboardData() {
      try {
        const res = await fetch("/api/listings");
        const data = await res.json();
        if (!ignore && data.success && Array.isArray(data.data)) {
          setRecentListings(data.data.slice(0, 5));
        }

        const statsRes = await fetch("/api/listings?stats=true");
        const statsData = await statsRes.json();
        if (!ignore && statsData.success) {
          setStats(statsData.data);
        }

        const userEmail = user?.email || "";
        const inqUrl = isAdmin
          ? "/api/inquiries?role=admin"
          : `/api/inquiries?role=customer&email=${encodeURIComponent(userEmail)}`;
        const inqRes = await fetch(inqUrl);
        const inqData = await inqRes.json();
        if (!ignore && inqData.success && Array.isArray(inqData.data)) {
          setInquiries(inqData.data);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadDashboardData();
    return () => {
      ignore = true;
    };
  }, [user, isAdmin]);

  const handleOpenRestricted = (moduleName: string) => {
    setAttemptedModuleName(moduleName);
    setRestrictedModalOpen(true);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Sidebar with Responsive Drawer & Viewport Bottom alignment */}
      <Sidebar
        onOpenRestrictedModal={handleOpenRestricted}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with hamburger toggle */}
        <Header
          title="Dashboard"
          onAddProperty={() => router.push("/listings")}
          showAddButton={true}
          onToggleSidebar={() => setMobileMenuOpen(true)}
        />

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Top 4 KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Properties */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400">
                  Total Properties
                </p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
                  {stats.total || 7}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  {isAdmin ? "+3 added this month" : "Active JV directory"}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                <IconBuilding className="w-5 h-5" />
              </div>
            </div>

            {/* New Inquiries */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400">
                  New Inquiries
                </p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
                  {inquiries.length > 0 ? inquiries.length : (isAdmin ? 31 : 2)}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  {isAdmin ? "9 unresolved" : "1 pending review"}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                <IconTicket className="w-5 h-5" />
              </div>
            </div>

            {/* Active Agents */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400">
                  Active Agents
                </p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
                  17
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  2 new this week
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                <IconShield className="w-5 h-5" />
              </div>
            </div>

            {/* Revenue / Portfolio Value */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400">
                  {isAdmin ? "Revenue This Month" : "My Investment Tier"}
                </p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
                  {isAdmin ? "$12,430" : "Customer Tier"}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  {isAdmin ? "8 successful transactions" : "Direct syndicate access"}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
                <IconDollar className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Recent Property Listings Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconBuilding className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Recent Property Listings
                </h3>
              </div>
              <Link
                href="/listings"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>View All</span>
                <IconArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[640px]">
                <thead className="bg-slate-50/70 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">JV ID & Location</th>
                    <th className="py-3 px-4">Area</th>
                    <th className="py-3 px-4">Goodwill</th>
                    <th className="py-3 px-4">Sharing</th>
                    <th className="py-3 px-4">Feasibility</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Loading recent listings...
                      </td>
                    </tr>
                  ) : (
                    recentListings.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          <Link
                            href={`/listings/${item.id}`}
                            className="hover:text-indigo-600 transition"
                          >
                            {item.location}
                          </Link>
                          <span className="block font-mono text-[10px] text-slate-400 font-normal">
                            {item.id}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-semibold">
                          {item.area || "—"}
                        </td>
                        <td className="py-3 px-4 font-extrabold text-slate-900">
                          {item.goodwill || "TBD"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                              item.sharing && item.sharing !== "TBD"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {item.sharing || "TBD"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-medium">
                          {item.feasibilityMadeBy || "—"}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            href={`/listings/${item.id}`}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                          >
                            View →
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Grid: Recent Inquiries & Performance Metrics Chart (Admin Only) */}
          {isAdmin && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Inquiries */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconTicket className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Recent Inquiries
                    </h3>
                  </div>
                  <Link
                    href="/inquiries"
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <span>View All</span>
                    <IconArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {inquiries.length > 0 ? (
                    inquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              {inq.senderName}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                inq.status === "New"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-blue-50 text-blue-700 border border-blue-200"
                              }`}
                            >
                              {inq.status}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(inq.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-indigo-600">
                          For: {inq.propertyLocation || inq.listingId || "General JV"}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          &ldquo;{inq.message}&rdquo;
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-50 text-slate-400 text-xs text-center">
                      No inquiries recorded yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Performance Metrics Bar Chart */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Performance Metrics
                  </h3>
                  <Link
                    href="/listings"
                    className="text-xs font-bold text-indigo-600 cursor-pointer hover:underline"
                  >
                    View All →
                  </Link>
                </div>

                {/* Bar Chart Visualization */}
                <div className="h-64 flex items-end justify-between gap-2 pt-8 pb-4 px-2 border-b border-slate-100">
                  {/* Jan */}
                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div
                      className="w-full max-w-[32px] bg-indigo-100 rounded-t-lg transition hover:opacity-80"
                      style={{ height: "45%" }}
                    />
                    <div className="text-center">
                      <p className="text-[10px] text-slate-600 font-semibold">Jan</p>
                      <p className="text-[9px] text-slate-400">1200</p>
                    </div>
                  </div>

                  {/* Feb */}
                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div
                      className="w-full max-w-[32px] bg-indigo-100 rounded-t-lg transition hover:opacity-80"
                      style={{ height: "35%" }}
                    />
                    <div className="text-center">
                      <p className="text-[10px] text-slate-600 font-semibold">Feb</p>
                      <p className="text-[9px] text-slate-400">1400</p>
                    </div>
                  </div>

                  {/* Mar (Highlighted Solid Purple Bar like image 2) */}
                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div
                      className="w-full max-w-[32px] bg-[#4F46E5] rounded-t-lg shadow-md shadow-indigo-500/25 transition"
                      style={{ height: "85%" }}
                    />
                    <div className="text-center">
                      <p className="text-[10px] text-indigo-600 font-bold">Mar</p>
                      <p className="text-[9px] text-indigo-600 font-bold">1300</p>
                    </div>
                  </div>

                  {/* Apr */}
                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div
                      className="w-full max-w-[32px] bg-indigo-100 rounded-t-lg transition hover:opacity-80"
                      style={{ height: "55%" }}
                    />
                    <div className="text-center">
                      <p className="text-[10px] text-slate-600 font-semibold">Apr</p>
                      <p className="text-[9px] text-slate-400">1600</p>
                    </div>
                  </div>

                  {/* May */}
                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div
                      className="w-full max-w-[32px] bg-indigo-100 rounded-t-lg transition hover:opacity-80"
                      style={{ height: "65%" }}
                    />
                    <div className="text-center">
                      <p className="text-[10px] text-slate-600 font-semibold">May</p>
                      <p className="text-[9px] text-slate-400">1800</p>
                    </div>
                  </div>

                  {/* Jun */}
                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div
                      className="w-full max-w-[32px] bg-indigo-100 rounded-t-lg transition hover:opacity-80"
                      style={{ height: "68%" }}
                    />
                    <div className="text-center">
                      <p className="text-[10px] text-slate-600 font-semibold">Jun</p>
                      <p className="text-[9px] text-slate-400">1900</p>
                    </div>
                  </div>

                  {/* Jul */}
                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div
                      className="w-full max-w-[32px] bg-indigo-100 rounded-t-lg transition hover:opacity-80"
                      style={{ height: "70%" }}
                    />
                    <div className="text-center">
                      <p className="text-[10px] text-slate-600 font-semibold">Jul</p>
                      <p className="text-[9px] text-slate-400">2000</p>
                    </div>
                  </div>

                  {/* Aug */}
                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div
                      className="w-full max-w-[32px] bg-indigo-100 rounded-t-lg transition hover:opacity-80"
                      style={{ height: "72%" }}
                    />
                    <div className="text-center">
                      <p className="text-[10px] text-slate-600 font-semibold">Aug</p>
                      <p className="text-[9px] text-slate-400">2000</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Access Restriction Modal */}
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
                Module Restricted: Admin Only
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Module: <strong className="text-slate-800">{attemptedModuleName}</strong>
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs space-y-1.5">
              <p className="font-semibold flex items-center gap-1.5">
                <IconAlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                Customer Access Restriction
              </p>
              <p className="text-amber-800 text-[11px]">
                Your account ({user?.email}) is registered as a <strong>Customer</strong>. Access to team management, agents allocation, and system administration is restricted to Administrator accounts.
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
