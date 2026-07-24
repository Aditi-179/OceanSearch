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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
