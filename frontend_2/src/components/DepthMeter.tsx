"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function DepthMeter() {
  const { scrollYProgress } = useScroll();
  const [depth, setDepth] = useState(0);

  // We map 0-1 scroll progress to 0 - 1000m+ depth
  const depthValue = useTransform(scrollYProgress, [0, 1], [0, 10994]);

  useEffect(() => {
    return depthValue.on("change", (latest) => {
      setDepth(Math.floor(latest));
    });
  }, [depthValue]);

  // Fade in after passing surface
  const opacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  return (
    <motion.div 
      style={{ opacity }}
      className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-4 pointer-events-none"
    >
      <div className="text-cyan-glow font-mono text-sm rotate-180" style={{ writingMode: 'vertical-rl' }}>
        DEPTH METER
      </div>
      
      {/* Gauge Line */}
      <div className="w-[1px] h-32 bg-white/20 relative">
        <motion.div 
          className="absolute top-0 left-0 w-full bg-cyan-glow shadow-[0_0_10px_#43F7FF]"
          style={{ height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
        />
      </div>

      <div className="text-white font-mono text-xl font-bold tracking-widest">
        {depth.toLocaleString()}<span className="text-cyan-glow text-sm">m</span>
      </div>
    </motion.div>
  );
}
