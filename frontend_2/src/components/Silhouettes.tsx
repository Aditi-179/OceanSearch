"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function Silhouettes() {
  const { scrollYProgress } = useScroll();

  // Manta Ray in the shallows
  const mantaX = useTransform(scrollYProgress, [0.1, 0.3], ["-100%", "200vw"]);
  const mantaY = useTransform(scrollYProgress, [0.1, 0.3], ["20vh", "60vh"]);
  const mantaScale = useTransform(scrollYProgress, [0.1, 0.2, 0.3], [0.5, 1, 0.5]);
  const mantaOpacity = useTransform(scrollYProgress, [0.1, 0.2, 0.3], [0, 0.3, 0]);

  // Giant Whale passing in the abyss
  const whaleX = useTransform(scrollYProgress, [0.7, 0.9], ["150vw", "-100%"]);
  const whaleY = useTransform(scrollYProgress, [0.7, 0.9], ["60vh", "40vh"]);
  const whaleOpacity = useTransform(scrollYProgress, [0.7, 0.8, 0.9], [0, 0.15, 0]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      
      {/* Manta Ray Silhouette */}
      <motion.div
        style={{ x: mantaX, y: mantaY, scale: mantaScale, opacity: mantaOpacity }}
        className="absolute top-0 left-0 w-[400px] h-[200px] blur-sm mix-blend-overlay"
      >
        <svg viewBox="0 0 100 50" className="w-full h-full fill-black">
          <path d="M50 25 C60 20, 80 10, 95 25 C80 40, 60 30, 50 25 M50 25 C40 20, 20 10, 5 25 C20 40, 40 30, 50 25 M45 25 L50 45 L55 25 Z" />
        </svg>
      </motion.div>

      {/* Whale Silhouette */}
      <motion.div
        style={{ x: whaleX, y: whaleY, opacity: whaleOpacity }}
        className="absolute top-0 left-0 w-[1200px] h-[400px] blur-xl mix-blend-multiply"
      >
        <svg viewBox="0 0 200 60" className="w-full h-full fill-black">
          <path d="M10 30 C30 10, 100 5, 150 20 C180 30, 195 20, 195 20 C195 40, 180 50, 150 40 C100 55, 30 50, 10 30 M150 20 L180 10 L195 20 M150 40 L170 50 L190 40" />
        </svg>
      </motion.div>

    </div>
  );
}
