"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Radar, Video } from "lucide-react";
import { io } from "socket.io-client";

// Modular cinematic components
import PredictiveMap from "./dashboard/PredictiveMap";
import EmergencyAlerts from "./dashboard/EmergencyAlerts";
import AccessibilityPanel from "./dashboard/AccessibilityPanel";
import IotCharts from "./dashboard/IotCharts";
import { oceanState } from "@/lib/oceanState";

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
  const [chartData, setChartData] = useState(initialIotData);
  const [logMessages, setLogMessages] = useState<{ id: number, text: string, type: "info" | "ok" | "warn" }[]>([
    { id: 1, text: "[OK] System Initialized", type: "ok" },
    { id: 2, text: "[INFO] Drone 04 battery at 82%.", type: "info" }
  ]);
  const audioCtxRef = useRef<AudioContext | null>(null);

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

  // Sonar heartbeat & data connection
  useEffect(() => {
    // 1. Sonar Heartbeat loop (every 5 seconds)
    const heartbeat = setInterval(() => {
      // Trigger DOM event
      window.dispatchEvent(new Event("trigger-sonar"));
    }, 5000);

    // 2. Listen to sonar trigger event
    const handleSonar = () => {
      playSonar();
      // Animate map ring
      const ring = document.getElementById("sonar-ring-map");
      if (ring) {
        ring.style.animation = "none";
        // trigger reflow
        void ring.offsetWidth;
        ring.style.animation = "ping 2s cubic-bezier(0, 0, 0.2, 1) forwards";
      }
    };
    window.addEventListener("trigger-sonar", handleSonar);

    // 3. IoT Data Updates from WebSocket
    const handleIotUpdate = (data: { time: string; temp: number; pollution: number }) => {
      setChartData(prev => {
        const newData = [...prev, data];
        if (newData.length > 7) newData.shift();
        return newData;
      });
      // Randomly push a log message sometimes
      if (Math.random() > 0.7) {
        setLogMessages(prev => {
          const newLogs = [{ id: Date.now(), text: `[INFO] Sensor reading updated at ${data.time}`, type: "info" as const }, ...prev];
          if (newLogs.length > 5) newLogs.pop();
          return newLogs;
        });
      }
    };
    socket.on("iot_data_update", handleIotUpdate);

    return () => {
      clearInterval(heartbeat);
      window.removeEventListener("trigger-sonar", handleSonar);
      socket.off("iot_data_update", handleIotUpdate);
    };
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto relative rounded-3xl overflow-hidden bg-[#020813] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
      
      {/* 1. Cinematic Red Alert sequence controller */}
      <EmergencyAlerts />

      {/* 2. Top Header */}
      <div className="flex justify-between items-center p-4 md:px-8 border-b border-white/10 bg-black/40 backdrop-blur-md relative z-40">
        <div className="flex items-center gap-4">
          <Radar className="w-6 h-6 text-cyan-glow animate-spin-slow" />
          <h2 className="text-xl font-bold text-white tracking-wide">COMMAND CENTER</h2>
        </div>
        
        {/* Advanced Accessibility System */}
        <AccessibilityPanel />
      </div>

      {/* 3. Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 p-4 md:p-6 h-[850px] lg:h-[750px] bg-[#020813]">
        
        {/* LEFT COLUMN: Map & Video */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          
          {/* SIMULATED AI VIDEO */}
          <div className="relative h-1/3 rounded-2xl overflow-hidden border border-white/10 bg-[#051024]">
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

          {/* PREDICTIVE RISK MAP MODULE */}
          <div className="h-2/3">
            <PredictiveMap />
          </div>
        </div>

        {/* RIGHT COLUMN: IoT Charts & Logs */}
        <div className="flex flex-col gap-4">
          
          {/* ACCESSIBLE CHARTS MODULE */}
          <div className="flex-grow flex flex-col gap-4">
             <IotCharts data={chartData} />
          </div>

          {/* Live Event Log */}
          <div className="glass-panel p-4 rounded-2xl h-48 overflow-hidden flex flex-col">
            <h3 className="text-sm font-mono text-white/80 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-glow" /> System Log
            </h3>
            <div className="flex-grow flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence>
                {logMessages.map(log => (
                  <motion.div 
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`text-xs font-mono p-2 rounded border ${
                      log.type === "info" ? "bg-cyan-glow/10 border-cyan-glow/30 text-cyan-glow" :
                      log.type === "warn" ? "bg-red-500/10 border-red-500/30 text-red-400" :
                      "bg-white/5 border-white/10 text-white/60"
                    }`}
                  >
                    {log.text}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
