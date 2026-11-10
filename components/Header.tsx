"use client";

import React from "react";
import { useAuth } from "./AuthContext";
import {
  IconBell,
  IconPlus,
  IconLock,
  IconUnlock,
  IconMenu,
} from "./Icons";

interface HeaderProps {
  title?: string;
  onAddProperty?: () => void;
  showAddButton?: boolean;
  onToggleSidebar?: () => void;
}

export default function Header({
  title = "Manage Properties",
  onAddProperty,
  showAddButton = true,
  onToggleSidebar,
}: HeaderProps) {
  const { user, isAdmin, quickLogin } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Left: Mobile Hamburger Menu & Title */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            title="Open sidebar navigation"
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 -ml-1 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          >
            <IconMenu className="w-5 h-5" />
          </button>
        )}

        <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight truncate">
          {title}
        </h1>

        {isAdmin ? (
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
            <IconUnlock className="w-2.5 h-2.5 text-indigo-600" />
            Full Access
          </span>
        ) : (
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
            <IconLock className="w-2.5 h-2.5 text-amber-600" />
            Limited Access
          </span>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Role Switcher for Testing (compact on tablet, hidden on tiny mobile) */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
          <span className="text-[10px] text-slate-400 px-1 font-medium">
            Role:
          </span>
          <button
            type="button"
            onClick={() => quickLogin("admin")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
              isAdmin
                ? "bg-[#4F46E5] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => quickLogin("customer")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
              !isAdmin
                ? "bg-amber-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            Client
          </button>
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          title="Notifications"
          className="relative p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <IconBell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        {/* Add Property Button */}
        {showAddButton && (
          <button
            type="button"
            onClick={onAddProperty}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-[0.98] transition cursor-pointer"
          >
            <IconPlus className="w-4 h-4" />
            <span className="hidden sm:inline">+ Add Property</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center font-bold text-xs text-indigo-700 shrink-0">
          {user ? user.name[0]?.toUpperCase() : "A"}
        </div>
      </div>
    </header>
  );
}
