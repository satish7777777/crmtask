"use client";

import React from "react";
import Link from "next/link";
import { IconTicket, IconArrowRight } from "./Icons";
import { InquiryItem } from "@/types/inquiry";

interface InquiriesTableProps {
  inquiries: InquiryItem[];
  isAdmin: boolean;
  isLoading: boolean;
  onStatusChange?: (inquiryId: string, newStatus: string) => void;
  updatingId?: string | null;
}

export default function InquiriesTable({
  inquiries,
  isAdmin,
  isLoading,
  onStatusChange,
  updatingId,
}: InquiriesTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-12 text-center text-slate-400">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold">Loading inquiries from storage...</p>
      </div>
    );
  }

  if (inquiries.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-12 text-center text-slate-400 space-y-3">
        <IconTicket className="w-10 h-10 text-slate-300 mx-auto" />
        <p className="text-sm font-bold text-slate-700">
          {isAdmin
            ? "No inquiries matching your search criteria."
            : "You haven't submitted any inquiries yet."}
        </p>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          {isAdmin
            ? "New customer inquiries submitted through property detail pages will appear here in real time."
            : "Explore JV properties across Karnataka and click 'Request JV Memorandum' to submit partnership inquiries."}
        </p>
        {!isAdmin && (
          <Link
            href="/listings"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition"
          >
            <span>Browse JV Properties</span>
            <IconArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[700px]">
          <thead className="bg-slate-50/70 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
            <tr>
              <th className="py-3 px-5">Prospective Partner</th>
              <th className="py-3 px-4">JV Property Target</th>
              <th className="py-3 px-4">Message / Query</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Submitted At</th>
              <th className="py-3 px-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inquiries.map((inq) => (
              <tr key={inq.id} className="hover:bg-slate-50/60 transition group">
                {/* Partner Details */}
                <td className="py-4 px-5">
                  <div>
                    <div className="font-bold text-slate-900">{inq.senderName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {inq.senderEmail}
                    </div>
                    <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold mt-1 inline-block">
                      ID: {inq.id}
                    </span>
                  </div>
                </td>

                {/* Property Target */}
                <td className="py-4 px-4">
                  <div className="font-semibold text-slate-800">
                    {inq.propertyLocation || "General Syndicate"}
                  </div>
                  {inq.listingId && (
                    <Link
                      href={`/listings/${inq.listingId}`}
                      className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-bold mt-0.5"
                    >
                      <span>JV #{inq.listingId}</span>
                      <span className="text-[9px]">↗</span>
                    </Link>
                  )}
                </td>

                {/* Message */}
                <td className="py-4 px-4 max-w-[280px]">
                  <p className="text-slate-600 line-clamp-2 text-xs">
                    &ldquo;{inq.message}&rdquo;
                  </p>
                </td>

                {/* Status (Interactive dropdown for Admin, read-only badge for Customer) */}
                <td className="py-4 px-4">
                  {isAdmin && onStatusChange ? (
                    <select
                      value={inq.status}
                      disabled={updatingId === inq.id}
                      onChange={(e) => onStatusChange(inq.id, e.target.value)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border cursor-pointer focus:outline-none transition ${
                        inq.status === "New"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : inq.status === "Followed Up"
                          ? "bg-blue-50 text-blue-800 border-blue-300"
                          : "bg-slate-100 text-slate-700 border-slate-300"
                      }`}
                    >
                      <option value="New">● New</option>
                      <option value="Followed Up">● Followed Up</option>
                      <option value="Resolved">● Resolved</option>
                    </select>
                  ) : (
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-block ${
                        inq.status === "New"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : inq.status === "Followed Up"
                          ? "bg-blue-50 text-blue-800 border-blue-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {inq.status}
                    </span>
                  )}
                </td>

                {/* Submitted At */}
                <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">
                  {new Date(inq.createdAt).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  <span className="block text-[10px] text-slate-400">
                    {new Date(inq.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </td>

                {/* Action */}
                <td className="py-4 px-5 text-right">
                  {inq.listingId ? (
                    <Link
                      href={`/listings/${inq.listingId}`}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition inline-block"
                    >
                      View Deal
                    </Link>
                  ) : (
                    <span className="text-slate-400 text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

