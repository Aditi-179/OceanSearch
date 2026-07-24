"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ChevronRight, Droplets } from "lucide-react";

export default function Donation() {
  const [amount, setAmount] = useState(50);
  const [submitted, setSubmitted] = useState(false);

  // Map amount to unlocked creature/badge
  const getReward = () => {
    if (amount >= 500) return { name: "Whale Guardian", color: "text-golden", glow: "shadow-[0_0_40px_rgba(255,215,106,0.6)]" };
    if (amount >= 100) return { name: "Sea Turtle Rescuer", color: "text-marine-green", glow: "shadow-[0_0_30px_rgba(24,255,200,0.5)]" };
    return { name: "Coral Planter", color: "text-cyan-glow", glow: "shadow-[0_0_20px_rgba(67,247,255,0.4)]" };
  };

  const reward = getReward();

  return (
    <div className="w-full max-w-4xl mx-auto glass-panel p-8 md:p-12 rounded-3xl relative overflow-hidden">
      {/* Background fill based on amount */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 bg-cyan-glow/10 -z-10"
        animate={{ height: `${Math.min(100, (amount / 500) * 100)}%` }}
        transition={{ type: "spring", bounce: 0.2 }}
      />
      
      {/* Floating bubbles logic could go here */}
      
      {!submitted ? (
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <h3 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <Droplets className="text-cyan-glow" /> Fuel the Fleet
            </h3>
            <p className="text-white/60 mb-8 font-light">
              Your contribution directly deploys AI drones to critical threat zones. Every dollar clears plastic and protects endangered reefs.
            </p>
            
            <div className="mb-12">
              <div className="flex justify-between text-white/50 text-sm mb-4 font-mono">
                <span>$10</span>
                <span className="text-white text-2xl font-bold">${amount}</span>
                <span>$1000+</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="1000" 
                step="10"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-glow"
              />
            </div>
            
            <button 
              onClick={() => {
                setSubmitted(true);
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new Event('ocean-heal'));
                }
              }}
              className="group w-full py-4 rounded-xl bg-white text-background font-bold flex items-center justify-center gap-2 hover:bg-cyan-glow transition-colors duration-300"
            >
              Deploy Support <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center p-8 border border-white/10 rounded-2xl bg-black/20 backdrop-blur-md">
            <span className="text-sm uppercase tracking-widest text-white/40 mb-6">Unlocking Status</span>
            
            <motion.div 
              key={reward.name}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`w-32 h-32 rounded-full border-2 border-current flex items-center justify-center mb-6 ${reward.color} ${reward.glow} bg-background/50`}
            >
              <Heart className="w-12 h-12" fill="currentColor" />
            </motion.div>
            
            <h4 className={`text-xl font-bold ${reward.color} text-center`}>{reward.name}</h4>
            <p className="text-white/50 text-center text-sm mt-2">ID Badge Generated</p>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-12 flex flex-col items-center text-center"
        >
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${reward.color} ${reward.glow} bg-background/50 border-2 border-current`}>
            <Heart className="w-10 h-10" fill="currentColor" />
          </div>
          <h3 className="text-4xl font-bold text-white mb-4">Support Deployed!</h3>
          <p className="text-white/70 max-w-lg mb-8">
            Welcome to the ranks, <span className={`font-bold ${reward.color}`}>{reward.name}</span>. 
            Your ID badge has been encrypted and stored in the DeepSea Guardian ledger.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="text-cyan-glow hover:text-white transition-colors underline underline-offset-4"
          >
            Adjust Deployment
          </button>
        </motion.div>
      )}
    </div>
  );
}
