"use client";

import React, { useState } from "react";
import {
  User,
  Bell,
  LockKey,
  Palette,
  FloppyDisk,
  Camera
} from "@phosphor-icons/react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");
  
  // Generic states
  const [firstName, setFirstName] = useState("Jane");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("jane.doe@example.com");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  return (
    <div className="flex-1 p-6 scrollbar-hide">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Settings</h1>
            <p className="text-slate-400 mt-1 text-sm">Manage your account settings and preferences.</p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-[#00F0FF] hover:bg-[#00F0FF]/90 text-[#0B1120] px-6 py-2.5 rounded-lg font-semibold transition-colors w-full md:w-auto">
            <FloppyDisk size={20} weight="fill" />
            Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Sidebar Nav */}
          <div className="space-y-1">
            {[
              { name: "Profile", icon: User },
              { name: "Account & Security", icon: LockKey },
              { name: "Notifications", icon: Bell },
              { name: "Appearance", icon: Palette },
            ].map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                  activeTab === tab.name
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <tab.icon size={20} weight={activeTab === tab.name ? "fill" : "regular"} />
                {tab.name}
              </button>
            ))}
          </div>

          {/* Settings Content Area */}
          <div className="md:col-span-3 space-y-8">
            
            {activeTab === "Profile" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-white mb-6">Profile Information</h2>
                  
                  {/* Avatar upload generic */}
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center relative overflow-hidden group">
                      <User size={40} className="text-slate-500" />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera size={24} className="text-white" />
                      </div>
                    </div>
                    <div>
                      <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Change Avatar
                      </button>
                      <p className="text-xs text-slate-500 mt-2">JPG, GIF or PNG. 1MB max.</p>
                    </div>
                  </div>

                  {/* Generic inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">First Name</label>
                      <input 
                        type="text" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00F0FF] transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Last Name</label>
                      <input 
                        type="text" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00F0FF] transition-colors"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-slate-300">Email Address</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00F0FF] transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Notifications" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-white mb-6">Email Preferences</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">Account Updates</p>
                        <p className="text-sm text-slate-400 mt-1">Receive emails about your account activity and security.</p>
                      </div>
                      <button 
                        onClick={() => setEmailNotifications(!emailNotifications)}
                        className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${emailNotifications ? 'bg-[#00F0FF]' : 'bg-slate-700'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${emailNotifications ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className="h-px bg-slate-800 w-full" />

                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">Marketing & Promos</p>
                        <p className="text-sm text-slate-400 mt-1">Receive offers, product updates, and newsletters.</p>
                      </div>
                      <button 
                        onClick={() => setMarketingEmails(!marketingEmails)}
                        className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${marketingEmails ? 'bg-[#00F0FF]' : 'bg-slate-700'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${marketingEmails ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder for other tabs */}
            {(activeTab === "Account & Security" || activeTab === "Appearance") && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                <LockKey size={48} className="text-slate-600 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">{activeTab}</h3>
                <p className="text-slate-400 max-w-sm">
                  This is a generic settings page mockup. In a real app, these controls would be connected to your backend database.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
