"use client";

import React, { useState } from "react";
import { JVListing } from "@/types/listing";
import { IconX, IconBuilding, IconCheck } from "./Icons";

interface ListingFormProps {
  initialData?: JVListing | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (saved: JVListing) => void;
}

function ListingFormContent({
  initialData,
  onClose,
  onSuccess,
}: {
  initialData?: JVListing | null;
  onClose: () => void;
  onSuccess: (saved: JVListing) => void;
}) {
  const isEditing = Boolean(initialData);

  const [id, setId] = useState(initialData?.id || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [area, setArea] = useState(initialData?.area || "");
  const [roadWidth, setRoadWidth] = useState(initialData?.roadWidth || "");
  const [goodwill, setGoodwill] = useState(initialData?.goodwill || "");
  const [sharing, setSharing] = useState(initialData?.sharing || "");
  const [feasibilityMadeBy, setFeasibilityMadeBy] = useState(
    initialData?.feasibilityMadeBy || ""
  );
  const [updatedBy, setUpdatedBy] = useState(initialData?.updatedBy || "");
  const [reraNo, setReraNo] = useState(initialData?.reraNo || "");
  const [ratings, setRatings] = useState(initialData?.ratings || 4);
  const [googlePin, setGooglePin] = useState(initialData?.googlePin || "");
  const [status, setStatus] = useState(initialData?.status || "");
  const [notes, setNotes] = useState(initialData?.notes || "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!location.trim()) {
      setError("Location is required.");
      return;
    }

    setIsSubmitting(true);

    const payload: Partial<JVListing> = {
      id: id.trim(),
      location: location.trim(),
      area: area.trim(),
      roadWidth: roadWidth.trim(),
      goodwill: goodwill.trim(),
      sharing: sharing.trim(),
      feasibilityMadeBy: feasibilityMadeBy.trim(),
      updatedBy: updatedBy.trim(),
      reraNo: reraNo.trim(),
      ratings,
      googlePin: googlePin.trim(),
      loiStatus: initialData?.loiStatus || "",
      mou: initialData?.mou || "",
      jdaLlp: initialData?.jdaLlp || "",
      status: status.trim(),
      notes: notes.trim(),
    };

    try {
      const url = isEditing
        ? `/api/listings/${encodeURIComponent(initialData!.id)}`
        : "/api/listings";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save listing record.");
      }

      onSuccess(data.data);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="p-6 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <IconBuilding className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isEditing ? `Edit JV Record (${initialData!.id})` : "Add New JV Record"}
              </h2>
              <p className="text-xs text-slate-400">
                JSON File Storage • fs/promises persistence
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition cursor-pointer"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {/* JV ID & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                JV ID (Unique Key)
              </label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="e.g. 2026.OCT.143"
                disabled={isEditing}
                className={`w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 font-mono ${
                  isEditing ? "bg-slate-100 text-slate-500" : ""
                }`}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Location <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Marena Halli Village, Yelahanka Taluk"
                required
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Area & Road Width */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Area
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. 6 Acres 20 Guntas or 38 guntas"
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Road Width
              </label>
              <input
                type="text"
                value={roadWidth}
                onChange={(e) => setRoadWidth(e.target.value)}
                placeholder="e.g. 60ft or 50 ft road width"
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Goodwill & Sharing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Goodwill
              </label>
              <input
                type="text"
                value={goodwill}
                onChange={(e) => setGoodwill(e.target.value)}
                placeholder="e.g. 3 cr, 2.5cr, Nil, or TBD"
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sharing Ratio
              </label>
              <input
                type="text"
                value={sharing}
                onChange={(e) => setSharing(e.target.value)}
                placeholder="e.g. 60:40:00, 70:30:00, or TBD"
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Feasibility, Updated By & REA */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Feasibility Made By
              </label>
              <input
                type="text"
                value={feasibilityMadeBy}
                onChange={(e) => setFeasibilityMadeBy(e.target.value)}
                placeholder="e.g. Mudassar, Kavya, srinivas"
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Updated By
              </label>
              <input
                type="text"
                value={updatedBy}
                onChange={(e) => setUpdatedBy(e.target.value)}
                placeholder="e.g. Yeshahwini, Nandan"
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                REA / RERA NO
              </label>
              <input
                type="text"
                value={reraNo}
                onChange={(e) => setReraNo(e.target.value)}
                placeholder="e.g. 8123051026"
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Ratings, Status & Google Pin */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ratings
              </label>
              <input
                type="text"
                value={ratings}
                onChange={(e) => setRatings(e.target.value)}
                placeholder="3, 4, 3*"
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Deal Status
              </label>
              <input
                type="text"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="Active, In Review, Closed"
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Google Maps Pin URL
              </label>
              <input
                type="url"
                value={googlePin}
                onChange={(e) => setGooglePin(e.target.value)}
                placeholder="https://maps.app.goo.gl/..."
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              placeholder="Additional feasibility notes or remarks..."
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
            >
              <IconCheck className="w-4 h-4" />
              <span>{isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create JV Record"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ListingForm({
  initialData,
  isOpen,
  onClose,
  onSuccess,
}: ListingFormProps) {
  if (!isOpen) return null;
  return (
    <ListingFormContent
      key={initialData ? initialData.id : "new-listing"}
      initialData={initialData}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
}
