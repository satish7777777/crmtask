"use client";

import React from "react";
import { IconTicket, IconCheckCircle } from "./Icons";
import { InquiryItem } from "@/types/inquiry";

interface InquiriesStatsProps {
  inquiries: InquiryItem[];
  isAdmin: boolean;
}

export default function InquiriesStats({ inquiries, isAdmin }: InquiriesStatsProps) {
  const newCount = inquiries.filter((i) => i.status === "New").length;
  const followedUpCount = inquiries.filter((i) => i.status === "Followed Up").length;
  const resolvedCount = inquiries.filter((i) => i.status === "Resolved").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total / My Inquiries */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-400">
            {isAdmin ? "Total Inquiries" : "My Inquiries"}
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {inquiries.length}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
          <IconTicket className="w-5 h-5" />
        </div>
      </div>

      {/* New / Unread */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-400">
            New / Unread
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {newCount}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
          <span className="text-xs font-bold text-emerald-700">NEW</span>
        </div>
      </div>

      {/* Followed Up */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-400">
            Followed Up
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {followedUpCount}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
          <span className="text-xs font-bold text-blue-700">WIP</span>
        </div>
      </div>

      {/* Resolved / Closed */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-400">
            Resolved / Closed
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {resolvedCount}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
          <IconCheckCircle className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

