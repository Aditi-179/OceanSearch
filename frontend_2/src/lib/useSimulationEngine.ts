import { useState, useEffect } from "react";
import { oceanState } from "./oceanState";

const initialIotData = [
  { time: "00:00", temp: 15.2, pollution: 40 },
  { time: "04:00", temp: 15.4, pollution: 45 },
  { time: "08:00", temp: 16.1, pollution: 75 },
  { time: "12:00", temp: 16.5, pollution: 90 },
  { time: "16:00", temp: 16.2, pollution: 65 },
  { time: "20:00", temp: 15.8, pollution: 55 },
];

export function useSimulationEngine() {
  const [chartData, setChartData] = useState(initialIotData);
  const [logMessages, setLogMessages] = useState<{ id: number, text: string, type: "info" | "ok" | "warn" }[]>([
    { id: 1, text: "[OK] System Initialized (Local Engine)", type: "ok" },
    { id: 2, text: "[INFO] Drone 04 battery at 82%.", type: "info" }
  ]);

  useEffect(() => {
    // 1. Sonar Heartbeat loop (every 5 seconds)
    const heartbeat = setInterval(() => {
      window.dispatchEvent(new Event("trigger-sonar"));
    }, 5000);

    // 2. Simulated IoT Data Generation (every 8 seconds)
    const iotLoop = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const newTemp = 15 + Math.random() * 2 + (oceanState.timelineYear > 2030 ? 1.5 : 0);
      const newPollution = 40 + Math.random() * 40 + (oceanState.scenario === "worst_case" ? 20 : 0);
      
      const newData = { time: timeStr, temp: Number(newTemp.toFixed(1)), pollution: Number(newPollution.toFixed(1)) };
      
      setChartData(prev => {
        const d = [...prev, newData];
        if (d.length > 7) d.shift();
        return d;
      });

      if (Math.random() > 0.6) {
        setLogMessages(prev => {
          const newLogs = [{ id: Date.now(), text: `[INFO] Sensor reading updated at ${timeStr}`, type: "info" as const }, ...prev];
          if (newLogs.length > 5) newLogs.pop();
          return newLogs;
        });
      }
    }, 8000);

    // 3. Simulated Emergency Alerts (every 20 seconds)
    const alertLoop = setInterval(() => {
      if (Math.random() > 0.7) {
        const types = ["oil_spill", "illegal_vessel", "coral_bleaching", "mammal_rescue"];
        const type = types[Math.floor(Math.random() * types.length)];
        let title, description, color, coords;

        if (type === "oil_spill") {
          title = "CRITICAL: Oil Spill Detected";
          description = "Surface sensors report a 400sqm slick spreading north.";
          color = "#FF4500";
          coords = [35.2, -120.4];
        } else if (type === "illegal_vessel") {
          title = "WARNING: Unregistered Vessel";
          description = "A vessel has entered the marine protected area. No AIS signal.";
          color = "#FF0055";
          coords = [35.5, -120.8];
        } else if (type === "coral_bleaching") {
          title = "ALERT: Coral Stress Detected";
          description = "Water temperature spike has triggered coral bleaching.";
          color = "#FFAA00";
          coords = [34.9, -120.1];
        } else {
          title = "ACTION: Mammal Rescue";
          description = "Whale entanglement detected in ghost nets.";
          color = "#00FFFF";
          coords = [35.1, -120.6];
        }

        window.dispatchEvent(new CustomEvent("trigger-critical-threat", {
          detail: { type, title, description, color, coords }
        }));
        
        setLogMessages(prev => {
          const newLogs = [{ id: Date.now(), text: `[WARN] ${title}`, type: "warn" as const }, ...prev];
          if (newLogs.length > 5) newLogs.pop();
          return newLogs;
        });
      }
    }, 20000);

    return () => {
      clearInterval(heartbeat);
      clearInterval(iotLoop);
      clearInterval(alertLoop);
    };
  }, []);

  return { chartData, logMessages };
}
