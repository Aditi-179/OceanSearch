"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function Silhouettes() {
  const { scrollYProgress } = useScroll();

  // ── Manta Ray — sweeps through the shallows (10%→35%)
  const mantaX  = useTransform(scrollYProgress, [0.08, 0.38], ["-25vw", "115vw"]);
  const mantaY  = useTransform(scrollYProgress, [0.08, 0.38], ["22vh", "52vh"]);
  const mantaOp = useTransform(scrollYProgress, [0.08, 0.18, 0.32, 0.38], [0, 0.5, 0.5, 0]);

  // ── Sea Turtle — glides through coral forest (28%→50%)
  const turtleX  = useTransform(scrollYProgress, [0.26, 0.52], ["110vw", "-25vw"]);
  const turtleY  = useTransform(scrollYProgress, [0.26, 0.52], ["38vh", "52vh"]);
  const turtleOp = useTransform(scrollYProgress, [0.26, 0.34, 0.46, 0.52], [0, 0.45, 0.45, 0]);

  // ── Giant Squid — midnight zone (55%→73%)
  const squidX  = useTransform(scrollYProgress, [0.53, 0.74], ["105vw", "-15vw"]);
  const squidY  = useTransform(scrollYProgress, [0.53, 0.74], ["28vh", "50vh"]);
  const squidOp = useTransform(scrollYProgress, [0.53, 0.60, 0.68, 0.74], [0, 0.25, 0.25, 0]);

  // ── Blue Whale — abyss (68%→92%)
  const whaleX  = useTransform(scrollYProgress, [0.66, 0.94], ["120vw", "-40vw"]);
  const whaleY  = useTransform(scrollYProgress, [0.66, 0.94], ["48vh", "36vh"]);
  const whaleOp = useTransform(scrollYProgress, [0.66, 0.75, 0.87, 0.94], [0, 0.28, 0.28, 0]);

  // ── Orca (Killer Whale) — Surface to Reef (0%→20%)
  const orcaX  = useTransform(scrollYProgress, [0.0, 0.22], ["-30vw", "130vw"]);
  const orcaY  = useTransform(scrollYProgress, [0.0, 0.22], ["10vh", "35vh"]);
  const orcaOp = useTransform(scrollYProgress, [0.0, 0.1, 0.15, 0.22], [0, 0.45, 0.45, 0]);

  // ── Whale Shark — Reef to Twilight (15%→45%)
  const wSharkX  = useTransform(scrollYProgress, [0.15, 0.45], ["120vw", "-40vw"]);
  const wSharkY  = useTransform(scrollYProgress, [0.15, 0.45], ["40vh", "25vh"]);
  const wSharkOp = useTransform(scrollYProgress, [0.15, 0.25, 0.35, 0.45], [0, 0.35, 0.35, 0]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 6 }}>
      
      {/* ── ORCA (swimming right) ──────────────────────────────────────────── */}
      <motion.div
        style={{ x: orcaX, y: orcaY, opacity: orcaOp }}
        className="absolute top-0 left-0 w-[420px] h-[180px]"
      >
        <svg viewBox="0 0 300 120" className="w-full h-full">
          {/* Main body (black) */}
          <path d="M20,60 C40,45 100,35 150,40 C200,45 250,55 280,60 C250,70 200,80 150,75 C100,70 40,65 20,60Z" fill="rgba(5,15,30,0.95)" />
          {/* White eye patch */}
          <ellipse cx="230" cy="53" rx="12" ry="6" fill="rgba(200,220,255,0.7)" transform="rotate(-15 230 53)" />
          {/* White underbelly */}
          <path d="M50,65 C100,72 150,74 200,68 C230,64 250,62 260,60 C230,68 150,85 50,65Z" fill="rgba(200,220,255,0.5)" />
          {/* Dorsal fin (tall) */}
          <path d="M120,40 C130,20 145,15 140,40Z" fill="rgba(5,15,30,0.95)" />
          {/* Pectoral fin */}
          <path d="M180,68 C175,85 160,95 155,90 C165,80 175,70 180,68Z" fill="rgba(5,15,30,0.9)" />
          {/* Flukes */}
          <path d="M20,60 C10,50 5,45 10,55 C15,60 20,60 20,60Z" fill="rgba(5,15,30,0.95)" />
          <path d="M20,60 C10,70 5,75 10,65 C15,60 20,60 20,60Z" fill="rgba(5,15,30,0.95)" />
        </svg>
      </motion.div>

      {/* ── WHALE SHARK (swimming left) ────────────────────────────────────── */}
      <motion.div
        style={{ x: wSharkX, y: wSharkY, opacity: wSharkOp }}
        className="absolute top-0 left-0 w-[580px] h-[220px]"
      >
        <svg viewBox="0 0 400 140" className="w-full h-full">
          {/* Body */}
          <path d="M380,70 C350,50 250,40 180,45 C100,50 40,60 20,70 C40,85 100,95 180,90 C250,85 350,85 380,70Z" fill="rgba(15,45,75,0.9)" />
          {/* Spots pattern (deterministic to prevent hydration mismatch) */}
          {[...Array(40)].map((_, i) => {
            const rX = Math.abs(Math.sin(i * 123.45));
            const rY = Math.abs(Math.cos(i * 987.65));
            const rR = Math.abs(Math.sin(i * 321.12));
            return (
              <circle key={i} cx={50 + rX * 250} cy={50 + rY * 35} r={1.5 + rR * 2} fill="rgba(150,200,255,0.4)" />
            );
          })}
          {/* Mouth (blunt front) */}
          <path d="M20,70 C15,65 15,75 20,70Z" fill="rgba(10,30,55,0.95)" />
          {/* Dorsal fin */}
          <path d="M220,44 C230,30 250,32 245,45Z" fill="rgba(15,45,75,0.9)" />
          {/* Pectoral fin */}
          <path d="M120,85 C110,110 90,120 85,110 C100,95 110,85 120,85Z" fill="rgba(15,45,75,0.9)" />
          {/* Tail */}
          <path d="M380,70 C395,50 410,45 405,60 C400,65 390,70 380,70Z" fill="rgba(15,45,75,0.9)" />
          <path d="M380,70 C395,95 410,100 405,80 C400,75 390,70 380,70Z" fill="rgba(15,45,75,0.9)" />
        </svg>
      </motion.div>

      {/* ── MANTA RAY (top-down view, swimming right) ─────────────────────
          Wings spread top/bottom, body runs left-right, tail trails left  */}
      <motion.div
        style={{ x: mantaX, y: mantaY, opacity: mantaOp }}
        className="absolute top-0 left-0 w-[480px] h-[260px]"
      >
        <svg viewBox="0 0 480 260" className="w-full h-full">
          {/* === Top wing === */}
          <path
            d="M240,130
               C255,118 285,95 320,72
               C355,48 400,28 440,22
               C430,42 400,62 370,80
               C340,98 295,116 260,128 Z"
            fill="rgba(8,35,70,0.82)"
          />
          {/* === Bottom wing === */}
          <path
            d="M240,130
               C255,142 285,165 320,188
               C355,212 400,232 440,238
               C430,218 400,198 370,180
               C340,162 295,144 260,132 Z"
            fill="rgba(8,35,70,0.82)"
          />
          {/* === Body (torpedo running left-right) === */}
          <ellipse cx="225" cy="130" rx="55" ry="13" fill="rgba(10,42,82,0.9)" />
          {/* === Rostrum / head (front, right) === */}
          <path
            d="M275,130 C290,127 310,129 318,130 C310,131 290,133 275,130Z"
            fill="rgba(10,42,82,0.95)"
          />
          {/* === Cephalic fins (horns at front) === */}
          <path d="M278,127 C285,118 294,112 298,112" stroke="rgba(10,42,82,0.85)" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M278,133 C285,142 294,148 298,148" stroke="rgba(10,42,82,0.85)" strokeWidth="4" fill="none" strokeLinecap="round"/>
          {/* === Tail (trailing left) === */}
          <path d="M172,130 Q150,124 130,115" stroke="rgba(8,35,70,0.8)" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M172,130 Q150,136 130,145" stroke="rgba(8,35,70,0.8)" strokeWidth="5" fill="none" strokeLinecap="round"/>
          {/* === Belly highlight === */}
          <ellipse cx="225" cy="130" rx="40" ry="8" fill="rgba(30,80,150,0.18)" />
          {/* === Eye === */}
          <circle cx="268" cy="127" r="2.5" fill="rgba(5,20,45,0.9)" />
        </svg>
      </motion.div>

      {/* ── SEA TURTLE (swimming left, top-down view) ─────────────────────── */}
      <motion.div
        style={{ x: turtleX, y: turtleY, opacity: turtleOp }}
        className="absolute top-0 left-0 w-[240px] h-[200px]"
      >
        <svg viewBox="0 0 240 200" className="w-full h-full">
          {/* Shell */}
          <ellipse cx="120" cy="104" rx="42" ry="35" fill="rgba(6,44,26,0.88)" />
          {/* Shell scutes pattern */}
          <ellipse cx="120" cy="104" rx="28" ry="22" fill="none" stroke="rgba(18,80,45,0.55)" strokeWidth="1.5" />
          <ellipse cx="120" cy="95" rx="14" ry="10" fill="none" stroke="rgba(18,80,45,0.4)" strokeWidth="1" />
          <line x1="92" y1="86" x2="148" y2="86" stroke="rgba(18,80,45,0.35)" strokeWidth="1" />
          <line x1="80" y1="104" x2="160" y2="104" stroke="rgba(18,80,45,0.35)" strokeWidth="1" />
          <line x1="85" y1="122" x2="155" y2="122" stroke="rgba(18,80,45,0.3)" strokeWidth="1" />
          {/* Head (pointing left — swimming left) */}
          <ellipse cx="76" cy="104" rx="14" ry="10" fill="rgba(8,54,30,0.92)" />
          <circle cx="70" cy="101" r="2.5" fill="rgba(5,30,15,0.95)" />
          <circle cx="70.8" cy="100.2" r="0.9" fill="rgba(100,200,120,0.7)" />
          {/* Front left flipper (top-right from body going up-left) */}
          <path d="M105,82 C95,65 74,60 62,68 C75,72 92,76 105,82Z" fill="rgba(6,44,26,0.84)" />
          {/* Front right flipper (bottom-right from body going down-left) */}
          <path d="M105,126 C95,143 74,148 62,140 C75,136 92,132 105,126Z" fill="rgba(6,44,26,0.84)" />
          {/* Rear left flipper */}
          <path d="M148,88 C158,72 176,68 182,76 C170,80 157,84 148,88Z" fill="rgba(6,44,26,0.78)" />
          {/* Rear right flipper */}
          <path d="M148,120 C158,136 176,140 182,132 C170,128 157,124 148,120Z" fill="rgba(6,44,26,0.78)" />
          {/* Tail */}
          <path d="M162,104 Q178,104 186,107" stroke="rgba(6,44,26,0.75)" strokeWidth="5" fill="none" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* ── GIANT SQUID (swimming left, side view) ─────────────────────────── */}
      <motion.div
        style={{ x: squidX, y: squidY, opacity: squidOp }}
        className="absolute top-0 left-0 w-[260px] h-[340px]"
      >
        <svg viewBox="0 0 120 200" className="w-full h-full">
          {/* Mantle (body) */}
          <path
            d="M60,15 C74,15 82,28 80,60 C78,84 70,96 60,100 C50,96 42,84 40,60 C38,28 46,15 60,15Z"
            fill="rgba(18,8,38,0.82)"
          />
          {/* Mantle tip / fins */}
          <path d="M60,15 C68,8 78,10 80,18 C74,14 65,14 60,15Z" fill="rgba(22,10,46,0.85)" />
          <path d="M60,15 C52,8 42,10 40,18 C46,14 55,14 60,15Z" fill="rgba(22,10,46,0.85)" />
          {/* Eye */}
          <circle cx="67" cy="48" r="7" fill="rgba(40,15,70,0.92)" />
          <circle cx="68" cy="47" r="3" fill="rgba(170,120,255,0.65)" />
          <circle cx="69" cy="46" r="1.2" fill="rgba(255,255,255,0.5)" />
          {/* 8 short arms from mantle end */}
          {[0,1,2,3,4,5,6,7].map(i => {
            const spread = (i - 3.5) * 7;
            return (
              <path
                key={i}
                d={`M${60 + spread * 0.3},100 Q${60 + spread * 0.7},115 ${60 + spread},130`}
                stroke="rgba(18,8,38,0.72)"
                strokeWidth={2 - i * 0.1}
                fill="none"
                strokeLinecap="round"
              />
            );
          })}
          {/* 2 long tentacles */}
          <path d="M54,100 Q48,128 44,170" stroke="rgba(18,8,38,0.68)" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
          <path d="M66,100 Q72,128 76,170" stroke="rgba(18,8,38,0.68)" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
          {/* Sucker clubs on long tentacles */}
          <ellipse cx="44" cy="168" rx="5" ry="3" fill="rgba(18,8,38,0.7)" />
          <ellipse cx="76" cy="168" rx="5" ry="3" fill="rgba(18,8,38,0.7)" />
        </svg>
      </motion.div>

      {/* ── BLUE WHALE (swimming left, side view) ──────────────────────────── */}
      <motion.div
        style={{ x: whaleX, y: whaleY, opacity: whaleOp }}
        className="absolute top-0 left-0 w-[860px] h-[260px]"
      >
        <svg viewBox="0 0 420 120" className="w-full h-full">
          {/* Main body */}
          <path
            d="M30,62
               C60,35 130,24 220,30
               C290,35 355,44 390,52
               C380,64 355,72 290,68
               C230,64 140,66 80,72
               C55,75 38,72 30,62Z"
            fill="rgba(4,16,38,0.9)"
          />
          {/* Belly / lighter underside */}
          <path
            d="M35,62
               C65,50 135,42 220,46
               C290,50 350,56 385,60
               C370,64 330,66 280,64
               C220,62 140,64 80,68
               C60,70 40,68 35,62Z"
            fill="rgba(10,35,75,0.45)"
          />
          {/* Head / rostrum — points left */}
          <path d="M30,62 C16,59 6,61 4,62 C6,63 16,65 30,62Z" fill="rgba(4,16,38,0.92)" />
          {/* Lower jaw / mouth line */}
          <path d="M30,62 Q18,66 8,65" stroke="rgba(8,28,60,0.6)" strokeWidth="1.5" fill="none"/>
          {/* Blowhole ridge */}
          <ellipse cx="110" cy="30" rx="16" ry="6" fill="rgba(5,20,46,0.82)" />
          {/* Dorsal fin */}
          <path d="M265,40 C274,27 288,30 284,42Z" fill="rgba(4,16,38,0.92)" />
          {/* Pectoral fin (right, going down) */}
          <path d="M150,62 C145,80 130,92 120,88 C132,80 145,72 150,62Z" fill="rgba(4,16,38,0.88)" />
          {/* Flukes */}
          <path d="M388,54 C400,42 412,40 413,46 C408,50 398,52 392,54Z" fill="rgba(4,16,38,0.92)" />
          <path d="M388,62 C400,74 412,76 413,70 C408,66 398,64 392,62Z" fill="rgba(4,16,38,0.92)" />
          {/* Ventral grooves */}
          {[55,75,95,115,135].map((x, i) => (
            <line key={i} x1={x} y1="56" x2={x + 4} y2="68" stroke="rgba(12,40,90,0.4)" strokeWidth="1"/>
          ))}
          {/* Eye */}
          <circle cx="42" cy="58" r="3.5" fill="rgba(3,12,30,0.97)" />
          <circle cx="43" cy="57" r="1.4" fill="rgba(70,120,190,0.6)" />
        </svg>
      </motion.div>

    </div>
  );
}
