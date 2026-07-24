"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Eye, Settings2, Check } from "lucide-react";
import { useState } from "react";
import { oceanState } from "@/lib/oceanState";

export default function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState(oceanState.accessibilityMode);

  const modes = [
    { id: "standard", label: "Standard RGB", desc: "Default visualization mode." },
    { id: "protanopia", label: "Protanopia (Red-Blind)", desc: "Uses Blue/Yellow spectrum with wave patterns." },
    { id: "deuteranopia", label: "Deuteranopia (Green-Blind)", desc: "Uses Blue/Red spectrum with hatch patterns." },
    { id: "tritanopia", label: "Tritanopia (Blue-Blind)", desc: "Uses Cyan/Red spectrum with dot patterns." },
    { id: "high_contrast", label: "High Contrast", desc: "Maximum visibility solid colors and thick lines." },
    { id: "monochrome", label: "Monochrome Scientific", desc: "Greyscale intensity mapping for print/scientific use." },
  ];

  const handleSelect = (mode: string) => {
    setActiveMode(mode);
    oceanState.accessibilityMode = mode;
    // Dispatch event to force re-render in Dashboard charts
    window.dispatchEvent(new Event("accessibility-change"));
  };

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-mono transition-colors ${
          isOpen || activeMode !== "standard" ? "bg-cyan-glow/20 border-cyan-glow text-white" : "border-white/20 text-white/60 hover:text-white"
        }`}
      >
        <Eye className="w-4 h-4" />
        Accessibility
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-80 bg-[#020a16]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 bg-black/40 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-cyan-glow" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Vision Adaptation</h3>
            </div>
            
            <div className="p-2 max-h-[300px] overflow-y-auto custom-scrollbar">
              {modes.map(mode => (
                <button
                  key={mode.id}
                  onClick={() => handleSelect(mode.id)}
                  className={`w-full text-left p-3 rounded-lg mb-1 flex items-start gap-3 transition-colors ${
                    activeMode === mode.id ? "bg-white/10" : "hover:bg-white/5"
                  }`}
                >
                  <div className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center ${
                    activeMode === mode.id ? "border-cyan-glow bg-cyan-glow/20 text-cyan-glow" : "border-white/20"
                  }`}>
                    {activeMode === mode.id && <Check className="w-3 h-3" />}
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${activeMode === mode.id ? "text-cyan-glow" : "text-white"}`}>
                      {mode.label}
                    </div>
                    <div className="text-[10px] font-mono text-white/50 leading-relaxed mt-1">
                      {mode.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
