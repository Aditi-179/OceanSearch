"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { oceanState } from "@/lib/oceanState";

export default function LegendaryEncounters() {
  const [event, setEvent] = useState<string | null>(null);

  useEffect(() => {
    // Randomized legendary encounters
    const interval = setInterval(() => {
      // Very rare (5% chance every 20 seconds, but we speed it up here for demonstration)
      if (Math.random() > 0.95 && !oceanState.legendaryEvent) {
        const events = ["blue_whale", "giant_squid", "bioluminescent_bloom"];
        const trigger = events[Math.floor(Math.random() * events.length)];
        
        oceanState.legendaryEvent = trigger;
        setEvent(trigger);

        // Auto restore after 15 seconds
        setTimeout(() => {
          oceanState.legendaryEvent = null;
          setEvent(null);
        }, 15000);
      }
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {event && (
        <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center">
          
          {/* Cinematic Letterboxing */}
          <motion.div 
            initial={{ height: 0 }} 
            animate={{ height: "10vh" }} 
            exit={{ height: 0 }} 
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full bg-black/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ height: 0 }} 
            animate={{ height: "10vh" }} 
            exit={{ height: 0 }} 
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 w-full bg-black/80 backdrop-blur-sm"
          />

          {/* Environmental Darkening */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3 }}
            className="absolute inset-0 bg-black mix-blend-multiply"
          />

          {/* Event Specific Overlays */}
          {event === "blue_whale" && (
            <motion.div 
              initial={{ x: "100vw", opacity: 0 }}
              animate={{ x: "-100vw", opacity: 0.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 15, ease: "linear" }}
              className="absolute text-white/10 blur-md pointer-events-none"
            >
              <svg viewBox="0 0 800 300" className="w-[120vw] h-auto fill-current">
                {/* Abstract Whale Shape */}
                <path d="M 750,150 C 600,100 400,120 200,150 C 100,165 50,180 10,200 C 50,190 100,185 200,180 C 400,170 600,180 750,200 C 780,180 780,160 750,150 Z" />
                <path d="M 250,160 C 220,180 200,220 180,250 C 200,230 220,200 250,180 Z" />
              </svg>
            </motion.div>
          )}

          {event === "giant_squid" && (
            <motion.div 
              initial={{ y: "50vh", opacity: 0 }}
              animate={{ y: "-10vh", opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 10, ease: "easeOut" }}
              className="absolute text-cyan-glow/20 blur-lg pointer-events-none"
            >
               <svg viewBox="0 0 400 800" className="w-[40vw] h-auto fill-current">
                  <ellipse cx="200" cy="200" rx="60" ry="150" />
                  <path d="M 180,340 C 150,500 100,700 50,800 C 120,700 160,500 190,350 Z" />
                  <path d="M 220,340 C 250,500 300,700 350,800 C 280,700 240,500 210,350 Z" />
               </svg>
            </motion.div>
          )}

          {/* Cinematic Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, letterSpacing: "0px" }}
            animate={{ opacity: 1, scale: 1, letterSpacing: "10px" }}
            exit={{ opacity: 0, scale: 1.1, letterSpacing: "20px" }}
            transition={{ duration: 4, ease: "easeOut", delay: 1 }}
            className="absolute z-50 text-center"
          >
            <h2 className="text-4xl md:text-6xl font-light text-white uppercase drop-shadow-2xl mix-blend-screen">
              {event.replace('_', ' ')}
            </h2>
            <p className="text-sm font-mono text-cyan-glow mt-4 tracking-[0.2em]">Legendary Encounter</p>
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}
