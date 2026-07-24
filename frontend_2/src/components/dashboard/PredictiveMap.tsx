"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Info, Play, Pause } from "lucide-react";
import { oceanState } from "@/lib/oceanState";

export default function PredictiveMap() {
  const [timeline, setTimeline] = useState(2025);
  const [scenario, setScenario] = useState("current");
  const [playing, setPlaying] = useState(false);
  const [hoveredCluster, setHoveredCluster] = useState<number | null>(null);

  // Sync with global oceanState
  useEffect(() => {
    oceanState.timelineYear = timeline;
    oceanState.scenario = scenario;
  }, [timeline, scenario]);

  // Autoplay functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playing) {
      interval = setInterval(() => {
        setTimeline((prev) => (prev >= 2050 ? 2025 : prev + 1));
      }, 300);
    }
    return () => clearInterval(interval);
  }, [playing]);

  const triggerSonar = () => {
    window.dispatchEvent(new Event("trigger-sonar"));
  };

  // Calculate pollution intensity based on timeline & scenario
  const getIntensity = (base: number) => {
    const progress = (timeline - 2025) / 25; // 0 to 1
    
    if (scenario === "optimistic") return Math.max(0, base - progress * 0.5);
    if (scenario === "cleanup") return Math.max(0, base - progress * 1.2);
    if (scenario === "worst_case") return Math.min(1, base + progress * 0.8);
    return Math.min(1, base + progress * 0.4); // current
  };

  const getHeatColor = (intensity: number) => {
    if (intensity < 0.2) return "#0055FF"; // Healthy Blue
    if (intensity < 0.4) return "#00FF66"; // Low Risk Green
    if (intensity < 0.6) return "#FFCC00"; // Moderate Yellow
    if (intensity < 0.8) return "#FF6600"; // High Orange
    if (intensity < 0.95) return "#FF0000"; // Critical Red
    return "#8B0000"; // Ecological Collapse Crimson
  };

  // Simulated pollution clusters
  const clusters = [
    { id: 1, x: 30, y: 40, baseIntensity: 0.3, label: "Great Pacific Patch" },
    { id: 2, x: 70, y: 60, baseIntensity: 0.1, label: "Indian Ocean Gyre" },
    { id: 3, x: 45, y: 75, baseIntensity: 0.5, label: "Coastal Dead Zone" }
  ];

  return (
    <div className="relative w-full h-full flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-[#020a16] shadow-[0_0_30px_rgba(0,100,255,0.1)] group">
      
      {/* 3D Mapbox Hologram (CSS Simulation) */}
      <div 
        className="relative flex-grow overflow-hidden cursor-crosshair transition-transform duration-700 ease-out"
        onClick={triggerSonar}
        style={{ transform: hoveredCluster !== null ? 'scale(1.02)' : 'scale(1)' }}
      >
        {/* Holographic grid and vignette */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ 
          backgroundImage: 'linear-gradient(rgba(67, 247, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(67, 247, 255, 0.15) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          transform: 'perspective(1000px) rotateX(20deg) scale(1.2)'
        }} />
        <div className="absolute inset-0 shadow-[inset_0_0_100px_#020a16] pointer-events-none" />

        {/* Sonar pulse animation */}
        <div id="sonar-ring-map" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full aspect-square border-2 border-cyan-glow/50 rounded-full opacity-0 pointer-events-none" />

        {/* AI Scanning Lines */}
        <motion.div 
          className="absolute inset-0 h-[2px] bg-cyan-glow/20 blur-sm pointer-events-none"
          animate={{ top: ["-10%", "110%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        {/* Heatmaps */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            </filter>
            <filter id="waterRipple">
              <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" result="noise">
                <animate attributeName="baseFrequency" values="0.015;0.02;0.015" dur="10s" repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          <g filter="url(#goo) url(#waterRipple)">
            {clusters.map((cluster) => {
              const intensity = getIntensity(cluster.baseIntensity);
              const color = getHeatColor(intensity);
              const size = 30 + intensity * 60;

              return (
                <motion.circle
                  key={cluster.id}
                  cx={`${cluster.x}%`}
                  cy={`${cluster.y}%`}
                  r={size}
                  fill={color}
                  opacity={0.4 + intensity * 0.4}
                  animate={{ 
                    r: [size, size * 1.1, size], 
                    cx: [`${cluster.x}%`, `${cluster.x + (Math.random()-0.5)*2}%`, `${cluster.x}%`],
                    cy: [`${cluster.y}%`, `${cluster.y + (Math.random()-0.5)*2}%`, `${cluster.y}%`] 
                  }}
                  transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, ease: "easeInOut" }}
                  onMouseEnter={() => setHoveredCluster(cluster.id)}
                  onMouseLeave={() => setHoveredCluster(null)}
                  className="cursor-pointer"
                />
              );
            })}
          </g>
        </svg>

        {/* Hover Popups */}
        <AnimatePresence>
          {hoveredCluster !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute pointer-events-none bg-black/80 backdrop-blur-md border border-cyan-glow/40 p-4 rounded-xl shadow-2xl z-20"
              style={{
                left: `${clusters.find(c => c.id === hoveredCluster)?.x}%`,
                top: `${clusters.find(c => c.id === hoveredCluster)?.y}%`,
                transform: "translate(-50%, -120%)"
              }}
            >
              <h4 className="text-sm font-bold text-white mb-2">{clusters.find(c => c.id === hoveredCluster)?.label}</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono">
                <span className="text-white/50">Plastics:</span>
                <span className="text-red-400">{(getIntensity(clusters.find(c => c.id === hoveredCluster)!.baseIntensity) * 100).toFixed(1)}M Tons</span>
                <span className="text-white/50">Confidence:</span>
                <span className="text-cyan-glow">98.4%</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="bg-black/60 backdrop-blur px-3 py-1 rounded text-xs font-mono text-cyan-glow border border-cyan-glow/30">
            PREDICTIVE AI CORE
          </div>
        </div>
      </div>

      {/* Advanced Controls & Timeline Slider */}
      <div className="bg-[#020813]/90 backdrop-blur-xl border-t border-white/10 p-4 flex flex-col gap-4">
        
        {/* Scenarios */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {[
              { id: "current", label: "Business as Usual" },
              { id: "worst_case", label: "Worst Case" },
              { id: "optimistic", label: "Optimistic" },
              { id: "cleanup", label: "Cleanup Init." }
            ].map(scen => (
              <button
                key={scen.id}
                onClick={() => setScenario(scen.id)}
                className={`text-[10px] font-mono uppercase px-3 py-1 rounded border transition-colors ${
                  scenario === scen.id ? "bg-cyan-glow/20 border-cyan-glow text-cyan-glow" : "border-white/10 text-white/50 hover:text-white"
                }`}
              >
                {scen.label}
              </button>
            ))}
          </div>
          
          <div className="text-2xl font-black text-white font-mono tracking-tighter w-20 text-right">
            {timeline}
          </div>
        </div>

        {/* Timeline Slider */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setPlaying(!playing)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow hover:bg-cyan-glow/30 transition-colors"
          >
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          
          <div className="flex-grow relative flex items-center">
            {/* Timeline markers */}
            <div className="absolute w-full flex justify-between px-1 -bottom-4 text-[9px] font-mono text-white/30 pointer-events-none">
              <span>2025</span>
              <span>2030</span>
              <span>2035</span>
              <span>2040</span>
              <span>2045</span>
              <span>2050</span>
            </div>
            
            <input 
              type="range" 
              min="2025" max="2050" 
              value={timeline} 
              onChange={(e) => {
                setTimeline(Number(e.target.value));
                setPlaying(false);
              }}
              className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-cyan-glow [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_#43F7FF]"
              style={{
                background: `linear-gradient(to right, #43F7FF ${((timeline - 2025) / 25) * 100}%, rgba(255,255,255,0.1) ${((timeline - 2025) / 25) * 100}%)`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
