"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FeatureCard from "./FeatureCard";
import { ThermometerSun, Trash2, Anchor, FishOff } from "lucide-react";

export default function ShallowReefThreats() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress inside the sticky height container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const cards = [
    {
      title: "Bleaching",
      description: "Rising temperatures cause corals to expel the algae living in their tissues, turning them completely white.",
      icon: <ThermometerSun strokeWidth={1.5} className="w-full h-full" />,
    },
    {
      title: "Microplastics",
      description: "Tiny plastic particles are ingested by marine life, entering the food chain and devastating ecosystems.",
      icon: <Trash2 strokeWidth={1.5} className="w-full h-full" />,
    },
    {
      title: "Overfishing",
      description: "Removing fish faster than they can reproduce disrupts the delicate balance of the reef.",
      icon: <FishOff strokeWidth={1.5} className="w-full h-full" />,
    },
    {
      title: "Physical Damage",
      description: "Irresponsible boating, anchoring, and diving can destroy decades of coral growth in seconds.",
      icon: <Anchor strokeWidth={1.5} className="w-full h-full" />,
    },
  ];

  // Card size parameters
  const cardWidth = 420; // 420px
  const gap = 32;       // 32px (gap-8)
  const step = cardWidth + gap; // 452px

  // Map scroll progress to horizontal translation (translateX)
  // Shifts the track horizontally so each card centers at: 0.05, 0.35, 0.65, 0.95
  const translateX = useTransform(
    scrollYProgress,
    [0.05, 0.35, 0.65, 0.95],
    [0, -step, -step * 2, -step * 3]
  );

  // Scale transforms per card to highlight the active card in the center
  const scale1 = useTransform(scrollYProgress, [0.05, 0.35], [1.1, 0.85]);
  const scale2 = useTransform(scrollYProgress, [0.05, 0.35, 0.65], [0.85, 1.1, 0.85]);
  const scale3 = useTransform(scrollYProgress, [0.35, 0.65, 0.95], [0.85, 1.1, 0.85]);
  const scale4 = useTransform(scrollYProgress, [0.65, 0.95], [0.85, 1.1]);

  // Opacity transforms per card to fade out background cards
  const opacity1 = useTransform(scrollYProgress, [0.05, 0.35], [1, 0.3]);
  const opacity2 = useTransform(scrollYProgress, [0.05, 0.35, 0.65], [0.3, 1, 0.3]);
  const opacity3 = useTransform(scrollYProgress, [0.35, 0.65, 0.95], [0.3, 1, 0.3]);
  const opacity4 = useTransform(scrollYProgress, [0.65, 0.95], [0.3, 1]);

  const cardTransforms = [
    { scale: scale1, opacity: opacity1 },
    { scale: scale2, opacity: opacity2 },
    { scale: scale3, opacity: opacity3 },
    { scale: scale4, opacity: opacity4 },
  ];

  return (
    <>
      {/* ── DESKTOP & TABLET: HORIZONTAL SLIDE & SCALE (lg and above) ── */}
      <div
        ref={containerRef}
        className="hidden lg:block relative h-[300vh] w-full"
      >
        <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden py-16">
          
          {/* Header Text - Remains Fixed at Top */}
          <div className="container mx-auto px-6 text-center z-10 shrink-0">
            <span className="text-xs uppercase tracking-[0.3em] text-cyan-glow/60 font-mono block mb-2">
              Shallow Reef · 50m
            </span>
            <h2 className="text-4xl md:text-5xl font-light mb-3 drop-shadow-lg text-white">
              The <span className="font-bold">Shallows</span>
            </h2>
            <p className="text-base max-w-xl mx-auto font-light text-white/70 drop-shadow-md">
              As we descend, the light begins to fade. Here, coral reefs face their greatest
              threats from temperature changes and pollution.
            </p>
          </div>

          {/* Horizontal Slide Container */}
          <div className="relative w-full overflow-hidden flex items-center flex-grow py-8">
            <motion.div
              style={{
                x: translateX,
                paddingLeft: `calc(50vw - ${cardWidth / 2}px)`,
                paddingRight: `calc(50vw - ${cardWidth / 2}px)`,
              }}
              className="flex gap-8 items-center"
            >
              {cards.map((card, index) => {
                const { scale, opacity } = cardTransforms[index];

                return (
                  <motion.div
                    key={index}
                    style={{
                      width: cardWidth,
                      scale,
                      opacity,
                    }}
                    className="shrink-0 transition-shadow duration-500 rounded-2xl"
                  >
                    <FeatureCard
                      title={card.title}
                      description={card.description}
                      icon={card.icon}
                      isScrollControlled={true}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Interactive Progress Indicator Dots */}
          <div className="flex justify-center items-center gap-4 shrink-0 z-10">
            {cards.map((_, i) => {
              const ranges = [
                i === 0 ? [0.05, 0.35] : i === 1 ? [0.05, 0.35, 0.65] : i === 2 ? [0.35, 0.65, 0.95] : [0.65, 0.95],
                i === 0 ? [1, 0.3] : i === 1 ? [0.3, 1, 0.3] : i === 2 ? [0.3, 1, 0.3] : [0.3, 1],
                i === 0 ? [1.25, 0.85] : i === 1 ? [0.85, 1.25, 0.85] : i === 2 ? [0.85, 1.25, 0.85] : [0.85, 1.25]
              ];

              const dotOpacity = useTransform(scrollYProgress, ranges[0], ranges[1]);
              const dotScale = useTransform(scrollYProgress, ranges[0], ranges[2]);

              return (
                <div key={i} className="relative flex items-center justify-center">
                  <motion.div
                    style={{ opacity: dotOpacity, scale: dotScale }}
                    className="w-2.5 h-2.5 rounded-full bg-cyan-glow shadow-[0_0_10px_rgba(67,247,255,0.8)]"
                  />
                  {/* Outer active ring */}
                  <motion.div
                    style={{
                      opacity: useTransform(
                        scrollYProgress,
                        ranges[0],
                        i === 0 ? [0.5, 0] : i === 1 ? [0, 0.5, 0] : i === 2 ? [0, 0.5, 0] : [0, 0.5]
                      ),
                      scale: useTransform(
                        scrollYProgress,
                        ranges[0],
                        i === 0 ? [1.6, 1.0] : i === 1 ? [1.0, 1.6, 1.0] : i === 2 ? [1.0, 1.6, 1.0] : [1.0, 1.6]
                      )
                    }}
                    className="absolute w-2.5 h-2.5 rounded-full border border-cyan-glow"
                  />
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* ── MOBILE & TABLET: STANDARD SCROLL (Below lg) ── */}
      <div className="block lg:hidden w-full py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-cyan-glow/60 font-mono block mb-3">
              Shallow Reef · 50m
            </span>
            <h2 className="text-3xl md:text-5xl font-light mb-4 drop-shadow-lg text-white">
              The <span className="font-bold">Shallows</span>
            </h2>
            <p className="text-base font-light text-white/80 leading-relaxed">
              As we descend, the light begins to fade. Here, coral reefs face their greatest
              threats from temperature changes and pollution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map((card, index) => (
              <FeatureCard
                key={index}
                title={card.title}
                description={card.description}
                icon={card.icon}
                isScrollControlled={false}
                delay={index * 0.15}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
