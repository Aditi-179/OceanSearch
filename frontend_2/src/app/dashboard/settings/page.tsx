"use client";

import React, { useState } from "react";
import {
  User,
  BellRinging,
  ShieldCheck,
  Waveform,
  FloppyDisk,
} from "@phosphor-icons/react";

export default function SettingsPage() {
  const [sonarInterval, setSonarInterval] = useState(5);
  const [aiConfidence, setAiConfidence] = useState(90);
  const [autoDeploy, setAutoDeploy] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  return (
    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Settings & Configuration</h1>
            <p className="text-slate-400 mt-1">Manage your DeepSea Guardian telemetry and AI preferences.</p>
          </div>
          <button className="flex items-center gap-2 bg-[#00F0FF]/10 hover:bg-[#00F0FF]/20 text-[#00F0FF] px-4 py-2 rounded-lg font-medium transition-colors border border-[#00F0FF]/30">
            <FloppyDisk size={20} weight="duotone" />
            Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Sidebar Nav (Mock) */}
          <div className="space-y-2">
            {[
              { name: "General Profile", icon: User, active: false },
              { name: "Telemetry & Sonar", icon: Waveform, active: true },
              { name: "AI Vision", icon: ShieldCheck, active: false },
              { name: "Notifications", icon: BellRinging, active: false },
            ].map((tab) => (
              <button
                key={tab.name}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  tab.active
                    ? "bg-slate-800/80 text-[#00F0FF]"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <tab.icon size={20} weight={tab.active ? "duotone" : "regular"} />
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Section 1 */}
            <div className="bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Telemetry Parameters</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">Sonar Ping Interval</label>
                    <span className="text-sm font-mono text-[#00F0FF]">{sonarInterval}s</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={sonarInterval}
                    onChange={(e) => setSonarInterval(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
                  />
                  <p className="text-xs text-slate-500 mt-2">Frequency of active sonar sweeps. Lower values drain drone batteries faster.</p>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <label className="text-sm font-medium text-slate-300 block">Autonomous Drone Deployment</label>
                    <p className="text-xs text-slate-500 mt-1">Allow system to deploy backup drones when anomalies are detected.</p>
                  </div>
                  <button 
                    onClick={() => setAutoDeploy(!autoDeploy)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${autoDeploy ? 'bg-[#00F0FF]' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${autoDeploy ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">AI Benthic Vision</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">Detection Confidence Threshold</label>
                    <span className="text-sm font-mono text-[#00F0FF]">{aiConfidence}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="99"
                    value={aiConfidence}
                    onChange={(e) => setAiConfidence(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
                  />
                  <p className="text-xs text-slate-500 mt-2">Minimum confidence level required before logging a species or hazard.</p>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <label className="text-sm font-medium text-slate-300 block">Critical Alert Notifications</label>
                    <p className="text-xs text-slate-500 mt-1">Send immediate push notifications for ghost nets and illegal dumping.</p>
                  </div>
                  <button 
                    onClick={() => setAlertsEnabled(!alertsEnabled)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${alertsEnabled ? 'bg-[#00F0FF]' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${alertsEnabled ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
