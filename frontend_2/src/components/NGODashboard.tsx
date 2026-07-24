"use client";

import { motion } from "framer-motion";
import Donation from "./Donation";
import VolunteerForm from "./VolunteerForm";
import { Users, Droplets, Target } from "lucide-react";

export default function NGODashboard() {
  return (
    <div className="w-full max-w-7xl mx-auto rounded-3xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-cyan-glow/20 to-blue-500/20 p-6 md:px-8 border-b border-white/10 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">PUBLIC PORTAL</h2>
          <p className="text-white/70 text-sm mt-1">OceanSearchNGO Initiative</p>
        </div>
        <div className="hidden md:flex gap-4">
          <div className="bg-black/30 rounded-lg px-4 py-2 border border-white/10 flex items-center gap-3">
            <Users className="w-5 h-5 text-cyan-glow" />
            <div>
              <div className="text-xs text-white/50 uppercase">Active Operatives</div>
              <div className="text-lg font-bold text-white">12,408</div>
            </div>
          </div>
          <div className="bg-black/30 rounded-lg px-4 py-2 border border-white/10 flex items-center gap-3">
            <Target className="w-5 h-5 text-marine-green" />
            <div>
              <div className="text-xs text-white/50 uppercase">Funding Goal</div>
              <div className="text-lg font-bold text-white">84%</div>
            </div>
          </div>
          <div className="bg-black/30 rounded-lg px-4 py-2 border border-white/10 flex items-center gap-3">
            <Droplets className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-xs text-white/50 uppercase">Oceans Restored</div>
              <div className="text-lg font-bold text-white">1.2M Hectares</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content Grid */}
      <div className="p-6 md:p-8">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-light text-white drop-shadow-md mb-2">
            Take <span className="font-bold text-cyan-glow">Action</span> Now
          </h3>
          <p className="text-white/60 max-w-2xl mx-auto">
            Join the mission to protect our oceans. Whether you contribute resources or volunteer your time, every action counts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Donation />
          <VolunteerForm />
        </div>
      </div>
    </div>
  );
}
