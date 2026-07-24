"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Crosshair, Map, Maximize, X } from "lucide-react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Connect to backend WebSocket
const socket = io("http://127.0.0.1:5000");

interface ThreatPayload {
  type: string;
  message: string;
  confidence: string;
  color: string;
  coordinates: string;
  affectedSpecies: string;
}

export default function EmergencyAlerts() {
  const [threat, setThreat] = useState<ThreatPayload | null>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const handleCriticalThreat = (data: ThreatPayload) => {
      setThreat(data);
      setStep(1); // Start sequence
    };

    socket.on("critical_threat", handleCriticalThreat);
    return () => {
      socket.off("critical_threat", handleCriticalThreat);
    };
  }, []);

  // Run the 7-step sequence
  useEffect(() => {
    if (step === 0) return;

    if (step === 1) {
      // Step 1: AI detects anomaly (box appears), 300ms pause
      setTimeout(() => setStep(2), 300);
    } else if (step === 2) {
      // Step 2 & 3: Flash crimson
      setTimeout(() => setStep(4), 1000);
    } else if (step === 4) {
      // Step 4 & 5: Alert panel slides in, map zooms
      setTimeout(() => setStep(6), 2000);
    } else if (step === 6) {
      // Step 6: Background darkens, only UI illuminated
      setTimeout(() => setStep(7), 6000);
    } else if (step === 7) {
      // Step 7: System restores
      setStep(0);
      setThreat(null);
    }
  }, [step]);

  if (step === 0 || !threat) return null;

  return (
    <AnimatePresence>
      {/* Step 3: Deep crimson flash */}
      {step >= 2 && step <= 4 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.2] }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="fixed inset-0 z-50 pointer-events-none mix-blend-color-burn"
          style={{ backgroundColor: threat.color }}
        />
      )}

      {/* Step 6: Background darkens (cinema mode) */}
      {step >= 6 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[45] pointer-events-none bg-black"
        />
      )}

      {/* Step 4-7: Glass Alert Panel */}
      {step >= 4 && (
        <motion.div
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="fixed top-8 left-1/2 -translate-x-1/2 z-[60] w-[600px] max-w-[90vw]"
        >
          <div 
            className="backdrop-blur-xl border-2 rounded-2xl overflow-hidden shadow-2xl relative"
            style={{ 
              borderColor: `${threat.color}60`, 
              backgroundColor: `${threat.color}15`,
              boxShadow: `0 20px 50px -10px ${threat.color}40, inset 0 0 30px ${threat.color}20` 
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <AlertTriangle className="w-6 h-6" style={{ color: threat.color }} />
                </motion.div>
                <h2 className="text-xl font-bold tracking-widest uppercase text-white">
                  {threat.message}
                </h2>
              </div>
              <X className="w-5 h-5 text-white/50 cursor-pointer hover:text-white" onClick={() => setStep(7)} />
            </div>

            {/* Content */}
            <div className="p-6 grid grid-cols-2 gap-6 relative">
              
              {/* Data column */}
              <div className="flex flex-col gap-4 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">CONFIDENCE:</span>
                  <span className="text-white font-bold">{threat.confidence}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50">COORDINATES:</span>
                  <span className="text-cyan-glow flex items-center gap-1">
                    <Crosshair className="w-3 h-3" /> {threat.coordinates}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">AFFECTED:</span>
                  <span className="text-white">{threat.affectedSpecies}</span>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 py-2 bg-white text-black font-bold uppercase rounded text-xs hover:bg-gray-200">
                    Deploy Drone
                  </button>
                  <button className="flex-1 py-2 border border-white/20 text-white font-bold uppercase rounded text-xs hover:bg-white/10">
                    Ignore
                  </button>
                </div>
              </div>

              {/* Map/Drone Feed simulated window */}
              <div className="bg-black/60 rounded-xl border border-white/10 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-30" style={{ 
                  backgroundImage: `radial-gradient(circle at center, ${threat.color} 0%, transparent 70%)` 
                }} />
                
                {/* Crosshairs & HUD */}
                <div className="absolute inset-4 border border-white/10 border-dashed opacity-30" />
                <motion.div 
                  className="w-16 h-16 border-2 rounded-full flex items-center justify-center"
                  style={{ borderColor: threat.color }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: threat.color }} />
                </motion.div>

                <div className="absolute bottom-2 left-2 text-[9px] font-mono text-white/40">
                  SAT_LINK_ESTABLISHED
                </div>
                <Maximize className="absolute top-2 right-2 w-3 h-3 text-white/40" />
              </div>
            </div>
            
            {/* Scanning line */}
            <motion.div 
              className="absolute left-0 top-0 bottom-0 w-1 blur-sm mix-blend-screen"
              style={{ backgroundColor: threat.color }}
              animate={{ x: ["0%", "600%", "0%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
