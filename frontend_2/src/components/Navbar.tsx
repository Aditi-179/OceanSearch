"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Droplet } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
  
  // Compute depth zone label
  const [zone, setZone] = useState("Surface");
  
  useEffect(() => {
    return scrollY.on("change", (latest) => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = latest / (maxScroll || 1);
      if (progress < 0.12) setZone("Surface · 0m");
      else if (progress < 0.28) setZone("Shallow Reef · 50m");
      else if (progress < 0.45) setZone("Coral Forest · 150m");
      else if (progress < 0.60) setZone("Twilight Zone · 400m");
      else if (progress < 0.75) setZone("Midnight Zone · 700m");
      else if (progress < 0.90) setZone("Abyss · 1000m");
      else setZone("Hadal Zone · 10,000m");
    });
  }, [scrollY]);

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
            {/* Bio-scan pulse — grows stronger at depth */}
            <div className="absolute inset-0 rounded-full border border-cyan-glow/40 animate-ping" style={{ animationDuration: '2.5s' }} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Ocean<span className="font-light text-cyan-glow">Search</span>
          </span>
        </div>

        {/* Desktop Links (Now App Router Links) */}
        <div className="hidden md:flex items-center gap-4 glass-panel px-6 py-2 rounded-full">
          <Link href="/" className="text-sm font-medium hover:text-white/70 transition-colors">
            Public Portal
          </Link>
          <Link href="/research" className="text-sm font-medium text-cyan-glow hover:text-cyan-400 transition-colors">
            Research Dashboard
          </Link>
        </div>

        {/* Depth HUD */}
        <div className="hidden md:flex flex-col items-end gap-1">
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">{zone}</span>
          <motion.div className="text-lg font-mono text-cyan-glow font-bold flex items-center gap-1">
            <NumberCounter value={depth} />
            <span className="text-xs text-cyan-glow/70">m</span>
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
