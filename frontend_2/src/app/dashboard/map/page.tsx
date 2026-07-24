"use client";

import React from "react";
import PredictiveMap from "@/components/dashboard/PredictiveMap";
import { motion } from "framer-motion";
import { GlobeHemisphereEast, ShieldCheck, ChartLineUp, MapPin } from "@phosphor-icons/react";

export default function PredictiveMapPage() {
  return (
    <div className="flex-1 h-full bg-[#0B1120] text-slate-300 font-sans p-6 space-y-6 flex flex-col overflow-hidden">
      {/* HEADER SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="shrink-0 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#00F0FF]/10 text-[#00F0FF] rounded-2xl border border-[#00F0FF]/20 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <GlobeHemisphereEast size={32} weight="duotone" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
              Predictive AI Risk Map
              <span className="bg-[#39FF14]/10 text-[#39FF14] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest border border-[#39FF14]/20 shadow-[0_0_10px_rgba(57,255,20,0.2)]">
                Live Model
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">Timeline simulation for plastic pollution and ecological threats.</p>
          </div>
        </div>
        
        {/* Quick Stats Header */}
        <div className="flex gap-4">
          <div className="bg-slate-900/60 backdrop-blur-lg border border-slate-800 rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl">
            <ShieldCheck size={24} className="text-emerald-400" weight="duotone" />
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Model Accuracy</p>
              <p className="text-lg font-black text-white leading-none mt-1">98.4%</p>
            </div>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-lg border border-slate-800 rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl">
            <ChartLineUp size={24} className="text-orange-400" weight="duotone" />
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Projection Range</p>
              <p className="text-lg font-black text-white leading-none mt-1">2025 - 2050</p>
            </div>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-lg border border-slate-800 rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl">
            <MapPin size={24} className="text-[#00F0FF]" weight="duotone" />
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Active Zones</p>
              <p className="text-lg font-black text-white leading-none mt-1">3 Regions</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* MAP CONTAINER */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
        className="flex-1 min-h-0 relative rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,100,255,0.15)] border border-slate-800/80"
      >
        <PredictiveMap />
      </motion.div>
    </div>
  );
}
