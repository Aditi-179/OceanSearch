"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Activity, Crosshair, Radar, AlertTriangle, Eye, Video, ThermometerSun, Trash2 } from "lucide-react";
import { io } from "socket.io-client";

// Connect to backend WebSocket
const socket = io("http://127.0.0.1:5000");

// --- INITIAL DUMMY DATA FOR CHARTS ---
const initialIotData = [
  { time: "00:00", temp: 15.2, pollution: 40 },
  { time: "04:00", temp: 15.4, pollution: 45 },
  { time: "08:00", temp: 16.1, pollution: 75 },
  { time: "12:00", temp: 16.5, pollution: 90 },
  { time: "16:00", temp: 16.2, pollution: 65 },
  { time: "20:00", temp: 15.8, pollution: 55 },
];

export default function Dashboard() {
  const [colorblind, setColorblind] = useState(false);
  const [redAlert, setRedAlert] = useState(false);
  const [threatMessage, setThreatMessage] = useState("CRITICAL THREAT DETECTED");
  const [threatConfidence, setThreatConfidence] = useState("99%");
  const [timeline, setTimeline] = useState(0); // 0 to 100
  const [chartData, setChartData] = useState(initialIotData);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Colors
  const dangerColor = colorblind ? "#FFC107" : "#FF5F6D"; // Yellow vs Red
  const safeColor = colorblind ? "#0055FF" : "#43F7FF";   // Blue vs Cyan
  
  // Play sonar ping
  const playSonar = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 1);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.5);
  };

  // Connect to Socket.io for Real-time Data
  useEffect(() => {
    // IoT Data Updates
    const handleIotUpdate = (data: { time: string; temp: number; pollution: number }) => {
      setChartData(prev => {
        const newData = [...prev, data];
        if (newData.length > 7) newData.shift(); // Keep only last 7 points
        return newData;
      });
    };

    // Critical Threats
    const handleCriticalThreat = (data: { message: string; confidence: string }) => {
      setThreatMessage(data.message);
      setThreatConfidence(data.confidence);
      setRedAlert(true);
      playSonar(); // Play ping sound automatically
      setTimeout(() => setRedAlert(false), 3000); // clear after 3 seconds
    };

    socket.on("iot_data_update", handleIotUpdate);
    socket.on("critical_threat", handleCriticalThreat);

    return () => {
      socket.off("iot_data_update", handleIotUpdate);
      socket.off("critical_threat", handleCriticalThreat);
    };
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto relative rounded-3xl overflow-hidden bg-[#020813] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
      
      {/* Contextual Red Alert Overlay */}
      <AnimatePresence>
        {redAlert && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 pointer-events-none"
            style={{ 
              background: `radial-gradient(circle, transparent 40%, ${dangerColor}40 100%)`,
              boxShadow: `inset 0 0 100px ${dangerColor}80` 
            }}
          >
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#020813] border border-current px-6 py-2 rounded-full flex flex-col items-center gap-1" style={{ color: dangerColor }}>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
                <span className="font-bold tracking-widest uppercase">{threatMessage}</span>
              </div>
              <span className="text-xs font-mono opacity-80">CONFIDENCE: {threatConfidence}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <div className="flex justify-between items-center p-4 md:px-8 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Radar className="w-6 h-6 text-cyan-glow animate-spin-slow" />
          <h2 className="text-xl font-bold text-white tracking-wide">COMMAND CENTER</h2>
        </div>
        
        <button 
          onClick={() => setColorblind(!colorblind)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-mono transition-colors ${
            colorblind ? "bg-white/10 border-white text-white" : "border-white/20 text-white/60 hover:text-white"
          }`}
        >
          <Eye className="w-4 h-4" />
          Colorblind Safe
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 p-4 md:p-6 h-[800px] lg:h-[700px] bg-[#020813]">
        
        {/* LEFT COLUMN: Video & Map */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          
          {/* SIMULATED AI VIDEO */}
          <div className="relative h-1/2 rounded-2xl overflow-hidden border border-white/10 bg-[#051024]">
            {/* Fake Video Background */}
            <div className="absolute inset-0 opacity-40 mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle at center, #0a2540 0%, #020813 100%)' }} />
            
            {/* UI Overlay */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-black/60 rounded text-xs font-mono text-cyan-glow border border-cyan-glow/30">
              <Video className="w-3 h-3" /> DRONE CAM 04 - LIVE
            </div>
            
            {/* Animated CSS Bounding Boxes */}
            <motion.div 
              className="absolute border-2 border-red-500 bg-red-500/10 rounded pointer-events-none"
              animate={{
                x: ["10%", "60%", "40%"],
                y: ["20%", "50%", "30%"],
                width: ["80px", "120px", "90px"],
                height: ["80px", "90px", "70px"]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute -top-6 left-[-2px] bg-red-500 text-white text-[10px] font-mono px-2 py-0.5 rounded-t">
                GHOST NET: 98%
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute border-2 border-cyan-glow bg-cyan-glow/10 rounded pointer-events-none"
              animate={{
                x: ["70%", "20%", "80%"],
                y: ["60%", "10%", "50%"],
                width: ["60px", "70px", "50px"],
                height: ["40px", "50px", "40px"]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute -top-6 left-[-2px] bg-cyan-glow text-black text-[10px] font-mono px-2 py-0.5 rounded-t">
                MARINE LIFE: 95%
              </div>
            </motion.div>
            
            <div className="absolute bottom-4 right-4 flex gap-2">
               <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
               <span className="text-xs font-mono text-white/50">REC</span>
            </div>
          </div>

          {/* PREDICTIVE RISK MAP */}
          <div className="relative h-1/2 rounded-2xl overflow-hidden border border-white/10 bg-[#020a16] flex flex-col">
            {/* Map Area */}
            <div className="relative flex-grow overflow-hidden" onClick={playSonar}>
              {/* Dummy Map Outline (CSS styled grid + radial gradient) */}
              <div className="absolute inset-0 opacity-20" style={{ 
                backgroundImage: 'linear-gradient(rgba(67, 247, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(67, 247, 255, 0.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px' 
              }} />
              
              {/* Sonar Ping Ring */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-cyan-glow/50 rounded-full animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />

              {/* Dynamic Heatmap dots based on timeline */}
              <div 
                className="absolute w-24 h-24 rounded-full blur-2xl transition-all duration-1000" 
                style={{ 
                  background: dangerColor, 
                  top: '30%', left: '40%',
                  opacity: 0.3 + (timeline / 100) * 0.5,
                  transform: `scale(${1 + (timeline / 100)})`
                }} 
              />
              <div 
                className="absolute w-32 h-32 rounded-full blur-2xl transition-all duration-1000" 
                style={{ 
                  background: dangerColor, 
                  bottom: '20%', right: '20%',
                  opacity: 0.2 + (timeline / 100) * 0.6,
                  transform: `scale(${1 + (timeline / 100) * 1.5})`
                }} 
              />
              
              <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded text-xs font-mono text-white border border-white/10">
                LIVE RISK MAP
              </div>
              <div className="absolute top-4 right-4 text-xs font-mono text-white/50">
                Click map to ping sonar
              </div>
            </div>

            {/* Predictive Slider */}
            <div className="h-16 bg-black/40 border-t border-white/10 px-6 flex items-center gap-4">
              <span className="text-xs font-mono text-white/60">NOW</span>
              <input 
                type="range" 
                min="0" max="100" 
                value={timeline} 
                onChange={(e) => setTimeline(Number(e.target.value))}
                className="flex-grow h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: dangerColor }}
              />
              <span className="text-xs font-mono text-white/60">+72 HRS</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: IoT Charts & Logs */}
        <div className="flex flex-col gap-4">
          
          {/* Chart 1: Pollution */}
          <div className="glass-panel p-4 rounded-2xl flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-mono text-white/80 flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-cyan-glow" /> Plastic Density
              </h3>
              <span className="text-xs text-white/40">kg/km³</span>
            </div>
            <div className="flex-grow">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="time" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#020813', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="pollution" fill={dangerColor} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Temperature */}
          <div className="glass-panel p-4 rounded-2xl flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-mono text-white/80 flex items-center gap-2">
                <ThermometerSun className="w-4 h-4 text-cyan-glow" /> Water Temp
              </h3>
              <span className="text-xs text-white/40">°C</span>
            </div>
            <div className="flex-grow">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={safeColor} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={safeColor} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020813', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                  <Area type="monotone" dataKey="temp" stroke={safeColor} fillOpacity={1} fill="url(#colorTemp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Live Event Log */}
          <div className="glass-panel p-4 rounded-2xl flex-1 overflow-hidden flex flex-col">
            <h3 className="text-sm font-mono text-white/80 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-glow" /> System Log
            </h3>
            <div className="flex-grow flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
              {redAlert && (
                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-xs font-mono p-2 rounded bg-red-500/10 border border-red-500/30 text-red-400">
                  {threatMessage}
                </motion.div>
              )}
              <div className="text-xs font-mono p-2 rounded bg-white/5 border border-white/10 text-white/60">
                [OK] Sonar sweep completed. No anomalies.
              </div>
              <div className="text-xs font-mono p-2 rounded bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow">
                [INFO] Drone 04 battery at 82%. Returning to base path.
              </div>
              <div className="text-xs font-mono p-2 rounded bg-white/5 border border-white/10 text-white/60">
                [OK] Water temp stable at 15.8°C.
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
