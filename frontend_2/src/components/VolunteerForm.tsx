"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Anchor, CheckCircle2 } from "lucide-react";

export default function VolunteerForm() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const roles = [
    { id: "diver", title: "Reef Diver", desc: "Physically clean plastic from coral beds.", icon: Anchor },
    { id: "analyst", title: "Data Analyst", desc: "Monitor drone feeds and track pollution.", icon: Shield },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto glass-panel p-8 md:p-12 rounded-3xl relative overflow-hidden">
      {!submitted ? (
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-bold text-white">Join the Fleet</h3>
            <span className="text-cyan-glow font-mono text-sm">STEP {step}/3</span>
          </div>

          {step === 1 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-white/60 mb-6">Select your operative role:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => { setRole(r.id); setStep(2); }}
                    className={`p-6 rounded-2xl border text-left transition-all duration-300 ${
                      role === r.id 
                        ? "border-cyan-glow bg-cyan-glow/10 shadow-[0_0_20px_rgba(67,247,255,0.2)]" 
                        : "border-white/10 bg-black/20 hover:border-white/30"
                    }`}
                  >
                    <r.icon className={`w-8 h-8 mb-4 ${role === r.id ? "text-cyan-glow" : "text-white/40"}`} />
                    <h4 className="text-xl font-bold text-white mb-2">{r.title}</h4>
                    <p className="text-sm text-white/50">{r.desc}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <p className="text-white/60 mb-6">Enter your operative credentials:</p>
              <div className="space-y-4 mb-8">
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name" 
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-glow transition-colors"
                />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Encrypted Comm Link (Email)" 
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-glow transition-colors"
                />
              </div>
              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="text-white/50 hover:text-white transition-colors">Back</button>
                <button 
                  onClick={() => setStep(3)} 
                  className="px-8 py-3 rounded-xl bg-cyan-glow text-background font-bold hover:bg-white transition-colors"
                >
                  Verify Credentials
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
              <div className="w-20 h-20 mx-auto rounded-full bg-cyan-glow/20 border border-cyan-glow flex items-center justify-center mb-6">
                <Shield className="w-10 h-10 text-cyan-glow" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">Credentials Verified</h4>
              <p className="text-white/60 mb-8">Ready to deploy as a {roles.find(r => r.id === role)?.title}.</p>
              <button 
                onClick={async () => {
                  setLoading(true);
                  try {
                    // Simulate network request since backend is merged/removed
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setSubmitted(true);
                  } catch (e) {
                    console.error(e);
                    alert("Submission failed.");
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="w-full py-4 rounded-xl bg-white text-background font-bold hover:bg-cyan-glow transition-colors disabled:opacity-50"
              >
                {loading ? "Encrypting Data..." : "Confirm Deployment"}
              </button>
            </motion.div>
          )}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-12 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 text-marine-green shadow-[0_0_30px_rgba(24,255,200,0.5)] bg-background/50 border-2 border-marine-green">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-4xl font-bold text-white mb-4">Welcome to the Fleet</h3>
          <p className="text-white/70 max-w-lg mb-8">
            Your deployment orders will be sent to your comm link shortly.
          </p>
        </motion.div>
      )}
    </div>
  );
}
