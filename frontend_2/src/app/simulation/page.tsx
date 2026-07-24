"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { 
  Thermometer, 
  Drop, 
  PaperPlaneTilt,
  Heartbeat,
  Bank,
  Scales,
  ChartLineUp,
  Leaf,
  WarningCircle,
  CurrencyDollar,
  Recycle
} from "@phosphor-icons/react";
import DashboardSidebar from "@/components/DashboardSidebar";

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
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 } 
  }
};

export default function SimulationPage() {
  // Environmental States
  const [temperature, setTemperature] = useState(26);
  const [phLevel, setPhLevel] = useState(8.1);
  const [droneCount, setDroneCount] = useState(10);
  
  // Policy & Financial States
  const [budget, setBudget] = useState(10); // $M
  const [penalties, setPenalties] = useState(5); // 1-10

  // ----------------------------------------
  // LOGIC & CALCULATIONS
  // ----------------------------------------

  // Card 1: Ecological Tipping Point
  const isExtinction = temperature > 30;
  const targetReached = temperature < 29 && budget > 5;
  
  const biomassMessage = isExtinction 
    ? "Mass Extinction Event Triggered (-45% Biomass)"
    : targetReached 
      ? "Target Reached (+12% YoY)"
      : "Stagnant Recovery (-2% YoY)";
  
  const biomassColor = isExtinction ? "text-red-500" : targetReached ? "text-[#39FF14]" : "text-yellow-500";

  let turtleSurvival = 100 - (Math.max(0, temperature - 26) * 10) - ((8.1 - phLevel) * 50);
  turtleSurvival += (penalties * 1.5) + (droneCount * 0.1);
  turtleSurvival = Math.max(0, Math.min(100, Math.round(turtleSurvival)));

  // Card 2: Blue Economy Financial Impact
  let revenue = 500; // Base $500M
  if (temperature > 29) {
    revenue = 80;
  } else {
    revenue += (budget * 4) + (penalties * 2);
  }
  const isRevenueCrater = revenue <= 80;
  
  // Dynamic SVG Path for revenue
  const revenuePath = isRevenueCrater 
    ? "M 0 50 C 20 50, 40 90, 60 95 S 80 98, 100 100" 
    : targetReached 
      ? "M 0 80 C 20 80, 40 50, 60 40 S 80 10, 100 0"
      : "M 0 60 L 20 60 L 40 50 L 60 55 L 80 50 L 100 45";
  const revenueChartColor = isRevenueCrater ? "stroke-red-500" : targetReached ? "stroke-[#39FF14]" : "stroke-[#00F0FF]";

  // Card 3: ROI & Resource Efficiency
  const droneCost = droneCount * 0.015; // ₹Cr
  const totalCost = droneCost + budget; // Total Gov investment
  const savings = (droneCount * 0.120) + (penalties * 1.2); // ₹Cr
  const roiMultiplier = totalCost > 0 ? (savings / totalCost).toFixed(2) : "0.00";

  // Card 4: Carbon Credit Generation
  let blueCarbon = 150 + (droneCount * 0.4) + (budget * 1.5) + (penalties * 2);
  if (temperature > 29) blueCarbon -= 80;
  blueCarbon = Math.max(0, Math.round(blueCarbon));

  // GSAP Refs
  const revenueRef = useRef<HTMLSpanElement>(null);
  const carbonRef = useRef<HTMLSpanElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Tween Revenue Number
    if (revenueRef.current) {
      gsap.to(revenueRef.current, {
        innerHTML: revenue,
        duration: 1,
        ease: "power3.out",
        snap: { innerHTML: 1 }
      });
    }

    // Tween Carbon Number
    if (carbonRef.current) {
      gsap.to(carbonRef.current, {
        innerHTML: blueCarbon,
        duration: 1,
        ease: "power3.out",
        snap: { innerHTML: 1 }
      });
    }
  }, [revenue, blueCarbon]);

  useGSAP(() => {
    // Infinite slow breathing pulse for Blue Carbon
    if (pulseRef.current) {
      gsap.to(pulseRef.current, {
        scale: 1.05,
        opacity: 0.8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }, []);

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#0B1120] text-slate-300 font-sans selection:bg-[#00F0FF]/30 selection:text-white">
      <DashboardSidebar />
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 flex p-6 gap-6 overflow-hidden"
      >
        
        {/* ================= LEFT COLUMN: LAB CONTROLS ================= */}
        <motion.div variants={itemVariants} className="w-1/3 bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 overflow-y-auto scrollbar-hide shrink-0 shadow-2xl">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
              <Scales className="text-[#00F0FF]" weight="duotone" />
              Policy & Environmental Levers
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Adjust parameters to simulate multi-sector outcomes for stakeholders.
            </p>
          </div>

          <motion.div variants={containerVariants} className="space-y-6 flex-1">
            {/* Gov Budget Slider */}
            <motion.div variants={itemVariants} className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between items-end">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Bank size={16} className="text-emerald-400" /> Enforcement Budget
                </label>
                <span className="text-lg font-mono font-bold text-emerald-400">
                  ₹{budget}Cr
                </span>
              </div>
              <input
                type="range" min="1" max="50" step="1"
                value={budget} onChange={(e) => setBudget(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </motion.div>

            {/* Penalties Slider */}
            <motion.div variants={itemVariants} className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between items-end">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <WarningCircle size={16} className="text-orange-400" /> Fishing Penalties
                </label>
                <span className="text-lg font-mono font-bold text-orange-400">
                  Level {penalties}
                </span>
              </div>
              <input
                type="range" min="1" max="10" step="1"
                value={penalties} onChange={(e) => setPenalties(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                <span>Lax</span>
                <span>Draconian</span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="h-px bg-slate-800/50 my-2" />

            {/* Temperature Slider */}
            <motion.div variants={itemVariants} className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Thermometer size={16} /> Water Temp
                </label>
                <span className={`text-lg font-mono font-bold ${temperature > 29 ? 'text-red-400' : 'text-[#00F0FF]'}`}>
                  {temperature}°C
                </span>
              </div>
              <input
                type="range" min="24" max="34" step="0.5"
                value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
              />
            </motion.div>

            {/* pH Level Slider */}
            <motion.div variants={itemVariants} className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Drop size={16} /> Ocean pH
                </label>
                <span className={`text-lg font-mono font-bold ${phLevel < 7.9 ? 'text-red-400' : 'text-[#00F0FF]'}`}>
                  {phLevel.toFixed(1)}
                </span>
              </div>
              <input
                type="range" min="7.5" max="8.3" step="0.1"
                value={phLevel} onChange={(e) => setPhLevel(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
              />
            </motion.div>

            {/* Drone Fleet Slider */}
            <motion.div variants={itemVariants} className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <PaperPlaneTilt size={16} /> Drone Fleet
                </label>
                <span className="text-lg font-mono font-bold text-[#00F0FF]">
                  {droneCount} Units
                </span>
              </div>
              <input
                type="range" min="1" max="100" step="1"
                value={droneCount} onChange={(e) => setDroneCount(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ================= RIGHT COLUMN: 2x2 GRID ================= */}
        <motion.div variants={containerVariants} className="w-2/3 grid grid-cols-2 gap-6 overflow-y-auto scrollbar-hide pb-6">
          
          {/* Card 1: Ecological Tipping Point */}
          <motion.div variants={itemVariants} layout className={`bg-slate-900/40 backdrop-blur-lg border ${isExtinction ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'border-slate-800'} rounded-2xl p-6 flex flex-col relative overflow-hidden transition-colors duration-500`}>
            <div className="flex items-center gap-2 mb-4">
              <Heartbeat size={24} weight="duotone" className={isExtinction ? "text-red-500" : "text-[#00F0FF]"} />
              <h2 className="text-sm font-bold text-white tracking-widest uppercase">Ecological Tipping Point</h2>
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-xs text-slate-400 mb-2 uppercase tracking-widest">Marine Biomass Recovery Index</p>
              <AnimatePresence mode="wait">
                <motion.div 
                  key={biomassMessage}
                  initial={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  transition={{ duration: 0.3 }}
                  className={`text-2xl font-black tracking-tight ${biomassColor}`}
                >
                  {biomassMessage}
                </motion.div>
              </AnimatePresence>
              
              <div className="mt-8 bg-[#040A14] border border-white/5 rounded-xl p-4 flex justify-between items-center">
                <span className="text-sm text-slate-400">Keystone Species Survival (Turtles)</span>
                <motion.span 
                  layout
                  className={`text-2xl font-mono font-bold ${turtleSurvival < 50 ? 'text-red-500' : 'text-[#39FF14]'}`}
                >
                  {turtleSurvival}%
                </motion.span>
              </div>
            </div>
            
            <div className="absolute right-0 bottom-0 p-8 opacity-5 pointer-events-none">
              <Heartbeat size={150} weight="fill" />
            </div>
          </motion.div>

          {/* Card 2: Blue Economy Financial Impact */}
          <motion.div variants={itemVariants} layout className={`bg-slate-900/40 backdrop-blur-lg border ${isRevenueCrater ? 'border-red-500/50' : 'border-slate-800'} rounded-2xl p-6 flex flex-col relative overflow-hidden transition-colors duration-500 group`}>
            <div className="flex items-center gap-2 mb-4">
              <ChartLineUp size={24} weight="duotone" className={isRevenueCrater ? 'text-red-500' : 'text-emerald-400'} />
              <h2 className="text-sm font-bold text-white tracking-widest uppercase">Blue Economy Impact</h2>
            </div>

            <div className="flex-1 flex flex-col">
              <p className="text-xs text-slate-400 mb-2 uppercase tracking-widest">Protected Tourism & Fishery Rev</p>
              <div className="flex items-baseline gap-2">
                <span className={`text-5xl font-black tracking-tighter ${isRevenueCrater ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'text-white'}`}>
                  ₹<span ref={revenueRef}>{revenue}</span>
                </span>
                <span className="text-xl text-slate-500 font-medium">Crore</span>
              </div>

              <AnimatePresence>
                {isRevenueCrater && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="mt-2 text-xs font-bold text-red-500 bg-red-500/10 w-fit px-2 py-1 rounded inline-flex items-center gap-1"
                  >
                    <WarningCircle size={14} /> Critical Revenue Collapse (Bleaching)
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Glowing Line Chart */}
              <div className="flex-1 mt-6 relative h-24 w-full">
                <motion.svg layout className="w-full h-full drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <motion.path 
                    layout
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    d={revenuePath} 
                    fill="none" 
                    className={revenueChartColor}
                    strokeWidth="3" 
                    strokeLinecap="round" 
                  />
                  {/* Subtle gradient fill under line */}
                  <motion.path 
                    layout
                    d={`${revenuePath} L 100 100 L 0 100 Z`} 
                    fill="url(#revenueGrad)" 
                    className="opacity-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 }}
                  />
                  <defs>
                    <linearGradient id="revenueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={isRevenueCrater ? "red" : "#00F0FF"} />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </motion.svg>
              </div>
            </div>
          </motion.div>

          {/* Card 3: ROI & Resource Efficiency */}
          <motion.div variants={itemVariants} className="bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-2xl p-6 flex flex-col relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <CurrencyDollar size={24} weight="duotone" className="text-[#00F0FF]" />
              <h2 className="text-sm font-bold text-white tracking-widest uppercase">ROI & Efficiency</h2>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <div className="space-y-6">
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Total Intervention Cost</span>
                    <span className="text-white font-mono">₹{totalCost.toFixed(2)}Cr</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      layout
                      className="h-full bg-red-400 rounded-full" 
                      style={{ width: `${Math.min(100, (totalCost/50)*100)}%` }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Ecological Savings Generated</span>
                    <span className="text-white font-mono">₹{savings.toFixed(2)}Cr</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      layout
                      className="h-full bg-[#39FF14] rounded-full shadow-[0_0_10px_#39FF14]" 
                      style={{ width: `${Math.min(100, (savings/50)*100)}%` }} 
                    />
                  </div>
                </div>

              </div>

              <div className="mt-8 pt-6 border-t border-slate-800/50">
                <p className="text-sm text-slate-300">
                  Every <span className="font-bold text-white">₹1</span> invested yields <motion.span layout className="font-bold text-[#00F0FF] text-xl px-1">₹{roiMultiplier}</motion.span> in long-term ecological savings.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Carbon Credit Generation */}
          <motion.div variants={itemVariants} className="bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-2xl p-6 flex flex-col relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <Leaf size={24} weight="duotone" className="text-emerald-400" />
              <h2 className="text-sm font-bold text-white tracking-widest uppercase">Blue Carbon Impact</h2>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <div className="relative group cursor-pointer">
                <div ref={pulseRef} className="absolute inset-0 bg-emerald-500/30 rounded-full blur-2xl" />
                <div className="relative w-40 h-40 border-[4px] border-emerald-500/30 rounded-full flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <span className="text-4xl font-black text-emerald-400 tracking-tighter drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]">
                    <span ref={carbonRef}>{blueCarbon}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                    Megatons
                  </span>
                </div>
              </div>
              
              <p className="text-xs text-slate-400 mt-6 max-w-[250px]">
                Actively captured via protected seagrass meadows & coral restoration efforts.
              </p>
            </div>
            
            <div className="absolute left-[-10px] top-[-10px] opacity-[0.03] pointer-events-none">
              <Recycle size={250} weight="fill" />
            </div>
          </motion.div>

        </motion.div>
      </motion.div>
    </div>
  );
}
