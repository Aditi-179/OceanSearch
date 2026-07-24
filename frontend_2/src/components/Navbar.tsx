"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Droplet } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  // Transform depth based on scroll, max depth around 10000m for abyss
  const depth = useTransform(scrollY, [0, 5000], [0, 10994]); 
  
  return (
    <motion.nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "py-4" : "py-8"
      )}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-cyan-glow/20 border border-cyan-glow/50 text-cyan-glow">
            <Droplet className="w-5 h-5 fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            DeepSea<span className="font-light text-cyan-glow">Guardian</span>
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 glass-panel px-8 py-3 rounded-full">
          <NavLink href="#mission">Mission</NavLink>
          <NavLink href="#threats">Threats</NavLink>
          <NavLink href="#ai-system">AI System</NavLink>
          <NavLink href="#take-action">Take Action</NavLink>
        </div>

        {/* Depth Indicator */}
        <div className="hidden md:flex flex-col items-end">
          <span className="text-xs text-white/50 uppercase tracking-widest font-mono">Current Depth</span>
          <motion.div className="text-lg font-mono text-cyan-glow font-bold flex items-center">
            {/* Custom component to animate the number formatting */}
            <NumberCounter value={depth} />m
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-sm text-white/70 hover:text-white transition-colors relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-cyan-glow transition-all duration-300 group-hover:w-full" />
    </a>
  );
}

function NumberCounter({ value }: { value: any }) {
  const [num, setNum] = useState(0);

  useEffect(() => {
    return value.on("change", (latest: number) => {
      setNum(Math.floor(latest));
    });
  }, [value]);

  return <span>{num.toLocaleString()}</span>;
}
