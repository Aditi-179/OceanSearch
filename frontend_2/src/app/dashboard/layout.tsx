import React from "react";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#0B1120] text-slate-300 font-sans selection:bg-[#00F0FF]/30 selection:text-white">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto min-w-0 bg-[#0B1120]">
        {children}
      </main>
    </div>
  );
}
