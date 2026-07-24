"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const timelineEvents = [
  { year: "2024", title: "The Crisis", desc: "Ocean temperatures peak. Coral bleaching at 40% globally." },
  { year: "2026", title: "AI Deployment", desc: "First fleet of autonomous drones deployed to monitor threat zones." },
  { year: "2030", title: "Recovery Begins", desc: "Ghost nets reduced by 50%. Marine sanctuaries strictly enforced." },
  { year: "2040", title: "Coral Resurgence", desc: "Genetically resilient corals reintroduced. Reefs show massive growth." },
  { year: "2050", title: "Equilibrium", desc: "Ocean ecosystems stabilized. A triumph of human and AI collaboration." },
];

export default function Timeline() {
  const targetRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress within this specific section
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Map vertical scroll progress to horizontal translation
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-70%"]);

  return (
    <div ref={targetRef} className="h-[300vh] relative">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        
        {/* Timeline Line */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 z-0" />
        
        {/* Animated Progress Line */}
        <motion.div 
          className="absolute top-1/2 left-0 h-[2px] bg-marine-green z-0"
          style={{ width: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
        />

        <motion.div style={{ x }} className="flex gap-32 px-[30vw] relative z-10">
          {timelineEvents.map((event, index) => (
            <div key={index} className="w-[400px] flex flex-col items-center text-center relative group">
              {/* Point on timeline */}
              <div className="w-6 h-6 rounded-full bg-background border-4 border-marine-green mb-8 relative z-10 transition-transform duration-300 group-hover:scale-150 group-hover:shadow-[0_0_20px_rgba(24,255,200,0.5)]" />
              
              <div className="glass-panel p-8 rounded-2xl">
                <span className="text-4xl font-light text-marine-green mb-4 block font-mono">
                  {event.year}
                </span>
                <h3 className="text-2xl font-bold text-white mb-4">{event.title}</h3>
                <p className="text-white/60 font-light leading-relaxed">{event.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
