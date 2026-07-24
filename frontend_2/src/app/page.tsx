import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import Dashboard from "@/components/Dashboard";
import Timeline from "@/components/Timeline";
import Donation from "@/components/Donation";
import DepthMeter from "@/components/DepthMeter";
import EcosystemEngine from "@/components/canvas/EcosystemEngine";
import OceanEffects from "@/components/OceanEffects";
import Silhouettes from "@/components/Silhouettes";
import { ThermometerSun, Trash2, Anchor, FishOff } from "lucide-react";

export default function Home() {
  return (
    <main className="relative bg-transparent text-foreground selection:bg-cyan-glow/30 selection:text-white">
      {/* Fixed UI */}
      <Navbar />
      <DepthMeter />

      {/* Fixed 3D ocean ecosystem engine */}
      <EcosystemEngine />

      {/* DOM-level ocean effects (vignette, sonar rings, pressure lines) */}
      <OceanEffects />
      
      {/* Large CSS/SVG marine silhouettes (manta ray, turtle, whale, squid) */}
      <Silhouettes />

      {/* Scrollable content — fully transparent sections floating above the ocean */}
      <div className="relative w-full flex flex-col z-10">

        {/* ── 0m SURFACE ─────────────────────────────────────────────────── */}
        <Hero />

        {/* ── 20m–80m SHALLOWS — discovery gap ──────────────────────────── */}
        <div className="h-[40vh] relative">
          {/* Ambient annotation: first life signs */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center pointer-events-none">
            <span className="text-xs uppercase tracking-[0.3em] text-cyan-glow/50 font-mono block mb-1">20m</span>
            <span className="text-white/30 text-sm font-light">Entering the coral zone</span>
          </div>
        </div>

        {/* ── SHALLOW REEF — existing threats section (unchanged) ─────────── */}
        <section
          id="threats"
          className="relative w-full min-h-[100vh] flex items-center justify-center py-32 text-white"
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <span className="text-xs uppercase tracking-[0.3em] text-cyan-glow/60 font-mono block mb-3">
                Shallow Reef · 50m
              </span>
              <h2 className="text-4xl md:text-6xl font-light mb-6 drop-shadow-lg">
                The <span className="font-bold">Shallows</span>
              </h2>
              <p className="text-xl max-w-2xl mx-auto font-light text-white/80 drop-shadow-md">
                As we descend, the light begins to fade. Here, coral reefs face their greatest
                threats from temperature changes and pollution.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard
                title="Bleaching"
                description="Rising temperatures cause corals to expel the algae living in their tissues, turning them completely white."
                icon={<ThermometerSun strokeWidth={1.5} className="w-full h-full" />}
                delay={0}
              />
              <FeatureCard
                title="Microplastics"
                description="Tiny plastic particles are ingested by marine life, entering the food chain and devastating ecosystems."
                icon={<Trash2 strokeWidth={1.5} className="w-full h-full" />}
                delay={0.2}
              />
              <FeatureCard
                title="Overfishing"
                description="Removing fish faster than they can reproduce disrupts the delicate balance of the reef."
                icon={<FishOff strokeWidth={1.5} className="w-full h-full" />}
                delay={0.4}
              />
              <FeatureCard
                title="Physical Damage"
                description="Irresponsible boating, anchoring, and diving can destroy decades of coral growth in seconds."
                icon={<Anchor strokeWidth={1.5} className="w-full h-full" />}
                delay={0.6}
              />
            </div>
          </div>
        </section>

        {/* ── CORAL FOREST discovery gap ─────────────────────────────────── */}
        <div className="h-[70vh] relative flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-cyan-glow/40 font-mono block mb-2">150m</span>
            <p className="text-white/25 text-sm font-light max-w-xs mx-auto">
              Coral forest ahead. Fan corals and sea fans rise from the dark.
            </p>
          </div>
        </div>

        {/* ── TWILIGHT ZONE — AI Dashboard (unchanged) ───────────────────── */}
        <section
          id="ai-system"
          className="relative w-full min-h-screen flex items-center justify-center py-32"
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-xs uppercase tracking-[0.3em] text-cyan-glow/60 font-mono block mb-3">
                Twilight Zone · 400m
              </span>
              <h2 className="text-4xl md:text-6xl font-light mb-6 text-white/90 drop-shadow-xl">
                Twilight <span className="font-bold text-cyan-glow">Zone</span>
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto drop-shadow-lg font-light">
                Sunlight is barely visible. Our AI drones patrol these depths, tracking elusive
                marine life and mapping uncharted territories.
              </p>
            </div>

            <Dashboard />
          </div>
        </section>

        {/* ── MIDNIGHT ZONE discovery gap ────────────────────────────────── */}
        <div className="h-[90vh] relative flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-cyan-glow/40 font-mono block mb-2">
              700m — Midnight Zone
            </span>
            <p className="text-white/20 text-sm font-light max-w-xs mx-auto leading-relaxed">
              Complete darkness. The AI drone is your only guide. Bioluminescent organisms light the way.
            </p>
            {/* Pulsing sonar visual */}
            <div className="mt-8 relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border border-cyan-glow/30 animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute inset-4 rounded-full border border-cyan-glow/20 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
              <div className="absolute inset-8 rounded-full border border-cyan-glow/40" />
            </div>
          </div>
        </div>

        {/* ── ABYSS (1000m+) — existing take-action section (unchanged) ──── */}
        <section id="take-action" className="relative w-full flex flex-col pt-32">

          <div className="container mx-auto px-6 mb-32 flex-grow flex flex-col justify-center text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-marine-green/60 font-mono block mb-4">
              1000m+ — The Abyss
            </span>
            <h2 className="text-4xl md:text-6xl font-light mb-8 text-white/90 drop-shadow-[0_0_20px_rgba(24,255,200,0.4)]">
              The <span className="font-bold text-marine-green">Abyss</span>
            </h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed">
              Total darkness. Only bioluminescence survives here.{" "}
              <br className="hidden md:block" />
              You've reached the deepest point. Now help protect everything you've discovered.
            </p>
          </div>

          <Timeline />

          <div className="container mx-auto px-6 py-40">
            <Donation />
          </div>

        </section>

      </div>
    </main>
  );
}
