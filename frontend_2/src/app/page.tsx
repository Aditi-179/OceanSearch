import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import Dashboard from "@/components/Dashboard";
import Timeline from "@/components/Timeline";
import Donation from "@/components/Donation";
import { ThermometerSun, Trash2, Anchor, FishOff } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background text-foreground selection:bg-cyan-glow/30 selection:text-white">
      <Navbar />
      
      <div className="relative w-full overflow-hidden">
        
        {/* Surface (0m - 50m) */}
        <Hero />
        
        {/* Shallow Ocean (50m - 200m) */}
        <section id="threats" className="relative w-full min-h-[100vh] flex items-center justify-center pt-32 pb-32 z-10 bg-gradient-to-b from-surface-100 via-shallow-100 to-shallow-200 text-abyss-200">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl md:text-6xl font-light mb-8 text-center text-deep-100">
              The <span className="font-bold">Shallows</span>
            </h2>
            <p className="text-xl max-w-2xl mx-auto font-medium text-center text-deep-100/80 mb-20">
              As we descend, the light begins to fade. Here, coral reefs face their greatest threats from temperature changes and pollution.
            </p>
            
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

        {/* Mid Ocean (200m - 1000m) */}
        <section id="ai-system" className="relative w-full min-h-screen flex items-center justify-center py-32 z-10 bg-gradient-to-b from-shallow-200 via-mid-100 to-mid-200">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-light mb-6 text-white/90">
                Mid <span className="font-bold text-cyan-glow">Ocean</span>
              </h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                The twilight zone. Our AI drones patrol these depths, tracking elusive marine life and mapping uncharted territories.
              </p>
            </div>
            
            <Dashboard />
          </div>
        </section>

        {/* Deep Ocean & Abyss (1000m+) */}
        <section id="take-action" className="relative w-full flex flex-col pt-32 z-10 bg-gradient-to-b from-mid-200 via-deep-200 to-abyss-200">
          
          <div className="container mx-auto px-6 mb-32 flex-grow flex flex-col justify-center text-center">
            <h2 className="text-4xl md:text-6xl font-light mb-8 text-white/90">
              The <span className="font-bold text-marine-green text-glow">Abyss</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Total darkness. Only bioluminescence survives here. It's time to take action and bring light back to our oceans.
            </p>
          </div>

          <Timeline />
          
          <div className="container mx-auto px-6 py-32">
             <Donation />
          </div>
          
        </section>

      </div>
    </main>
  );
}
