"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

export default function FeatureCard({ title, description, icon, delay = 0 }: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group w-full h-full rounded-2xl p-[1px] overflow-hidden"
    >
      {/* Animated Border Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Border Glow on Hover */}
      <motion.div 
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 bg-gradient-to-tr from-cyan-glow/50 via-transparent to-marine-green/50 opacity-0 transition-opacity duration-500 blur-sm" 
      />

      {/* Card Content (Glass panel) */}
      <div className="relative h-full flex flex-col bg-[#00192E]/40 backdrop-blur-xl rounded-[15px] p-8 transition-transform duration-500 ease-out group-hover:-translate-y-2">
        {/* Glow behind icon */}
        <div className="absolute top-8 left-8 w-12 h-12 bg-cyan-glow/20 rounded-full blur-xl transition-all duration-500 group-hover:bg-cyan-glow/40 group-hover:scale-150" />
        
        <div className="w-12 h-12 text-cyan-glow mb-6 relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
          {icon}
        </div>
        
        <h3 className="text-2xl font-semibold text-white mb-4 transition-colors group-hover:text-cyan-glow">
          {title}
        </h3>
        
        <p className="text-white/60 leading-relaxed font-light flex-grow group-hover:text-white/80 transition-colors">
          {description}
        </p>

        {/* SVG Line Drawing animation at the bottom */}
        <div className="mt-8 relative h-[2px] w-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: isHovered ? "0%" : "-100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-cyan-glow to-marine-green"
          />
        </div>
      </div>
    </motion.div>
  );
}
