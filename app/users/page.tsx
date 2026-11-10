"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useAuth } from "@/components/AuthContext";
import {
  IconUsers,
  IconShield,
  IconUser,
  IconLock,
  IconSearch,
  IconCheckCircle,
} from "@/components/Icons";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Administrator" | "Feasibility Specialist" | "Legal Advocate" | "Reviewer" | "Customer";
  department: string;
  phone?: string;
  assignedDeals: string[];
  status: "Active" | "Offline";
}

const INITIAL_TEAM: TeamMember[] = [
  {
    id: "USR-001",
    name: "Admin User",
    email: "admin@crm.com",
    role: "Administrator",
    department: "Executive Management",
    phone: "+91 80 4123 4567",
    assignedDeals: ["All JV Deals"],
    status: "Active",
  },
  {
    id: "USR-002",
    name: "Mudassar",
    email: "mudassar@primeestate.in",
    role: "Feasibility Specialist",
    department: "Technical Feasibility",
    phone: "+91 81230 51026",
    assignedDeals: ["2026.OCT.142", "2026.OCT.139"],
    status: "Active",
  },
  {
    id: "USR-003",
    name: "Kavya",
    email: "kavya@primeestate.in",
    role: "Feasibility Specialist",
    department: "Technical Feasibility",
    phone: "+91 81476 47988",
    assignedDeals: ["2026.OCT.141", "2026.OCT.140"],
    status: "Active",
  },
  {
    id: "USR-004",
    name: "Srinivas",
    email: "srinivas@primeestate.in",
    role: "Feasibility Specialist",
    department: "Land & Title Feasibility",
    phone: "+91 78929 57643",
    assignedDeals: ["2026.OCT.138", "2026.OCT.137"],
    status: "Active",
  },
  {
    id: "USR-005",
    name: "Tejashwini",
    email: "tejashwini.legal@primeestate.in",
    role: "Legal Advocate",
    department: "Legal Counsel & RERA Compliance",
    phone: "+91 63611 57968",
    assignedDeals: ["2026.OCT.140"],
    status: "Active",
  },
  {
    id: "USR-006",
    name: "Nandan",
    email: "nandan.review@primeestate.in",
    role: "Reviewer",
    department: "Feasibility Evaluation",
    phone: "+91 81476 47988",
    assignedDeals: ["2026.OCT.141", "2026.OCT.139"],
    status: "Active",
  },
  {
    id: "USR-007",
    name: "Yeshahwini",
    email: "yeshahwini@primeestate.in",
    role: "Reviewer",
    department: "Operations & Updates",
    phone: "+91 81230 51026",
    assignedDeals: ["2026.OCT.142"],
    status: "Active",
  },
  {
    id: "USR-008",
    name: "Fana",
    email: "fana.docs@primeestate.in",
    role: "Reviewer",
    department: "Documentation & JDA/LLP",
    phone: "+91 98860 81742",
    assignedDeals: ["2026.OCT.137"],
    status: "Active",
  },
  {
    id: "USR-009",
    name: "Investor Customer",
    email: "customer@crm.com",
    role: "Customer",
    department: "External Syndicate Partner",
    phone: "+91 98765 43210",
    assignedDeals: ["View-Only Inquiries"],
    status: "Active",
  },
];

export default function UsersPage() {
  const router = useRouter();
  const { user, isAdmin, quickLogin, isLoading: authLoading } = useAuth();

  const [members] = useState<TeamMember[]>(INITIAL_TEAM);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Customer Access Restriction Guard
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex bg-[#F8FAFC]">
        <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <Header title="Users & Team" showAddButton={false} onToggleSidebar={() => setMobileMenuOpen(true)} />
          <main className="flex-1 p-6 max-w-xl mx-auto flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shadow-xs">
              <IconLock className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Module Restricted: Administrator Privilege Required
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your account (<strong>{user.email}</strong>) is logged in as a <strong>Customer</strong>. Access to team members, specialists, and user permissions is restricted to Administrator accounts.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => quickLogin("admin")}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition cursor-pointer"
              >
                Switch to Admin Demo
              </button>
              <Link
                href="/dashboard"
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition"
              >
                Back to Dashboard
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      searchTerm.trim() === "" ||
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === "All" || m.role.toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesRole;
  });

  const specialistsCount = members.filter((m) => m.role === "Feasibility Specialist").length;
  const legalCount = members.filter((m) => m.role === "Legal Advocate" || m.role === "Reviewer").length;

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Team & Specialists"
          showAddButton={false}
          onToggleSidebar={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                CRM Users & Feasibility Team
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Specialists, advocates, reviewers, and platform administrators managing Karnataka JV properties.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/listings"
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs transition"
              >
                View Properties
              </Link>
              <Link
                href="/inquiries"
                className="px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition"
              >
                View Inquiries →
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400">Total Users</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">{members.length}</div>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                <IconUsers className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400">Feasibility Specialists</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">{specialistsCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                <IconShield className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400">Legal & Reviewers</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">{legalCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                <IconCheckCircle className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400">Platform Admin</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">1</div>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                <IconUser className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <IconSearch className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search team member by name, email, department..."
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer"
              >
                <option value="All">All Roles</option>
                <option value="Administrator">Administrator</option>
                <option value="Feasibility Specialist">Feasibility Specialist</option>
                <option value="Legal Advocate">Legal Advocate</option>
                <option value="Reviewer">Reviewer</option>
                <option value="Customer">Customer</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[720px]">
                <thead className="bg-slate-50/70 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-5">Member Name & ID</th>
                    <th className="py-3 px-4">Role & Department</th>
                    <th className="py-3 px-4">Contact Phone</th>
                    <th className="py-3 px-4">Assigned JV Listings</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/60 transition group">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs ring-2 ring-indigo-50">
                            {m.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{m.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{m.email}</div>
                            <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold mt-0.5 inline-block">
                              {m.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border inline-block ${
                            m.role === "Administrator"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : m.role === "Feasibility Specialist"
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                              : m.role === "Legal Advocate"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : m.role === "Customer"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          {m.role}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-1">{m.department}</p>
                      </td>

                      <td className="py-4 px-4 text-slate-700 font-mono text-xs">
                        {m.phone || "—"}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {m.assignedDeals.map((deal) => (
                            <span
                              key={deal}
                              className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-semibold"
                            >
                              {deal}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
