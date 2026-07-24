"use client";

import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Trash2, ThermometerSun } from "lucide-react";
import { useEffect, useState } from "react";
import { oceanState } from "@/lib/oceanState";

interface IotChartsProps {
  data: { time: string; temp: number; pollution: number }[];
}

export default function IotCharts({ data }: IotChartsProps) {
  const [mode, setMode] = useState(oceanState.accessibilityMode);

  useEffect(() => {
    const handleModeChange = () => setMode(oceanState.accessibilityMode);
    window.addEventListener("accessibility-change", handleModeChange);
    return () => window.removeEventListener("accessibility-change", handleModeChange);
  }, []);

  // Theme configuration based on accessibility mode
  const getTheme = () => {
    switch (mode) {
      case "protanopia":
        return { danger: "#FFC107", safe: "#0055FF", patternType: "waves" };
      case "deuteranopia":
        return { danger: "#FF3366", safe: "#0055FF", patternType: "hatch" };
      case "tritanopia":
        return { danger: "#FF3366", safe: "#00FFFF", patternType: "dots" };
      case "high_contrast":
        return { danger: "#FFFF00", safe: "#FFFFFF", patternType: "solid" };
      case "monochrome":
        return { danger: "#888888", safe: "#CCCCCC", patternType: "stripes" };
      default:
        return { danger: "#FF5F6D", safe: "#43F7FF", patternType: "solid" };
    }
  };

  const theme = getTheme();

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* SVG Definitions for Accessibility Patterns */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <pattern id="pattern-stripes" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="4" height="8" fill={theme.danger} />
            <rect x="4" width="4" height="8" fill="transparent" />
          </pattern>
          <pattern id="pattern-dots" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="2" fill={theme.danger} />
          </pattern>
          <pattern id="pattern-hatch" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M0,0 l8,8 M8,0 l-8,8" stroke={theme.danger} strokeWidth="1" />
          </pattern>
          
          <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={theme.safe} stopOpacity={mode === "high_contrast" ? 0.8 : 0.4}/>
            <stop offset="95%" stopColor={theme.safe} stopOpacity={0}/>
          </linearGradient>
        </defs>
      </svg>

      {/* Chart 1: Pollution */}
      <div className="glass-panel p-4 rounded-2xl flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-mono text-white/80 flex items-center gap-2">
            <Trash2 className="w-4 h-4" style={{ color: theme.safe }} /> Plastic Density
          </h3>
          <span className="text-xs text-white/40">kg/km³</span>
        </div>
        <div className="flex-grow">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="time" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#020813', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', border: mode === 'high_contrast' ? '2px solid white' : undefined }}
              />
              <Bar 
                dataKey="pollution" 
                fill={theme.patternType === "solid" ? theme.danger : `url(#pattern-${theme.patternType})`} 
                stroke={mode === "high_contrast" ? theme.danger : "transparent"}
                strokeWidth={mode === "high_contrast" ? 2 : 0}
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Temperature */}
      <div className="glass-panel p-4 rounded-2xl flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-mono text-white/80 flex items-center gap-2">
            <ThermometerSun className="w-4 h-4" style={{ color: theme.safe }} /> Water Temp
          </h3>
          <span className="text-xs text-white/40">°C</span>
        </div>
        <div className="flex-grow">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis dataKey="time" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#020813', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', border: mode === 'high_contrast' ? '2px solid white' : undefined }}
              />
              <Area 
                type="monotone" 
                dataKey="temp" 
                stroke={theme.safe} 
                strokeWidth={mode === "high_contrast" ? 3 : 2}
                strokeDasharray={mode === "protanopia" ? "5 5" : mode === "monochrome" ? "2 2" : "0"}
                fillOpacity={1} 
                fill="url(#colorTemp)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
