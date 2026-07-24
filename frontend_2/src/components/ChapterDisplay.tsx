"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { oceanState } from "@/lib/oceanState";

const CHAPTERS = [
  "The Sunlit Ocean",
  "Coral Kingdom",
  "Twilight Waters",
  "The Midnight Ocean",
  "The Abyss",
  "The Hidden World",
  "Saving Earth's Oceans"
];

export default function ChapterDisplay() {
  const [chapter, setChapter] = useState(1);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    let timeoutId: NodeJS.Timeout;

    const checkChapter = () => {
      if (oceanState.currentChapter !== chapter) {
        setChapter(oceanState.currentChapter);
        setShow(true);
        
        // Hide the big chapter title after 4 seconds
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setShow(false);
        }, 4000);
      }
      animationFrameId = requestAnimationFrame(checkChapter);
    };
    checkChapter();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
    };
  }, [chapter]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -50, filter: "blur(10px)" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 pointer-events-none flex items-center justify-center z-30"
        >
          <div className="text-center mix-blend-screen">
            <h4 className="text-sm font-mono text-cyan-glow tracking-[0.5em] mb-4 uppercase">
              Chapter {chapter}
            </h4>
            <h1 className="text-6xl md:text-8xl font-light text-white uppercase tracking-widest drop-shadow-2xl">
              {CHAPTERS[chapter - 1]}
            </h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
