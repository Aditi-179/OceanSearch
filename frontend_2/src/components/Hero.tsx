"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative w-full h-[120vh] flex flex-col items-center justify-center overflow-hidden">
      
      {/* SVG Water Ripple Filter */}
      <svg className="hidden">
        <filter id="waterRipple">
          <feTurbulence type="fractalNoise" baseFrequency="0.01 0.05" numOctaves="2" result="noise">
            <animate attributeName="baseFrequency" values="0.01 0.05; 0.01 0.1; 0.01 0.05" dur="10s" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <motion.div 
        style={{ y, opacity }}
        className="container relative z-10 px-6 mx-auto flex flex-col items-center text-center -mt-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-glow/30 bg-cyan-glow/5 backdrop-blur-md mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse" />
          <span className="text-sm font-medium tracking-wide text-cyan-glow/90 uppercase">
            DeepSea AI Initiative
          </span>
        </motion.div>

        {/* Applying SVG filter to the title for water distortion effect */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7, ease: "easeOut" }}
          className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white mb-6 leading-[0.9]"
          style={{ filter: 'url(#waterRipple)' }}
        >
          Protect What We <br className="hidden md:block" />
          <span className="text-glow text-cyan-glow italic pr-4">Can't See.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, ease: "easeOut" }}
          className="max-w-2xl text-lg md:text-xl text-white/80 font-light mb-12 leading-relaxed"
        >
          Dive into the world's most advanced AI-powered ocean conservation platform. 
          Real-time threat detection, marine life tracking, and global restoration efforts.
        </motion.p>
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-xs uppercase tracking-[0.3em] text-white/60 font-bold">Scroll to Dive</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ArrowDown className="w-6 h-6 text-cyan-glow" />
        </motion.div>
      </motion.div>
    </section>
  );
}
