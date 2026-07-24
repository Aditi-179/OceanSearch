"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Thermometer, 
  Drop, 
  PaperPlaneTilt,
  Heartbeat,
  ClockCounterClockwise
} from "@phosphor-icons/react";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function SimulationPage() {
  const [temperature, setTemperature] = useState(26);
  const [phLevel, setPhLevel] = useState(8.1);
  const [droneCount, setDroneCount] = useState(10);

  // Derived state for calculations
  const isBleaching = temperature > 29 || phLevel < 7.9;
  
  // Calculate survival rate based on temperature and pH
  let survivalRate = 100;
  if (temperature > 26) {
    survivalRate -= (temperature - 26) * 15;
  }
  if (phLevel < 8.1) {
    survivalRate -= (8.1 - phLevel) * 100;
  }
  survivalRate = Math.max(0, Math.min(100, Math.round(survivalRate)));

  // Calculate cleanup time (1000 / drones)
  const cleanupMonths = droneCount > 0 ? (1000 / droneCount).toFixed(1) : "Infinite";
  const efficiency = Math.min(100, (droneCount / 100) * 100);

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#0B1120] text-slate-300 font-sans selection:bg-[#00F0FF]/30 selection:text-white">
      <DashboardSidebar />
      <div className="flex-1 flex p-6 gap-6 overflow-hidden">
      
      {/* Left Column: The Lab Controls */}
      <div className="w-1/3 bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-2xl p-6 flex flex-col gap-8 overflow-y-auto scrollbar-hide shrink-0 shadow-2xl">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <Thermometer className="text-[#00F0FF]" weight="duotone" />
            Environmental Variables
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Adjust the parameters below to run real-time predictive models on the digital twin.
          </p>
        </div>

        <div className="space-y-8 flex-1">
          {/* Temperature Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Thermometer size={16} /> Water Temperature
              </label>
              <span className={`text-xl font-mono font-bold ${temperature > 29 ? 'text-red-400' : 'text-[#00F0FF]'}`}>
                {temperature}°C
              </span>
            </div>
            <input
              type="range"
              min="24"
              max="34"
              step="0.5"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
            />
            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span>24°C</span>
              <span>34°C</span>
            </div>
          </div>

          {/* pH Level Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Drop size={16} /> Ocean pH (Acidity)
              </label>
              <span className={`text-xl font-mono font-bold ${phLevel < 7.9 ? 'text-red-400' : 'text-[#00F0FF]'}`}>
                {phLevel.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="7.5"
              max="8.3"
              step="0.1"
              value={phLevel}
              onChange={(e) => setPhLevel(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
            />
            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span>7.5 (Acidic)</span>
              <span>8.3 (Normal)</span>
            </div>
          </div>

          {/* Drone Fleet Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <PaperPlaneTilt size={16} /> Active Drone Fleet
              </label>
              <span className="text-xl font-mono font-bold text-[#00F0FF]">
                {droneCount} Units
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={droneCount}
              onChange={(e) => setDroneCount(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
            />
            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span>1</span>
              <span>100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: The Digital Twin Output */}
      <div className="w-2/3 flex flex-col gap-6">
        
        {/* Top Panel: Coral Bleaching Simulator */}
        <div className="bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-2xl p-6 flex flex-col h-1/2 shadow-2xl relative overflow-hidden group">
          <div className="flex items-center gap-2 mb-4 z-10 relative">
            <Heartbeat size={24} weight="duotone" className={isBleaching ? "text-red-500" : "text-[#00F0FF]"} />
            <h2 className="text-xl font-bold text-white tracking-wide">Reef Health Prediction</h2>
          </div>
          
          <motion.div 
            className="flex-1 rounded-xl relative overflow-hidden flex items-center justify-center p-8 transition-colors duration-1000 ease-in-out border border-white/5"
            animate={{
              background: isBleaching 
                ? "linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)" // Dead white/gray
                : "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)" // Vibrant Cyan to Purple
            }}
          >
            {/* Overlay Grid */}
            <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
            
            <div className="relative z-10 text-center">
              <p className={`text-sm font-medium tracking-widest uppercase mb-2 ${isBleaching ? 'text-slate-500' : 'text-white/80'}`}>
                Coral Survival Rate
              </p>
              <motion.h3 
                className={`text-7xl md:text-8xl font-black tracking-tighter ${isBleaching ? 'text-slate-800' : 'text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]'}`}
              >
                {survivalRate}%
              </motion.h3>
              
              {isBleaching && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 inline-flex items-center gap-2 bg-red-500/10 text-red-600 border border-red-500/20 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md"
                >
                  <Thermometer size={16} /> Critical Bleaching Event Detected
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom Panel: Fleet Efficiency Prediction */}
        <div className="bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-2xl p-6 flex flex-col h-1/2 shadow-2xl relative">
          <div className="flex items-center gap-2 mb-6">
            <ClockCounterClockwise size={24} weight="duotone" className="text-[#00F0FF]" />
            <h2 className="text-xl font-bold text-white tracking-wide">Accumulation Cleanup Forecast</h2>
          </div>
          
          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <p className="text-slate-400 mb-2">Estimated Time to Clean Sector Alpha</p>
            <div className="flex items-end gap-3 mb-8">
              <span className="text-6xl font-black text-white tracking-tighter">
                {cleanupMonths}
              </span>
              <span className="text-xl font-medium text-slate-500 pb-2">Months</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-300">Resource Allocation Efficiency</span>
                <span className="text-[#00F0FF] font-mono">{efficiency.toFixed(0)}%</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#00F0FF] to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${efficiency}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
              </div>
            </div>
          </div>
          
          {/* Decorative background element */}
          <div className="absolute right-0 bottom-0 p-8 opacity-5 pointer-events-none">
            <PaperPlaneTilt size={200} weight="fill" />
          </div>
        </div>

      </div>
      </div>
    </div>
  );
}
