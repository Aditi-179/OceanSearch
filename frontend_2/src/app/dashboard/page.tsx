"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  List,
  MapTrifold,
  Scan,
  Waveform,
  Anchor,
  Thermometer,
  Drop,
  Warning,
  Bell,
  CaretLeft,
} from "@phosphor-icons/react";

export default function DashboardPage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const menuItems = [
    { name: "Dashboard", icon: MapTrifold },
    { name: "Map", icon: MapTrifold },
    { name: "AI Vision", icon: Scan },
    { name: "Fleet", icon: Waveform },
  ];

  const fleet = [
    { id: "DSG-01", active: true },
    { id: "DSG-02", active: true },
    { id: "DSG-03", active: false },
  ];

  const alerts = [
    {
      id: 1,
      title: "Illegal Dumping Detected",
      type: "critical",
      time: "10:42 AM",
      coords: "12.45°N, 142.12°E",
    },
    {
      id: 2,
      title: "Ghost Net Identified",
      type: "warning",
      time: "10:38 AM",
      coords: "12.48°N, 142.05°E",
    },
    {
      id: 3,
      title: "Low Battery: DSG-02",
      type: "warning",
      time: "10:15 AM",
      coords: "Base Station Alpha",
    },
    {
      id: 4,
      title: "Coral Stress Spike",
      type: "critical",
      time: "09:50 AM",
      coords: "Sector 7G",
    },
  ];

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#0B1120] text-slate-300 font-sans selection:bg-[#00F0FF]/30 selection:text-white">
      {/* 1. COLLAPSIBLE SIDEBAR */}
      <motion.div
        initial={{ width: 240 }}
        animate={{ width: isSidebarExpanded ? 240 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="h-full bg-slate-900/40 backdrop-blur-lg border-r border-slate-800 flex flex-col z-20 shrink-0"
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
        <div className="flex-1 px-4 py-4 space-y-2 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`w-full flex items-center ${
                isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"
              } py-3 rounded-xl text-slate-400 hover:text-[#00F0FF] hover:bg-slate-800/50 transition-all group`}
            >
              <item.icon
                size={24}
                weight="duotone"
                className="shrink-0 group-hover:text-[#00F0FF] transition-colors"
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
            </button>
          ))}
        </div>

        {/* Fleet Status */}
        <div className="p-6 border-t border-slate-800/50 shrink-0">
          <AnimatePresence>
            {isSidebarExpanded ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="whitespace-nowrap"
              >
                <h3 className="text-xs font-semibold text-slate-500 mb-4 tracking-wider uppercase">
                  Fleet Status
                </h3>
                <div className="space-y-3">
                  {fleet.map((drone) => (
                    <div
                      key={drone.id}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-slate-300">
                        {drone.id}
                      </span>
                      <div className="flex items-center gap-2">
                        {drone.active ? (
                          <>
                            <span className="text-[10px] text-[#39FF14] font-mono tracking-wider">
                              ON
                            </span>
                            <div className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse shadow-[0_0_8px_rgba(57,255,20,0.6)]" />
                          </>
                        ) : (
                          <>
                            <span className="text-[10px] text-red-500 font-mono tracking-wider">
                              ERR
                            </span>
                            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                {fleet.map((drone) => (
                  <div
                    key={drone.id}
                    className={`w-2 h-2 rounded-full ${
                      drone.active
                        ? "bg-[#39FF14] animate-pulse shadow-[0_0_8px_rgba(57,255,20,0.6)]"
                        : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                    }`}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden z-10">
        
        {/* Top Bar: IoT Telemetry */}
        <div className="h-20 shrink-0 grid grid-cols-3 gap-4">
          <div className="bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-2xl flex items-center px-6 gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Thermometer size={24} weight="duotone" className="text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Water Temp</p>
              <p className="text-xl font-bold text-white tracking-tight">28.4°C</p>
            </div>
          </div>
          
          <div className="bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-2xl flex items-center px-6 gap-4">
            <div className="p-3 bg-[#00F0FF]/10 rounded-xl">
              <Drop size={24} weight="duotone" className="text-[#00F0FF]" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">pH Level</p>
              <p className="text-xl font-bold text-white tracking-tight">8.1</p>
            </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-2xl flex items-center px-6 gap-4 relative overflow-hidden">
            <div className="p-3 bg-red-500/10 rounded-xl z-10">
              <Warning size={24} weight="duotone" className="text-red-400" />
            </div>
            <div className="z-10 flex-1">
              <p className="text-xs text-slate-400 font-medium">Coral Stress Index</p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-red-400 tracking-tight">High</p>
                <span className="text-xs font-mono text-red-400/80">92%</span>
              </div>
            </div>
            {/* Subtle red warning gradient in background */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-red-500/10" />
            <div className="absolute bottom-0 left-0 h-1 bg-red-500 w-[92%]" />
          </div>
        </div>

        {/* The Main Grid */}
        <div className="grid grid-cols-12 grid-rows-6 gap-4 flex-1 min-h-0">
          
          {/* Center Map (Predictive Risk) */}
          <div className="col-span-8 row-span-4 bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-2xl relative overflow-hidden flex flex-col p-6">
            <div className="flex justify-between items-center z-10 mb-4">
              <h2 className="text-lg font-semibold text-white tracking-wide">Predictive Risk Map</h2>
              <span className="px-3 py-1 bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-mono rounded-full">
                LIVE FEED
              </span>
            </div>
            
            {/* Simulated Map Background */}
            <div className="absolute inset-0 top-16 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0f1b36] via-[#0B1120] to-[#0B1120] opacity-80" />
            
            {/* Grid overlay */}
            <div className="absolute inset-0 top-16 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-5" />

            {/* Glowing Red Plastic Accumulation Heatmap */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-600/30 blur-[60px] rounded-full pointer-events-none" />
            <div className="absolute top-[45%] left-[55%] w-32 h-32 bg-orange-500/40 blur-[40px] rounded-full pointer-events-none" />
            
            {/* Pulsing Cyan Drone Dots */}
            <div className="absolute top-1/3 left-1/4">
              <div className="w-3 h-3 bg-[#00F0FF] rounded-full animate-ping absolute opacity-75" style={{ animationDuration: '2s' }} />
              <div className="w-3 h-3 bg-[#00F0FF] rounded-full relative shadow-[0_0_12px_#00F0FF]" />
              <span className="absolute top-4 left-4 text-[10px] font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-1 rounded">DSG-01</span>
            </div>
            
            <div className="absolute bottom-1/3 right-1/4">
              <div className="w-3 h-3 bg-[#00F0FF] rounded-full animate-ping absolute opacity-75" style={{ animationDuration: '2s', animationDelay: '1s' }} />
              <div className="w-3 h-3 bg-[#00F0FF] rounded-full relative shadow-[0_0_12px_#00F0FF]" />
              <span className="absolute top-4 left-4 text-[10px] font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-1 rounded">DSG-02</span>
            </div>
          </div>

          {/* Bottom Left (AI Benthic Vision) */}
          <div className="col-span-8 row-span-2 bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-2xl relative overflow-hidden p-6 flex flex-col">
             <div className="flex justify-between items-center z-20 mb-2">
              <h2 className="text-lg font-semibold text-white tracking-wide">AI Benthic Vision Feed</h2>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                 <span className="text-xs font-mono text-red-500 tracking-widest">REC</span>
              </div>
            </div>
            
            {/* Camera Feed Background */}
            <div className="absolute inset-0 top-14 bg-gradient-to-b from-[#091524] to-[#040a14]" />
            <div className="absolute inset-0 top-14 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100%_4px] pointer-events-none" />

            {/* AI Bounding Boxes */}
            {/* Ghost Net (Red) */}
            <div className="absolute top-[40%] left-[20%] w-48 h-32 border-2 border-red-500 bg-red-500/5 z-10 flex flex-col justify-end p-1">
              <span className="text-[10px] bg-red-500 text-white font-mono px-1 w-max">
                [Ghost Net] 98%
              </span>
            </div>

            {/* Hawksbill Turtle (Green) */}
            <div className="absolute bottom-[20%] right-[15%] w-32 h-24 border-2 border-[#39FF14] bg-[#39FF14]/5 z-10 flex flex-col justify-start p-1">
              <span className="text-[10px] bg-[#39FF14] text-black font-mono font-bold px-1 w-max -mt-5">
                [Hawksbill Turtle] 94%
              </span>
            </div>
          </div>

          {/* Right Panel (Live Alerts) */}
          <div className="col-span-4 row-span-6 bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-800/50 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-semibold text-white tracking-wide flex items-center gap-2">
                <Bell size={20} className="text-slate-400" />
                Live Incident Log
              </h2>
              <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs font-mono rounded-md">
                4 New
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
              {alerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-4 rounded-xl border ${
                    alert.type === 'critical' 
                      ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/40' 
                      : 'bg-orange-500/5 border-orange-500/20 hover:border-orange-500/40'
                  } transition-colors group cursor-default`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={`font-semibold text-sm ${alert.type === 'critical' ? 'text-red-400' : 'text-orange-400'}`}>
                      {alert.title}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-400 transition-colors">
                      {alert.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                    <MapTrifold size={14} />
                    {alert.coords}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
