import Navbar from "@/components/Navbar";
import Dashboard from "@/components/Dashboard";
import Sidebar from "@/components/Sidebar";

export default function ResearchPage() {
  return (
    <main className="relative bg-[#020a16] min-h-screen text-foreground selection:bg-cyan-glow/30 selection:text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

      <section className="relative w-full pt-32 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-cyan-glow/60 font-mono block mb-3">
              DeepSea Guardian
            </span>
            <h1 className="text-4xl md:text-6xl font-light mb-6 text-white/90 drop-shadow-xl">
              Research <span className="font-bold text-cyan-glow">Dashboard</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto drop-shadow-lg font-light">
              Live AI telemetry, IoT environmental analysis, and predictive simulations.
            </p>
          </div>

          <Dashboard />
        </div>
      </section>
      </div>
    </main>
  );
}
