"use client";

import React from "react";
import SearchBar from "./SearchBar";
import { IconFilter } from "./Icons";
import { ListingFilterParams } from "@/types/listing";

interface ListingFiltersProps {
  filters: ListingFilterParams;
  onChange: (filters: ListingFilterParams) => void;
  onApplyFilters?: () => void;
  onResetFilters?: () => void;
}

export default function ListingFilters({
  filters,
  onChange,
  onApplyFilters,
  onResetFilters,
}: ListingFiltersProps) {
  const handleFilterChange = (key: keyof ListingFilterParams, value: string) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* 1. Search Properties */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Search JV Properties
          </label>
          <SearchBar
            value={filters.search || ""}
            onChange={(val) => handleFilterChange("search", val)}
            placeholder="JV ID, location, feasibility..."
          />
        </div>

        {/* 2. Feasibility Made By */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Feasibility Made By
          </label>
          <select
            value={filters.feasibilityMadeBy || "All"}
            onChange={(e) => handleFilterChange("feasibilityMadeBy", e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition shadow-xs cursor-pointer"
          >
            <option value="All">All Specialists</option>
            <option value="Mudassar">Mudassar</option>
            <option value="Kavya">Kavya</option>
            <option value="srinivas">Srinivas</option>
          </select>
        </div>

        {/* 3. Location Cluster */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Location Cluster
          </label>
          <select
            value={filters.location || "All Locations"}
            onChange={(e) => handleFilterChange("location", e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition shadow-xs cursor-pointer"
          >
            <option value="All Locations">All Locations</option>
            <option value="Davangere">Davangere</option>
            <option value="Yelahanka">Yelahanka</option>
            <option value="Devanahalli">Devanahalli</option>
            <option value="Mysore">Mysore</option>
            <option value="Sarjapura">Sarjapura / Anekal</option>
          </select>
        </div>

        {/* 4. Action Button */}
        <div>
          <button
            type="button"
            onClick={onApplyFilters}
            className="w-full flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-[0.98] transition cursor-pointer"
          >
            <IconFilter className="w-3.5 h-3.5" />
            <span>Filter Results</span>
          </button>
        </div>
      </div>

      {/* Action Row */}
      <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between flex-wrap gap-2">
        <button
          type="button"
          onClick={onResetFilters}
          className="text-xs text-slate-400 hover:text-slate-600 transition font-medium cursor-pointer"
        >
          Reset Filters
        </button>

        <span className="text-[11px] text-slate-400">
          Source: Real Spreadsheet Records (6 JV Listings)
        </span>
      </div>
    </div>
  );
}
