
import Dashboard from "@/components/Dashboard";
import Sidebar from "@/components/Sidebar";

export default function ResearchPage() {
  return (
    <main className="relative bg-[#020a16] min-h-screen text-foreground selection:bg-cyan-glow/30 selection:text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
      <section className="relative w-full p-6">
        <div className="container mx-auto">
          <Dashboard />
        </div>
      </section>
      </div>
    </main>
  );
}
