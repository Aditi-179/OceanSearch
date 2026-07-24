"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Activity, Crosshair, Radar } from "lucide-react";

const mockData = [
  { time: "00:00", threatLevel: 12 },
  { time: "04:00", threatLevel: 18 },
  { time: "08:00", threatLevel: 45 },
  { time: "12:00", threatLevel: 30 },
  { time: "16:00", threatLevel: 65 },
  { time: "20:00", threatLevel: 25 },
  { time: "24:00", threatLevel: 15 },
];

export default function Dashboard() {
  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
      {/* Map Section */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="lg:col-span-2 h-[500px] glass-panel rounded-2xl overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-deep-200/50 flex items-center justify-center z-10 backdrop-blur-sm">
           {/* If mapbox token is absent, show placeholder */}
           <div className="flex flex-col items-center gap-4 text-cyan-glow">
             <Radar className="w-12 h-12 animate-spin-slow" />
             <p className="font-mono text-sm tracking-widest uppercase">Initializing Sonar Uplink...</p>
           </div>
        </div>
        
        {/* Placeholder for actual MapGL when token is available */}
        <div className="w-full h-full bg-[#000E1D] opacity-80" style={{
            backgroundImage: "radial-gradient(circle at center, #003E6B 0%, #000E1D 100%)",
            backgroundSize: "cover"
        }}>
            {/* Simulated Radar Sweep */}
            <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 border border-cyan-glow/10 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
            <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 border border-cyan-glow/20 rounded-full" />
            <div className="absolute top-1/2 left-1/2 w-[200px] h-[200px] -translate-x-1/2 -translate-y-1/2 border border-cyan-glow/30 rounded-full" />
        </div>
      </motion.div>

      {/* Side Panel */}
      <div className="flex flex-col gap-6">
        {/* Live Threat Chart */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-6 rounded-2xl h-[240px] flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-mono text-white/80 text-sm">Threat Index</h3>
            <Activity className="w-4 h-4 text-danger-coral animate-pulse" />
          </div>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <defs>
                  <linearGradient id="colorThreat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-danger-coral)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-danger-coral)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,14,29,0.9)', border: '1px solid rgba(255,95,109,0.2)', borderRadius: '8px' }}
                  itemStyle={{ color: '#FF5F6D' }}
                />
                <Area type="monotone" dataKey="threatLevel" stroke="var(--color-danger-coral)" fillOpacity={1} fill="url(#colorThreat)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Live Detections */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6 rounded-2xl flex-grow flex flex-col gap-4"
        >
          <h3 className="font-mono text-white/80 text-sm mb-2">Live Detections</h3>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-glow/30 transition-colors">
            <div className="flex items-center gap-3">
              <Crosshair className="w-4 h-4 text-cyan-glow" />
              <span className="text-sm font-medium text-white">Ghost Net</span>
            </div>
            <span className="text-xs font-mono text-cyan-glow">98% Conf</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-danger-coral/10 border border-danger-coral/30 hover:border-danger-coral transition-colors relative overflow-hidden">
             <div className="absolute inset-0 bg-danger-coral/5 animate-pulse" />
            <div className="flex items-center gap-3 relative z-10">
              <Crosshair className="w-4 h-4 text-danger-coral" />
              <span className="text-sm font-medium text-white">Illegal Trawler</span>
            </div>
            <span className="text-xs font-mono text-danger-coral relative z-10">CRITICAL</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
