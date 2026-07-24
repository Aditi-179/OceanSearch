"use client";

import { motion } from "framer-motion";
import OceanCanvas from "./canvas/OceanCanvas";
import { ArrowDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full h-[120vh] flex flex-col items-center justify-center overflow-hidden">
      <OceanCanvas />
      
      <div className="container relative z-10 px-6 mx-auto flex flex-col items-center text-center -mt-20">
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

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7, ease: "easeOut" }}
          className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white mb-6 leading-[0.9]"
        >
          Protect What We <br className="hidden md:block" />
          <span className="text-glow text-cyan-glow italic pr-4">Can't See.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, ease: "easeOut" }}
          className="max-w-2xl text-lg md:text-xl text-white/60 font-light mb-12 leading-relaxed"
        >
          Dive into the world's most advanced AI-powered ocean conservation platform. 
          Real-time threat detection, marine life tracking, and global restoration efforts.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <button className="px-8 py-4 rounded-full bg-cyan-glow text-background font-bold tracking-wide hover:shadow-[0_0_30px_rgba(67,247,255,0.4)] transition-all duration-300 hover:scale-105">
            Begin the Dive
          </button>
          <button className="px-8 py-4 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
            View Live Data
          </button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-xs uppercase tracking-[0.3em] text-white/40">Scroll to Dive</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ArrowDown className="w-5 h-5 text-cyan-glow/70" />
        </motion.div>
      </motion.div>
    </section>
  );
}
