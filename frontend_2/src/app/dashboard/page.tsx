"use client";

import React, { useRef } from "react";
import {
  VideoCamera,
  Warning,
  Info,
  CheckCircle,
  MapPin,
  CaretRight,
  Plus,
  Thermometer,
  Drop,
  Waves,
  Leaf,
  Fish,
  Wind
} from "@phosphor-icons/react";
import { motion, Variants } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 } 
  }
};

export default function DashboardPage() {
  const svgScope = useRef(null);

  useGSAP(() => {
    // GSAP Advanced Timeline for SVGs to draw them on mount
    gsap.fromTo(
      ".gsap-path", 
      { strokeDasharray: 200, strokeDashoffset: 200 },
      { strokeDashoffset: 0, duration: 2, ease: "power3.out", stagger: 0.15 }
    );
    
    gsap.fromTo(
      ".gsap-gauge",
      { strokeDasharray: 125.66, strokeDashoffset: 125.66 },
      { strokeDashoffset: 125.66 * (1 - 0.72), duration: 1.5, ease: "bounce.out", delay: 0.5 }
    );
  }, { scope: svgScope });

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex-1 bg-[#0B1120] text-slate-300 font-sans p-6 space-y-8"
      ref={svgScope}
    >
      
      {/* ---------------- ROW 1 ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* AI DRONE FEED (col-span-6) */}
        <motion.div variants={itemVariants} whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }} className="lg:col-span-6 bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[420px] shadow-2xl relative">
          <div className="flex justify-between items-center p-4 border-b border-slate-800/50 z-10 bg-slate-900/80">
            <h2 className="text-sm font-bold text-white tracking-widest flex items-center gap-2 uppercase">
              AI Drone Feed
              <span className="flex items-center gap-1 text-[10px] text-red-500 ml-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE
              </span>
            </h2>
            <span className="text-xs font-mono text-slate-400">10:24:36 AM</span>
          </div>
          <div className="flex-1 relative bg-[#040A14] overflow-hidden group">
            {/* Base Image/Video Simulation */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546026423-cc4642628d2b?q=80&w=2000')] bg-cover bg-center opacity-60" />
            
            {/* Grid & Vignette Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[length:20px_20px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent opacity-80" />
            
            {/* Bounding Boxes */}
            <div className="absolute top-[20%] left-[25%] w-24 h-24 border border-[#00F0FF] bg-[#00F0FF]/10 z-10">
              <div className="absolute -top-6 left-[-1px] bg-[#00F0FF] text-[#0B1120] text-[10px] font-bold px-1 py-0.5 whitespace-nowrap">
                Sea Turtle 96%
              </div>
            </div>
            <div className="absolute top-[45%] left-[50%] w-32 h-20 border border-red-500 bg-red-500/10 z-10">
              <div className="absolute -top-6 left-[-1px] bg-red-500 text-white text-[10px] font-bold px-1 py-0.5 whitespace-nowrap">
                Plastic Bottle 91%
              </div>
            </div>
            <div className="absolute bottom-[25%] right-[10%] w-20 h-16 border border-[#39FF14] bg-[#39FF14]/10 z-10">
              <div className="absolute -top-6 left-[-1px] bg-[#39FF14] text-[#0B1120] text-[10px] font-bold px-1 py-0.5 whitespace-nowrap">
                Coral 87%
              </div>
            </div>

            {/* Bottom HUD */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between text-[10px] font-mono text-[#00F0FF]/80">
              <span>Drone ID: RX-7A</span>
              <span>Depth: 12m</span>
              <span>Location: Indian Ocean</span>
            </div>
          </div>
        </motion.div>

        {/* THREAT ALERTS (col-span-3) */}
        <motion.div variants={itemVariants} whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }} className="lg:col-span-3 bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-2xl flex flex-col h-[420px] shadow-2xl">
          <div className="flex justify-between items-center p-4 border-b border-slate-800/50">
            <h2 className="text-sm font-bold text-white tracking-widest uppercase">Threat Alerts</h2>
            <button className="text-xs text-[#00F0FF] hover:underline uppercase tracking-wider font-semibold">View All</button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto scrollbar-hide space-y-4">
            {/* Alert 1 */}
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
              <div className="flex gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg shrink-0 h-fit">
                  <Warning weight="fill" className="text-red-500 text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-white truncate">Plastic Accumulation</h3>
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-500/10 px-1.5 py-0.5 rounded">High</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">High density detected</p>
                  
                  <svg className="w-full h-6 mt-3 text-red-500" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path className="gsap-path" d="M0,15 L20,10 L40,18 L60,8 L80,12 L100,5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="text-[10px] font-mono text-slate-500 mt-2">10:21 AM</p>
                </div>
              </div>
            </div>

            {/* Alert 2 */}
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />
              <div className="flex gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg shrink-0 h-fit">
                  <Info weight="fill" className="text-orange-500 text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-white truncate">Illegal Fishing Activity</h3>
                    <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest bg-orange-500/10 px-1.5 py-0.5 rounded">Medium</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Vessel detected in zone</p>
                  
                  <svg className="w-full h-6 mt-3 text-orange-500" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path className="gsap-path" d="M0,18 L20,15 L40,16 L60,10 L80,12 L100,8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="text-[10px] font-mono text-slate-500 mt-2">10:15 AM</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* OCEAN HEALTH SCORE (col-span-3) */}
        <motion.div variants={itemVariants} whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }} className="lg:col-span-3 bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-2xl flex flex-col h-[420px] shadow-2xl p-6">
          <h2 className="text-sm font-bold text-white tracking-widest uppercase mb-6">Ocean Health Score</h2>
          
          <div className="flex-1 flex flex-col items-center">
            {/* SVG Gauge */}
            <div className="relative w-48 h-24 overflow-hidden mb-2">
              <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                {/* Background arc */}
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1E293B" strokeWidth="12" strokeLinecap="round" />
                {/* Progress arc (Good score, mostly green/cyan) */}
                <path className="gsap-gauge" d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="url(#gradient)" strokeWidth="12" strokeLinecap="round" />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute bottom-0 left-0 right-0 text-center">
                <span className="text-5xl font-black text-white tracking-tighter">72</span>
                <p className="text-xs font-bold text-[#10b981] uppercase tracking-widest mt-1">Good</p>
                <p className="text-[10px] font-mono text-[#10b981]">+8% vs last week</p>
              </div>
            </div>

            {/* Sub-metrics */}
            <div className="w-full mt-auto space-y-4">
              {[
                { label: "Water Quality", val: 78, color: "bg-[#0ea5e9]" },
                { label: "Biodiversity", val: 72, color: "bg-[#10b981]" },
                { label: "Habitat Health", val: 68, color: "bg-[#f59e0b]" },
                { label: "Threat Level", val: 36, color: "bg-[#ef4444]", reverse: true }
              ].map((m, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-semibold uppercase tracking-wider">
                    <span className="text-slate-400">{m.label}</span>
                    <span className="text-white">{m.val}</span>
                  </div>
                  <div className="relative w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${m.reverse ? m.val : m.val}%` }}
                      transition={{ duration: 1.5, delay: 0.5 + (i * 0.1), ease: "easeOut" }}
                      className={`absolute top-0 left-0 bottom-0 ${m.color}`} 
                    />
                  </div>
                </div>
              ))}
              <p className="text-[10px] text-center text-slate-500 font-mono mt-4 pt-4 border-t border-slate-800/50">
                Updated 2 min ago
              </p>
            </div>
          </div>
        </motion.div>

      </div>

      {/* ---------------- ROW 2 (IOT SENSORS) ---------------- */}
      <motion.div variants={itemVariants}>
        <h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-4 flex items-center gap-2">
          IoT Sensor Data
          <span className="flex items-center gap-1 text-[10px] text-[#39FF14] ml-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse" /> LIVE
          </span>
        </h3>
        <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {[
            { title: "Water Temp", val: "24.6", unit: "°C", color: "text-blue-400", path: "M0,15 L10,12 L20,18 L30,10 L40,15 L50,8", icon: Thermometer },
            { title: "pH Level", val: "8.12", unit: "", color: "text-[#10b981]", path: "M0,18 L15,16 L30,10 L40,8 L50,14", icon: Drop },
            { title: "Salinity", val: "34.7", unit: "PSU", color: "text-blue-500", path: "M0,15 L15,15 L30,12 L45,15 L50,14", icon: Waves },
            { title: "Dissolved Oxygen", val: "6.2", unit: "mg/L", color: "text-[#00F0FF]", path: "M0,18 L15,15 L25,18 L40,10 L50,6", icon: Wind },
            { title: "Turbidity", val: "2.1", unit: "NTU", color: "text-orange-400", path: "M0,8 L15,10 L30,14 L40,12 L50,15", icon: Waves },
            { title: "Biodiversity Index", val: "78", unit: "/100", color: "text-purple-400", path: "M0,20 L15,15 L30,5 L40,4 L50,8", icon: Fish },
          ].map((sensor, i) => (
            <motion.div variants={itemVariants} whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)" }} key={i} className="bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-xl p-4 flex flex-col hover:border-slate-700 transition-colors cursor-default">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-slate-400">{sensor.title}</span>
                <sensor.icon size={14} className="text-slate-600" />
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-bold text-white tracking-tight">{sensor.val}</span>
                <span className="text-xs font-medium text-slate-500">{sensor.unit}</span>
              </div>
              <div className="mt-auto">
                <svg className={`w-full h-6 ${sensor.color}`} viewBox="0 0 50 20" fill="none" stroke="currentColor" strokeWidth="2" preserveAspectRatio="none">
                  <path className="gsap-path" d={sensor.path} strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="flex justify-between text-[8px] font-mono text-slate-600 mt-2">
                  <span>10:00 AM</span>
                  <span>10:33 AM</span>
                </div>
              </div>
            </motion.div>
          ))}

        </motion.div>
      </motion.div>

      {/* ---------------- ROW 3 ---------------- */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">
        
        {/* LIVE OCEAN MAP (col-span-4) */}
        <motion.div variants={itemVariants} whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }} className="lg:col-span-4 bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-2xl p-6 flex flex-col h-[500px] shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-center z-10 mb-6">
            <h2 className="text-sm font-bold text-white tracking-widest uppercase">Live Ocean Map</h2>
            <div className="flex gap-2">
              <button className="bg-slate-800 hover:bg-slate-700 text-xs text-white px-3 py-1.5 rounded-lg transition-colors font-medium">Layers</button>
              <button className="bg-slate-800 hover:bg-slate-700 text-xs text-white px-3 py-1.5 rounded-lg transition-colors font-medium">Filters</button>
            </div>
          </div>

          <div className="flex-1 bg-[#040A14] rounded-xl relative overflow-hidden border border-slate-800/50">
            {/* Map Background Mock */}
            <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center opacity-10" style={{ filter: 'invert(1)' }} />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0B1120]/50 to-[#0B1120]" />
            
            {/* Map Nodes/Connections */}
            <svg className="absolute inset-0 w-full h-full">
              <path className="gsap-path" d="M 50 150 Q 150 100 250 200" fill="none" stroke="#00F0FF" strokeWidth="1" strokeDasharray="4 4" style={{ strokeDasharray: 200 }} />
            </svg>

            <div className="absolute top-[30%] left-[40%] w-2 h-2 bg-red-500 rounded-full animate-ping shadow-[0_0_10px_red]" />
            <div className="absolute top-[30%] left-[40%] w-2 h-2 bg-red-500 rounded-full" />
            
            <div className="absolute top-[60%] left-[60%] w-2 h-2 bg-[#00F0FF] rounded-full animate-ping shadow-[0_0_10px_#00F0FF]" style={{ animationDelay: '1s' }} />
            <div className="absolute top-[60%] left-[60%] w-2 h-2 bg-[#00F0FF] rounded-full" />

            <div className="absolute top-[40%] left-[20%] w-2 h-2 bg-[#10b981] rounded-full shadow-[0_0_10px_#10b981]" />
            <div className="absolute top-[70%] left-[30%] w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_10px_orange]" />

            {/* Map Legend Overlay */}
            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur border border-slate-700/50 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-[10px] text-slate-300 font-medium">Plastic Hotspots</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500" /><span className="text-[10px] text-slate-300 font-medium">Coral Bleaching</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#00F0FF]" /><span className="text-[10px] text-slate-300 font-medium">Drone Locations</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#10b981]" /><span className="text-[10px] text-slate-300 font-medium">Protected Areas</span></div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-4 left-4 flex flex-col gap-1">
              <button className="w-8 h-8 bg-slate-800 text-white rounded flex items-center justify-center hover:bg-slate-700">+</button>
              <button className="w-8 h-8 bg-slate-800 text-white rounded flex items-center justify-center hover:bg-slate-700">-</button>
            </div>
          </div>
        </motion.div>

        {/* ANALYTICS OVERVIEW (col-span-4) */}
        <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold text-white tracking-widest uppercase">Analytics Overview</h2>
            <span className="flex items-center gap-1 text-[10px] text-[#39FF14]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse" /> LIVE
            </span>
          </div>

          <motion.div variants={containerVariants} className="grid grid-cols-2 gap-4 mb-4">
            {/* Card 1 */}
            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} className="bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-xl p-5 flex flex-col relative overflow-hidden">
              <span className="text-xs font-semibold text-slate-400 mb-2">AI Species Detected</span>
              <span className="text-3xl font-bold text-white tracking-tight mb-2">1,248</span>
              <span className="text-[10px] font-bold text-[#10b981] flex items-center gap-1"><Plus size={10} /> 12%</span>
              <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
                <Fish size={80} weight="fill" />
              </div>
            </motion.div>
            
            {/* Card 2 */}
            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} className="bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-xl p-5 flex flex-col relative overflow-hidden">
              <span className="text-xs font-semibold text-slate-400 mb-2">Plastic Collected</span>
              <span className="text-3xl font-bold text-white tracking-tight mb-2">12.4 <span className="text-sm text-slate-500">Ton</span></span>
              <span className="text-[10px] font-bold text-[#10b981] flex items-center gap-1"><Plus size={10} /> 18%</span>
              <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
                <Drop size={80} weight="fill" />
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} className="bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-xl p-5 flex flex-col relative overflow-hidden">
              <span className="text-xs font-semibold text-slate-400 mb-2">Drone Missions</span>
              <span className="text-3xl font-bold text-white tracking-tight mb-2">32</span>
              <span className="text-[10px] font-bold text-[#10b981] flex items-center gap-1"><Plus size={10} /> 6%</span>
              <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
                <MapPin size={80} weight="fill" />
              </div>
            </motion.div>

            {/* Card 4 */}
            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} className="bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-xl p-5 flex flex-col relative overflow-hidden">
              <span className="text-xs font-semibold text-slate-400 mb-2">Active Sensors</span>
              <span className="text-3xl font-bold text-white tracking-tight mb-2">276</span>
              <span className="text-[10px] font-bold text-[#10b981] flex items-center gap-1"><Plus size={10} /> 14%</span>
              <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
                <Warning size={80} weight="fill" />
              </div>
            </motion.div>
          </motion.div>

          {/* Wide Chart Card */}
          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="flex-1 bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-xl p-5 flex flex-col group cursor-pointer hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1">Ocean Health Score</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">72 / 100</span>
                </div>
                <span className="text-xs font-bold text-[#10b981] mt-1 block">Good</span>
              </div>
              <CaretRight size={16} className="text-slate-500 group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1 mt-auto flex items-end">
              <svg className="w-full h-12 text-blue-500" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="2" preserveAspectRatio="none">
                <path className="gsap-path" d="M0,18 L10,16 L20,17 L30,12 L40,14 L50,15 L60,10 L70,8 L80,12 L90,5 L100,2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </motion.div>
        </motion.div>

        {/* LATEST EVENTS (col-span-4) */}
        <motion.div variants={itemVariants} whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }} className="lg:col-span-4 bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-2xl flex flex-col h-[500px] shadow-2xl">
          <div className="flex justify-between items-center p-6 border-b border-slate-800/50">
            <h2 className="text-sm font-bold text-white tracking-widest uppercase">Latest Events</h2>
            <button className="text-xs text-[#00F0FF] hover:underline uppercase tracking-wider font-semibold">View All</button>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto scrollbar-hide relative">
            {/* Vertical Line — aligned to dot centers: 24px padding + 6px (half of w-3) = 30px */}
            <div className="absolute left-[30px] top-8 bottom-8 w-px bg-slate-800" />
            
            <div className="space-y-6">
              {[
                { time: "10:24 AM", title: "Drone RX-7A launched", desc: "Indian Ocean Sector 7", color: "bg-blue-500" },
                { time: "10:21 AM", title: "Plastic bottle detected", desc: "Confidence: 91%", color: "bg-red-500" },
                { time: "10:15 AM", title: "Coral restoration completed", desc: "Ocean G8", color: "bg-[#10b981]" },
                { time: "10:12 AM", title: "Whale sighting recorded", desc: "Blue Whale detected", color: "bg-blue-500" }
              ].map((ev, i) => (
                <div key={i} className="relative z-10">
                  <span className="text-[10px] font-mono text-slate-500 block mb-1 ml-7">{ev.time}</span>
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 mt-0.5">
                      <div className={`w-3 h-3 rounded-full ${ev.color} ring-4 ring-[#0B1120] shadow-[0_0_8px_rgba(0,0,0,0.4)]`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{ev.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{ev.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </motion.div>
    </motion.div>
  );
}
