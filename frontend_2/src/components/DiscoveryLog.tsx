"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, CheckCircle, ChevronRight, X } from "lucide-react";
import { oceanState } from "@/lib/oceanState";

const ALL_SPECIES = [
  { id: "Blue Tang", scientific: "Paracanthurus hepatus", habitat: "Reefs", status: "Least Concern" },
  { id: "Manta Ray", scientific: "Mobula birostris", habitat: "Open Ocean", status: "Endangered" },
  { id: "Blue Whale", scientific: "Balaenoptera musculus", habitat: "Open Ocean", status: "Endangered" },
  { id: "Sea Turtle", scientific: "Cheloniidae", habitat: "Reefs", status: "Vulnerable" },
  { id: "Giant Squid", scientific: "Architeuthis dux", habitat: "Abyss", status: "Least Concern" }
];

export default function DiscoveryLog() {
  const [isOpen, setIsOpen] = useState(false);
  const [discovered, setDiscovered] = useState<string[]>([]);
  
  useEffect(() => {
    let animationFrameId: number;
    const checkLog = () => {
      if (oceanState.discoveredSpecies.length !== discovered.length) {
        setDiscovered([...oceanState.discoveredSpecies]);
      }
      animationFrameId = requestAnimationFrame(checkLog);
    };
    checkLog();
    return () => cancelAnimationFrame(animationFrameId);
  }, [discovered.length]);

  const completion = Math.round((discovered.length / ALL_SPECIES.length) * 100);

  return (
    <div className="fixed top-24 right-4 z-[90]">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-black/50 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full hover:bg-white/10 hover:border-cyan-glow transition-all group"
      >
        <BookOpen className="w-4 h-4 text-cyan-glow group-hover:animate-pulse" />
        <span className="text-xs font-mono text-white">FIELD JOURNAL</span>
        <div className="bg-cyan-glow/20 text-cyan-glow text-[10px] px-2 py-0.5 rounded-full border border-cyan-glow/30 ml-2">
          {discovered.length} / {ALL_SPECIES.length}
        </div>
      </button>

      {/* Slide-out Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="absolute top-12 right-0 w-80 max-h-[70vh] bg-[#020a16]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-black/40 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-white tracking-widest uppercase">Discovery Log</h3>
                <div className="text-xs font-mono text-cyan-glow mt-1 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-white/10 rounded-full w-24">
                    <div className="h-full bg-cyan-glow rounded-full" style={{ width: `${completion}%` }} />
                  </div>
                  {completion}% COMPLETED
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="overflow-y-auto custom-scrollbar p-2">
              {ALL_SPECIES.map((species, i) => {
                const isUnlocked = discovered.includes(species.id);
                return (
                  <div 
                    key={species.id}
                    className={`p-3 rounded-xl mb-2 flex items-start gap-3 transition-colors ${
                      isUnlocked ? "bg-white/5 border border-white/10" : "bg-black/20 border border-transparent opacity-50 grayscale"
                    }`}
                  >
                    <div className="mt-1">
                      {isUnlocked ? <CheckCircle className="w-4 h-4 text-cyan-glow" /> : <div className="w-4 h-4 rounded-full border border-white/30" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-white">{isUnlocked ? species.id : "???"}</h4>
                      <div className="text-[10px] font-mono text-white/50 italic mb-2">
                        {isUnlocked ? species.scientific : "Unknown Species"}
                      </div>
                      
                      {isUnlocked && (
                        <div className="grid grid-cols-2 gap-1 text-[9px] font-mono">
                          <span className="text-white/40">HABITAT:</span>
                          <span className="text-white">{species.habitat}</span>
                          <span className="text-white/40">STATUS:</span>
                          <span className="text-yellow-400">{species.status}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
