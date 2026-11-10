"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";
import {
  IconHome,
  IconBuilding,
  IconUsers,
  IconTicket,
  IconSettings,
  IconLogOut,
  IconLock,
  IconUser,
  IconStar,
  IconX,
} from "./Icons";

interface SidebarProps {
  onOpenRestrictedModal?: (moduleName: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  onOpenRestrictedModal,
  isOpen = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();

  const handleRestrictedClick = (e: React.MouseEvent, moduleName: string) => {
    if (!isAdmin) {
      e.preventDefault();
      if (onOpenRestrictedModal) {
        onOpenRestrictedModal(moduleName);
      }
    }
  };

  const handleLinkClick = (e: React.MouseEvent, moduleName: string, adminOnly: boolean) => {
    if (!isAdmin && adminOnly) {
      handleRestrictedClick(e, moduleName);
    } else if (onClose) {
      onClose();
    }
  };

  const mainLinks = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <IconHome className="w-4 h-4" />,
      adminOnly: false,
    },
    {
      name: "Properties",
      href: "/listings",
      icon: <IconBuilding className="w-4 h-4" />,
      adminOnly: false,
    },
    {
      name: "Users",
      href: "/dashboard?tab=team",
      icon: <IconUsers className="w-4 h-4" />,
      adminOnly: true,
    },
    // {
    //   name: "Agents",
    //   href: "/dashboard?tab=agents",
    //   icon: <IconShield className="w-4 h-4" />,
    //   adminOnly: true,
    // },
    {
      name: "Inquiries",
      href: "/inquiries",
      icon: <IconTicket className="w-4 h-4" />,
      adminOnly: false,
    },
  ];

  const contentLinks = [
    // {
    //   name: "Blog Posts",
    //   href: "/dashboard?tab=blog",
    //   icon: <IconFileText className="w-4 h-4" />,
    //   adminOnly: true,
    // },
    {
      name: "Reviews",
      href: "/dashboard?tab=reviews",
      icon: <IconStar className="w-4 h-4" />,
      adminOnly: false,
    },
  ];

  const systemLinks = [
    {
      name: "Settings",
      href: "/dashboard?tab=settings",
      icon: <IconSettings className="w-4 h-4" />,
      adminOnly: true,
    },
  ];

  // Inner reusable navigation content
  const renderNavContent = (isMobile: boolean = false) => (
    <div className="flex flex-col h-full justify-between">
      {/* Top Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100/80 shrink-0">
        <Link
          href="/dashboard"
          onClick={() => isMobile && onClose?.()}
          className="flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <IconHome className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-slate-900 leading-tight">
              PrimeEstate
            </span>
            <span className="text-[10px] font-medium text-slate-400">
              JV Property Management
            </span>
          </div>
        </Link>

        {isMobile && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close menu"
          >
            <IconX className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Sections (Scrollable if height is compact) */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {/* MAIN */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Main
          </div>
          <nav className="space-y-1">
            {mainLinks.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const isLocked = !isAdmin && item.adminOnly;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.name, item.adminOnly)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${isActive
                      ? "bg-[#4F46E5] text-white shadow-md shadow-indigo-500/25 font-bold"
                      : isLocked
                        ? "text-slate-400 hover:bg-slate-50 hover:text-slate-500"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? "text-white" : "text-slate-400"}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </div>
                  {isLocked && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 flex items-center gap-1 font-normal">
                      <IconLock className="w-2.5 h-2.5" />
                      Admin
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* CONTENT */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Content
          </div>
          <nav className="space-y-1">
            {contentLinks.map((item) => {
              const isLocked = !isAdmin && item.adminOnly;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.name, item.adminOnly)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                  {isLocked && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 flex items-center gap-1 font-normal">
                      <IconLock className="w-2.5 h-2.5" />
                      Admin
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* SYSTEM */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            System
          </div>
          <nav className="space-y-1">
            {systemLinks.map((item) => {
              const isLocked = !isAdmin && item.adminOnly;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.name, item.adminOnly)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                  {isLocked && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 flex items-center gap-1 font-normal">
                      <IconLock className="w-2.5 h-2.5" />
                      Admin
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Screen Lower End Footer (Always pinned at bottom of viewport) */}
      <div className="shrink-0 border-t border-slate-200/80 p-4 bg-slate-50/80 backdrop-blur-xs space-y-3">
        {user ? (
          <div>
            {/* User Profile Info */}
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs ring-2 ring-indigo-200/60 shrink-0">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="truncate text-left">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium truncate">
                    {isAdmin ? "Administrator" : "Customer / Client"}
                  </p>
                </div>
              </div>

              {isAdmin ? (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Admin
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  Client
                </span>
              )}
            </div>

            {/* Prominent Log Out Button matching Listora / PrimeEstate lower end */}
            <button
              type="button"
              onClick={() => {
                logout();
                if (isMobile) onClose?.();
              }}
              title="Log Out of CRM"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <IconLogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-600" />
              <span>Log Out</span>
            </button>

            {/* Quick Login / Switch Account link */}
            <div className="text-center mt-2">
              <Link
                href="/login"
                onClick={() => isMobile && onClose?.()}
                className="text-[10px] text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
              >
                Switch Account / Login
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <IconUser className="w-4 h-4 text-slate-400" />
              <span>Not logged in</span>
            </div>
            <Link
              href="/login"
              onClick={() => isMobile && onClose?.()}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition cursor-pointer"
            >
              <IconUser className="w-4 h-4" />
              <span>Log In</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Fixed Sticky Sidebar (pinned to screen lower end, hidden on mobile/tablet) */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200/80 flex-col justify-between shrink-0 h-screen sticky top-0 z-30 shadow-xs">
        {renderNavContent(false)}
      </aside>

      {/* 2. Mobile & Tablet Drawer (shown only when opened via hamburger menu) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Slide-over panel */}
          <aside className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col justify-between h-full z-10 transition-transform duration-300">
            {renderNavContent(true)}
          </aside>
        </div>
      )}
    </>
  );
}
