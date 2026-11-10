"use client";

import React from "react";
import {
  IconBuilding,
  IconTag,
  IconKey,
  IconCheck,
} from "./Icons";
import { ListingStats } from "@/types/listing";

interface StatsCardProps {
  stats: ListingStats;
  variant?: "gradient" | "minimal";
}

export default function StatsCard({ stats, variant = "gradient" }: StatsCardProps) {
  if (variant === "minimal") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Total Properties</span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{stats.total}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <IconBuilding className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">For Sale / Active</span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{stats.active}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <IconTag className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">For Rent / In Review</span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{stats.pending}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <IconKey className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Locations / Clusters</span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{stats.totalLocations}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <IconCheck className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  }

  // PrimeEstate Vibrant Gradient Cards (exact match to Screenshot 1)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Total Properties */}
      <div className="bg-gradient-to-r from-[#3948E4] to-[#4856EC] text-white p-5 rounded-2xl shadow-md shadow-indigo-600/10 flex items-center justify-between relative overflow-hidden">
        <div>
          <span className="text-xs font-semibold text-white/80 tracking-wide">
            Total Properties
          </span>
          <div className="text-3xl font-extrabold mt-1 tracking-tight">
            {stats.total}
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
          <IconBuilding className="w-6 h-6" />
        </div>
      </div>

      {/* 2. Structured Sharing / For Sale */}
      <div className="bg-gradient-to-r from-[#2F7AF6] to-[#498FF8] text-white p-5 rounded-2xl shadow-md shadow-blue-600/10 flex items-center justify-between relative overflow-hidden">
        <div>
          <span className="text-xs font-semibold text-white/80 tracking-wide">
            For Sale
          </span>
          <div className="text-3xl font-extrabold mt-1 tracking-tight">
            {stats.active}
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
          <IconTag className="w-6 h-6" />
        </div>
      </div>

      {/* 3. In Review / For Rent */}
      <div className="bg-gradient-to-r from-[#0EB882] to-[#1AC48E] text-white p-5 rounded-2xl shadow-md shadow-emerald-600/10 flex items-center justify-between relative overflow-hidden">
        <div>
          <span className="text-xs font-semibold text-white/80 tracking-wide">
            For Rent
          </span>
          <div className="text-3xl font-extrabold mt-1 tracking-tight">
            {stats.pending}
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
          <IconKey className="w-6 h-6" />
        </div>
      </div>

      {/* 4. Total Locations / Sold/Rented */}
      <div className="bg-gradient-to-r from-[#A030F5] to-[#B144FA] text-white p-5 rounded-2xl shadow-md shadow-purple-600/10 flex items-center justify-between relative overflow-hidden">
        <div>
          <span className="text-xs font-semibold text-white/80 tracking-wide">
            Sold/Rented
          </span>
          <div className="text-3xl font-extrabold mt-1 tracking-tight">
            {stats.totalLocations}
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
          <IconCheck className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
