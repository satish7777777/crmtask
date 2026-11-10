"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { JVListing } from "@/types/listing";
import { useAuth } from "./AuthContext";
import {
  IconBuilding,
  IconEye,
  IconEdit,
  IconTrash,
  IconStar,
  IconLock,
  IconPlus,
  IconDownload,
  IconUpload,
} from "./Icons";

interface ListingsTableProps {
  listings: JVListing[];
  totalCount: number;
  onAddNew?: () => void;
  onEdit?: (listing: JVListing) => void;
  onDelete?: (id: string) => void;
  onRestrictedAction?: (actionName: string) => void;
  onImportSuccess?: () => void;
}

export default function ListingsTable({
  listings,
  totalCount,
  onAddNew,
  onEdit,
  onDelete,
  onRestrictedAction,
  onImportSuccess,
}: ListingsTableProps) {
  const { isAdmin } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAdminGuard = (action: () => void, actionName: string) => {
    if (!isAdmin) {
      if (onRestrictedAction) {
        onRestrictedAction(actionName);
      }
      return;
    }
    action();
  };

  const handleExportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(listings, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "jv-listings.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        alert("Invalid JSON format. Expected an array of JV listing records.");
        return;
      }

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "import", items: parsed }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || "Imported successfully!");
        if (onImportSuccess) onImportSuccess();
      } else {
        alert(data.message || "Import failed");
      }
    } catch {
      alert("Failed to read or parse JSON file.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      {/* Table Top Controls */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() =>
              handleAdminGuard(
                () => onAddNew && onAddNew(),
                "Add New Property JV"
              )
            }
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-[0.98] transition cursor-pointer"
          >
            <IconPlus className="w-4 h-4" />
            <span>+ Add New Property</span>
            {!isAdmin && <IconLock className="w-3 h-3 text-indigo-200 ml-1" />}
          </button>

          {/* Export JSON Button */}
          <button
            type="button"
            onClick={handleExportJSON}
            title="Export jv-listings.json"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            <IconDownload className="w-3.5 h-3.5 text-slate-500" />
            <span>Export JSON</span>
          </button>

          {/* Import JSON Button (Admin Protected) */}
          <input
            type="file"
            accept=".json,application/json"
            ref={fileInputRef}
            onChange={handleImportFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={() =>
              handleAdminGuard(
                () => fileInputRef.current?.click(),
                "Bulk Import JSON"
              )
            }
            title="Import JSON Records"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            <IconUpload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import JSON</span>
            {!isAdmin && <IconLock className="w-3 h-3 text-slate-400" />}
          </button>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Showing {listings.length} of {totalCount} JV records
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[720px]">
          <thead className="bg-slate-50/70 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
            <tr>
              <th className="py-3 px-5">JV ID & Location</th>
              <th className="py-3 px-4">Area & Road</th>
              <th className="py-3 px-4">Sharing & Goodwill</th>
              <th className="py-3 px-4">Feasibility & Update</th>
              <th className="py-3 px-4">Rating & Pin</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {listings.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <IconBuilding className="w-8 h-8 text-slate-300" />
                    <p className="font-semibold text-slate-600 text-sm">
                      No JV records found
                    </p>
                    <p className="text-xs">
                      Try adjusting your search criteria or filter options.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              listings.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/60 transition group"
                >
                  {/* JV ID & Location */}
                  <td className="py-4 px-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/60 flex items-center justify-center shrink-0 mt-0.5">
                        <IconBuilding className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/listings/${item.id}`}
                            className="font-bold text-slate-900 hover:text-indigo-600 transition truncate max-w-[220px]"
                          >
                            {item.location}
                          </Link>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                            {item.id}
                          </span>
                          {item.reraNo && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              REA: {item.reraNo}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Area & Road */}
                  <td className="py-4 px-4 text-slate-600">
                    <p className="font-bold text-slate-800">
                      {item.area || "—"}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Road: {item.roadWidth || "—"}
                    </p>
                  </td>

                  {/* Sharing & Goodwill */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.sharing && item.sharing !== "TBD"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        Sharing: {item.sharing || "TBD"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Goodwill:{" "}
                      <strong className="text-slate-900">
                        {item.goodwill || "TBD"}
                      </strong>
                    </p>
                  </td>

                  {/* Feasibility & Update */}
                  <td className="py-4 px-4">
                    <p className="text-xs font-semibold text-slate-800">
                      By: {item.feasibilityMadeBy || "—"}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Updated: {item.updatedBy || "—"}
                    </p>
                  </td>

                  {/* Rating & Google Pin */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 text-amber-600 font-bold text-xs">
                      <IconStar className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{String(item.ratings)}</span>
                    </div>
                    {item.googlePin && (
                      <a
                        href={item.googlePin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 underline mt-1 font-medium"
                      >
                        <span>Maps Pin ↗</span>
                      </a>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right">
                    <div className="inline-flex items-center gap-1">
                      {/* View Button */}
                      <Link
                        href={`/listings/${item.id}`}
                        title="View Details"
                        className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition"
                      >
                        <IconEye className="w-4 h-4" />
                      </Link>

                      {/* Edit Button (Admin protected) */}
                      <button
                        type="button"
                        onClick={() =>
                          handleAdminGuard(
                            () => onEdit && onEdit(item),
                            "Edit JV Record"
                          )
                        }
                        title={isAdmin ? "Edit JV Record" : "Admin Only (Edit)"}
                        className={`p-1.5 rounded-lg transition cursor-pointer ${
                          isAdmin
                            ? "text-blue-600 hover:bg-blue-50"
                            : "text-slate-300 hover:text-slate-400"
                        }`}
                      >
                        <IconEdit className="w-4 h-4" />
                      </button>

                      {/* Delete Button (Admin protected) */}
                      <button
                        type="button"
                        onClick={() =>
                          handleAdminGuard(
                            () => onDelete && onDelete(item.id),
                            "Delete JV Record"
                          )
                        }
                        title={
                          isAdmin ? "Delete JV Record" : "Admin Only (Delete)"
                        }
                        className={`p-1.5 rounded-lg transition cursor-pointer ${
                          isAdmin
                            ? "text-rose-500 hover:bg-rose-50"
                            : "text-slate-300 hover:text-slate-400"
                        }`}
                      >
                        <IconTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
