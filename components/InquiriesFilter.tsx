"use client";

import React from "react";
import { IconSearch } from "./Icons";

interface InquiriesFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  isAdmin: boolean;
}

export default function InquiriesFilter({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  isAdmin,
}: InquiriesFilterProps) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <IconSearch className="w-4 h-4" />
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={
            isAdmin
              ? "Search partner name, email, location, or JV ID..."
              : "Search your inquiries by location or message..."
          }
          className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition"
        />
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 font-medium">Status:</span>
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer font-medium"
        >
          <option value="All">All Inquiries</option>
          <option value="New">New</option>
          <option value="Followed Up">Followed Up</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>
    </div>
  );
}

