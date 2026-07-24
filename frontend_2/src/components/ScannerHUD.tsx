"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { oceanState } from "@/lib/oceanState";
import { Scan } from "lucide-react";

export default function ScannerHUD() {
  const [target, setTarget] = useState<any | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    const checkTarget = () => {
      // Sync with global oceanState (which is updated rapidly in useFrame)
      if (oceanState.scanTarget !== target) {
        setTarget(oceanState.scanTarget);
      }
      animationFrameId = requestAnimationFrame(checkTarget);
    };
    checkTarget();

    return () => cancelAnimationFrame(animationFrameId);
  }, [target]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      <AnimatePresence>
        {target && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute flex flex-col"
            style={{ 
              left: `${target.screenPos.x}px`, 
              top: `${target.screenPos.y}px`,
              transform: "translate(-50%, -50%)"
            }}
          >
            {/* Bounding Box */}
            <div className="relative w-32 h-32">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-glow" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-glow" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-glow" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-glow" />
              <Scan className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-cyan-glow/50 animate-pulse" />
            </div>

            {/* AI Data Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute left-[110%] top-0 w-48 bg-black/60 backdrop-blur-md border border-cyan-glow/30 p-3 rounded-lg shadow-[0_0_20px_rgba(67,247,255,0.2)]"
            >
              <div className="text-[10px] text-cyan-glow font-mono uppercase tracking-widest mb-1 animate-pulse">Scanning...</div>
              <h3 className="text-sm font-bold text-white leading-tight">{target.name}</h3>
              <div className="text-xs italic text-white/50 mb-2">{target.scientificName}</div>
              
              <div className="grid grid-cols-2 gap-y-1 text-[9px] font-mono mt-2">
                <span className="text-white/40">CONFIDENCE</span>
                <span className="text-green-400 text-right">{target.confidence}%</span>
                
                <span className="text-white/40">STATUS</span>
                <span className="text-yellow-400 text-right">{target.status}</span>
                
                <span className="text-white/40">POPULATION</span>
                <span className="text-red-400 text-right">{target.population}</span>
                
                <span className="text-white/40">DEPTH</span>
                <span className="text-white text-right">{target.depth}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
