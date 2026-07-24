"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  List,
  MapTrifold,
  Scan,
  Waveform,
  Anchor,
  Gear,
  CaretLeft,
  Flask,
} from "@phosphor-icons/react";

export default function DashboardSidebar() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: MapTrifold },
    { name: "Simulation", href: "/simulation", icon: Flask },
    { name: "Fleet", href: "/dashboard/fleet", icon: Waveform },
    { name: "Settings", href: "/dashboard/settings", icon: Gear },
  ];


  return (
    <motion.div
      initial={{ width: 240 }}
      animate={{ width: isSidebarExpanded ? 240 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-full bg-slate-900/40 backdrop-blur-lg border-r border-slate-800 flex flex-col z-20 shrink-0"
      onMouseEnter={() => setIsSidebarExpanded(true)}
      onMouseLeave={() => setIsSidebarExpanded(false)}
    >
      {/* Header & Toggle */}
      <div className="flex items-center justify-between p-6 min-h-[88px] shrink-0">
        <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
          <Anchor
            size={32}
            weight="duotone"
            className="text-[#00F0FF] shrink-0 drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]"
          />
          <AnimatePresence>
            {isSidebarExpanded && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="font-bold text-white tracking-wide text-lg"
              >
                DSG Admin
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          className="text-slate-400 hover:text-[#00F0FF] transition-colors shrink-0 outline-none"
        >
          {isSidebarExpanded ? <CaretLeft size={24} /> : <List size={24} />}
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex-1 px-4 py-4 space-y-2 overflow-y-auto scrollbar-hide" data-lenis-prevent="" suppressHydrationWarning>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`w-full flex items-center ${
                isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"
              } py-3 rounded-xl transition-all group ${
                isActive 
                  ? "bg-slate-800/80 text-[#00F0FF]" 
                  : "text-slate-400 hover:text-[#00F0FF] hover:bg-slate-800/50"
              }`}
            >
              <item.icon
                size={24}
                weight="duotone"
                className={`shrink-0 transition-colors ${isActive ? "text-[#00F0FF]" : "group-hover:text-[#00F0FF]"}`}
              />
              <AnimatePresence>
                {isSidebarExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-3 whitespace-nowrap font-medium"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </div>

      {/* Back to Portal */}
      <div className="p-6 border-t border-slate-800/50 shrink-0">
        <Link
          href="/"
          className={`flex items-center text-slate-400 hover:text-white transition-colors group ${
            !isSidebarExpanded ? "justify-center" : ""
          }`}
        >
          <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-[#00F0FF]/10 group-hover:text-[#00F0FF] transition-colors">
            <CaretLeft size={20} weight="bold" />
          </div>
          <AnimatePresence>
            {isSidebarExpanded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="ml-3 whitespace-nowrap overflow-hidden text-sm font-medium"
              >
                Back to Portal
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>
    </motion.div>
  );
}
