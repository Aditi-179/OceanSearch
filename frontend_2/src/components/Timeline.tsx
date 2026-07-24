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

  const cardWidth = 400;
  const gap = 128; // gap-32 = 8rem = 128px
  const step = cardWidth + gap;

  // Map scroll progress to center each card: Card 0 at 0.0, Card 1 at 0.25, Card 2 at 0.50, Card 3 at 0.75, Card 4 at 1.0
  const translateX = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [0, -step, -step * 2, -step * 3, -step * 4]
  );

  // Pre-declared transforms per card to avoid rule of hooks warnings in loops
  const scale0 = useTransform(scrollYProgress, [0, 0.25], [1.1, 0.85]);
  const scale1 = useTransform(scrollYProgress, [0, 0.25, 0.5], [0.85, 1.1, 0.85]);
  const scale2 = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0.85, 1.1, 0.85]);
  const scale3 = useTransform(scrollYProgress, [0.5, 0.75, 1], [0.85, 1.1, 0.85]);
  const scale4 = useTransform(scrollYProgress, [0.75, 1], [0.85, 1.1]);

  const opacity0 = useTransform(scrollYProgress, [0, 0.25], [1, 0.3]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.25, 0.5], [0.3, 1, 0.3]);
  const opacity2 = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0.3, 1, 0.3]);
  const opacity3 = useTransform(scrollYProgress, [0.5, 0.75, 1], [0.3, 1, 0.3]);
  const opacity4 = useTransform(scrollYProgress, [0.75, 1], [0.3, 1]);

  const cardTransforms = [
    { scale: scale0, opacity: opacity0, dotScale: useTransform(scale0, [0.85, 1.1], [0.9, 1.25]) },
    { scale: scale1, opacity: opacity1, dotScale: useTransform(scale1, [0.85, 1.1], [0.9, 1.25]) },
    { scale: scale2, opacity: opacity2, dotScale: useTransform(scale2, [0.85, 1.1], [0.9, 1.25]) },
    { scale: scale3, opacity: opacity3, dotScale: useTransform(scale3, [0.85, 1.1], [0.9, 1.25]) },
    { scale: scale4, opacity: opacity4, dotScale: useTransform(scale4, [0.85, 1.1], [0.9, 1.25]) },
  ];

  return (
    <div ref={targetRef} className="h-[300vh] relative">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        
        <motion.div 
          style={{ x: translateX, paddingLeft: "calc(50vw - 200px)", paddingRight: "calc(50vw - 200px)" }} 
          className="flex gap-32 relative z-10"
        >
          {/* Horizontal Track Line — aligned with dot centers (top-3 / 12px) */}
          <div className="absolute top-3 left-[50vw] right-[50vw] h-[1px] bg-white/20 z-0" />
          
          {/* Animated Progress Line */}
          <motion.div 
            className="absolute top-3 left-[50vw] right-[50vw] h-[2px] bg-marine-green z-0 origin-left"
            style={{ 
              scaleX: scrollYProgress
            }}
          />

          {timelineEvents.map((event, index) => {
            const { scale, opacity, dotScale } = cardTransforms[index];

            return (
              <div 
                key={index} 
                className="w-[400px] flex flex-col items-center text-center relative group shrink-0"
              >
                {/* Point on timeline — scales around its own center, preserving vertical alignment */}
                <motion.div 
                  style={{ scale: dotScale }}
                  className="w-6 h-6 rounded-full bg-[#020711] border-4 border-marine-green mb-8 relative z-10 transition-transform duration-300 group-hover:scale-125 group-hover:shadow-[0_0_20px_rgba(24,255,200,0.5)]" 
                />
                
                {/* Card Content scales and fades independently */}
                <motion.div 
                  style={{ scale, opacity }} 
                  className="glass-panel p-8 rounded-2xl w-full origin-top"
                >
                  <span className="text-4xl font-light text-marine-green mb-4 block font-mono">
                    {event.year}
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-4">{event.title}</h3>
                  <p className="text-white/60 font-light leading-relaxed">{event.desc}</p>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
