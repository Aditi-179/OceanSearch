"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { 
  PaperPlaneTilt, 
  BatteryFull, 
  BatteryLow, 
  Warning, 
  CheckCircle, 
  MapPin, 
  WifiHigh, 
  CaretRight,
  Drop
} from "@phosphor-icons/react";

// Mock Data for Drones
const DRONES = [
  { id: "RX-7A", status: "active", location: "Indian Ocean", depth: 12, battery: 84, capacity: 45, type: "Scout" },
  { id: "RX-7B", status: "active", location: "Pacific Rim", depth: 45, battery: 62, capacity: 88, type: "Collector" },
  { id: "NX-2A", status: "charging", location: "Base Station Alpha", depth: 0, battery: 15, capacity: 0, type: "Heavy" },
  { id: "NX-2B", status: "active", location: "Atlantic Shelf", depth: 110, battery: 42, capacity: 12, type: "Scout" },
  { id: "M-404", status: "offline", location: "Unknown", depth: 0, battery: 0, capacity: 0, type: "Collector" },
];

const LOGS = [
  { time: "10:24:36 AM", msg: "Visual lock on target: Sea Turtle (96%)", type: "info" },
  { time: "10:22:12 AM", msg: "Plastic density critical. Initiating collection protocol.", type: "warning" },
  { time: "10:18:05 AM", msg: "Depth adjusted to 12m.", type: "info" },
  { time: "10:15:00 AM", msg: "Routine sector scan completed. No anomalies.", type: "success" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: { 
    opacity: 1, 
    x: 0, 
    transition: { type: "spring", stiffness: 300, damping: 24 } 
  }
};

export default function FleetPage() {
  const [activeDrone, setActiveDrone] = useState(DRONES[0]);
  const gaugeRef = useRef(null);

  useGSAP(() => {
    // Animate the GSAP gauges when a new drone is selected
    gsap.fromTo(
      ".gsap-battery-gauge",
      { strokeDashoffset: 125 },
      { strokeDashoffset: 125 - (125 * (activeDrone.battery / 100)), duration: 1.5, ease: "power3.out" }
    );
    gsap.fromTo(
      ".gsap-capacity-gauge",
      { strokeDashoffset: 125 },
      { strokeDashoffset: 125 - (125 * (activeDrone.capacity / 100)), duration: 1.5, ease: "power3.out", delay: 0.2 }
    );
  }, { dependencies: [activeDrone], scope: gaugeRef });

  return (
    <div className="flex-1 bg-[#0B1120] text-slate-300 font-sans p-6 space-y-6 overflow-hidden flex flex-col h-[calc(100vh-theme(spacing.16))]">
      
      {/* ---------------- HEADER METRICS ---------------- */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-4 gap-4 shrink-0"
      >
        <motion.div variants={itemVariants} className="bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><PaperPlaneTilt size={24} weight="duotone" /></div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Total Fleet</p>
            <p className="text-2xl font-black text-white">1,024</p>
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="p-3 bg-[#39FF14]/10 rounded-xl text-[#39FF14]"><CheckCircle size={24} weight="duotone" /></div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Active Missions</p>
            <p className="text-2xl font-black text-white">842</p>
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400"><BatteryLow size={24} weight="duotone" /></div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Charging / Bay</p>
            <p className="text-2xl font-black text-white">164</p>
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-xl text-red-400"><Warning size={24} weight="duotone" /></div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Offline / Maint</p>
            <p className="text-2xl font-black text-white">18</p>
          </div>
        </motion.div>
      </motion.div>

      {/* ---------------- MAIN INTERFACE ---------------- */}
      <div className="flex-1 flex gap-6 min-h-0">
        
        {/* LEFT COLUMN: ROSTER */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-1/3 bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-2xl flex flex-col overflow-hidden"
        >
          <div className="p-4 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/80">
            <h2 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
              <WifiHigh size={16} className="text-[#00F0FF] animate-pulse" /> Local Sector Roster
            </h2>
            <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">5 Units</span>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-3">
            {DRONES.map((drone) => (
              <motion.div
                key={drone.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveDrone(drone)}
                className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                  activeDrone.id === drone.id 
                    ? "bg-slate-800/80 border-[#00F0FF]/50 shadow-[0_0_15px_rgba(0,240,255,0.1)]" 
                    : "bg-white/5 border-transparent hover:border-slate-700 hover:bg-white/10"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-white tracking-wider flex items-center gap-2">
                    {drone.id}
                    {activeDrone.id === drone.id && <div className="w-1.5 h-1.5 bg-[#00F0FF] rounded-full animate-pulse" />}
                  </span>
                  {drone.status === 'active' && <span className="text-[10px] font-bold text-[#39FF14] bg-[#39FF14]/10 px-2 py-0.5 rounded uppercase tracking-widest">Active</span>}
                  {drone.status === 'charging' && <span className="text-[10px] font-bold text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded uppercase tracking-widest">Charging</span>}
                  {drone.status === 'offline' && <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded uppercase tracking-widest">Offline</span>}
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1"><MapPin size={12} /> {drone.location}</span>
                  <span className="flex items-center gap-1"><BatteryFull size={12} /> {drone.battery}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT COLUMN: DETAILS */}
        <div className="w-2/3 flex flex-col gap-6 overflow-y-auto scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeDrone.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              
              {/* VIDEO FEED */}
              <div className="bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative h-80 flex flex-col">
                <div className="flex justify-between items-center p-3 border-b border-slate-800/50 z-10 bg-slate-900/80">
                  <h2 className="text-sm font-bold text-white tracking-widest flex items-center gap-2 uppercase">
                    Live Feed: {activeDrone.id}
                  </h2>
                  <span className="text-xs font-mono text-[#00F0FF] animate-pulse uppercase tracking-widest">Rec</span>
                </div>
                
                <div className="flex-1 relative bg-[#040A14] overflow-hidden">
                  {activeDrone.status === 'active' ? (
                    <>
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546026423-cc4642628d2b?q=80&w=2000')] bg-cover bg-center opacity-70" />
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[length:20px_20px]" />
                      <div className="absolute top-[20%] left-[25%] w-24 h-24 border border-[#00F0FF] bg-[#00F0FF]/10 z-10">
                        <div className="absolute -top-6 left-[-1px] bg-[#00F0FF] text-[#0B1120] text-[10px] font-bold px-1 py-0.5 whitespace-nowrap">
                          Sea Turtle 96%
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center flex-col text-slate-500 font-mono text-sm">
                      <Warning size={48} className="mb-2 opacity-50" />
                      Feed Unavailable
                      <span className="text-xs mt-1">Status: {activeDrone.status.toUpperCase()}</span>
                    </div>
                  )}
                  
                  {/* Overlay HUD */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between text-[10px] font-mono text-[#00F0FF]/80">
                    <span>TYPE: {activeDrone.type.toUpperCase()}</span>
                    <span>LAT: 12.9716 N / LON: 77.5946 E</span>
                  </div>
                </div>
              </div>

              {/* TELEMETRY & LOGS */}
              <div className="grid grid-cols-2 gap-6" ref={gaugeRef}>
                
                {/* Telemetry Dials */}
                <div className="bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-2xl p-6 flex flex-col">
                  <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-6">Live Telemetry</h3>
                  <div className="flex-1 flex justify-around items-center">
                    
                    {/* Battery Gauge */}
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg viewBox="0 0 50 50" className="absolute inset-0 w-full h-full -rotate-90">
                        <circle cx="25" cy="25" r="20" fill="none" stroke="#1E293B" strokeWidth="4" />
                        <circle 
                          className="gsap-battery-gauge"
                          cx="25" cy="25" r="20" fill="none" 
                          stroke={activeDrone.battery > 20 ? "#39FF14" : "#EF4444"} 
                          strokeWidth="4" strokeLinecap="round" 
                          strokeDasharray="125" 
                        />
                      </svg>
                      <div className="text-center">
                        <span className="text-xl font-black text-white">{activeDrone.battery}%</span>
                        <p className="text-[8px] text-slate-400 font-mono uppercase tracking-widest">Battery</p>
                      </div>
                    </div>

                    {/* Capacity Gauge */}
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg viewBox="0 0 50 50" className="absolute inset-0 w-full h-full -rotate-90">
                        <circle cx="25" cy="25" r="20" fill="none" stroke="#1E293B" strokeWidth="4" />
                        <circle 
                          className="gsap-capacity-gauge"
                          cx="25" cy="25" r="20" fill="none" 
                          stroke="#00F0FF" 
                          strokeWidth="4" strokeLinecap="round" 
                          strokeDasharray="125" 
                        />
                      </svg>
                      <div className="text-center">
                        <span className="text-xl font-black text-white">{activeDrone.capacity}%</span>
                        <p className="text-[8px] text-slate-400 font-mono uppercase tracking-widest">Storage</p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Mission Logs */}
                <div className="bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-2xl p-6 flex flex-col h-48">
                  <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-4">Mission Terminal</h3>
                  <div className="flex-1 overflow-y-auto scrollbar-hide space-y-3">
                    {activeDrone.status === 'active' ? LOGS.map((log, i) => (
                      <div key={i} className="text-xs font-mono border-l-2 pl-3 py-1" style={{ borderColor: log.type === 'warning' ? '#F59E0B' : log.type === 'success' ? '#10B981' : '#3B82F6' }}>
                        <span className="text-slate-500 mr-2">[{log.time}]</span>
                        <span className="text-slate-300">{log.msg}</span>
                      </div>
                    )) : (
                      <div className="text-xs font-mono text-slate-500 italic">No recent logs available for offline unit.</div>
                    )}
                  </div>
                </div>

              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
