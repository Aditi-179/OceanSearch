"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  List,
  CaretLeft,
  Anchor,
  MapTrifold,
  Scan,
  Waveform,
  Gear,
} from "@phosphor-icons/react";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  const navLinks = [
    { name: "Dashboard", icon: MapTrifold },
    { name: "AI Vision", icon: Scan },
    { name: "Telemetry", icon: Waveform },
    { name: "Settings", icon: Gear },
  ];

  const fleet = [
    { id: "DSG-01", active: true },
    { id: "DSG-02", active: true },
    { id: "DSG-03", active: false },
  ];

  return (
    <motion.div
      initial={{ width: 260 }}
      animate={{ width: isExpanded ? 260 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="sticky left-0 top-0 h-screen z-50 bg-[#0F172A] border-r border-slate-800 flex flex-col font-sans"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-center p-6 min-h-[88px]">
        <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
          <Anchor size={32} weight="duotone" className="text-[#00F0FF] shrink-0 drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]" />
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="font-bold text-white tracking-wide"
              >
                DeepSea Guardian
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
        {navLinks.map((link) => (
          <button
            key={link.name}
            className={`w-full flex items-center ${
              isExpanded ? "justify-start px-3" : "justify-center px-0"
            } py-3 rounded-lg text-slate-300 hover:text-[#00F0FF] hover:bg-slate-800/50 transition-all group`}
          >
            <link.icon
              size={24}
              weight="duotone"
              className="shrink-0 group-hover:text-[#00F0FF] transition-colors"
            />
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-3 whitespace-nowrap"
                >
                  {link.name}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>

      {/* Bottom Section (Fleet Status) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="p-6 border-t border-slate-800/50"
          >
            <h3 className="text-xs font-semibold text-slate-500 mb-4 tracking-wider">
              FLEET STATUS
            </h3>
            <div className="space-y-3">
              {fleet.map((drone) => (
                <div key={drone.id} className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">{drone.id}</span>
                  <div className="flex items-center gap-2">
                    {drone.active ? (
                      <>
                        <span className="text-xs text-green-400 font-mono">ON</span>
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      </>
                    ) : (
                      <>
                        <span className="text-xs text-slate-500 font-mono">OFF</span>
                        <div className="w-2 h-2 rounded-full bg-slate-600" />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
