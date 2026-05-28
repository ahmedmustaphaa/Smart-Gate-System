"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Sliders, 
  Save, 
  Lock, 
  Bell, 
  Cpu, 
  Globe 
} from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  // أنيميشن التبديل بين التابات والظهور
  const tabContentVariants = {
    hidden: { opacity: 0, x: 15 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, x: -15, transition: { duration: 0.1 } }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500); // محاكاة الحفظ
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 text-slate-100 min-h-screen bg-transparent"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 tracking-wide">
          <SettingsIcon className="w-8 h-8 text-blue-500 animate-[spin_8s_linear_infinite]" /> Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">Configure your profile, system behavior, and hardware integration thresholds.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Side: Tabs Navigation */}
        <div className="flex flex-col gap-2 p-2 rounded-2xl border border-slate-800 bg-slate-900/20 backdrop-blur-md">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
              activeTab === 'profile' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' 
                : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" /> Profile Settings
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
              activeTab === 'system' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' 
                : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" /> System Configurations
          </button>
        </div>

        {/* Right Side: Tab Content Wrapper */}
        <div className="lg:col-span-3 p-6 rounded-2xl border border-slate-800 bg-slate-900/20 backdrop-blur-md shadow-2xl min-h-[400px]">
          <form onSubmit={handleSave}>
            <AnimatePresence mode="wait">
              
              {/* Tab 1: Profile Settings */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Lock className="w-4 h-4 text-blue-400" /> Account Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-slate-400">Admin Name</label>
                      <input 
                        type="text" 
                        defaultValue="Ahmed Mostafa"
                        className="bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-slate-400">Email Address</label>
                      <input 
                        type="email" 
                        defaultValue="ahmed@smartgate.com"
                        className="bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 max-w-md pt-2">
                    <label className="text-xs font-medium text-slate-400">Update Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </motion.div>
              )}

              {/* Tab 2: System Configurations */}
              {activeTab === 'system' && (
                <motion.div
                  key="system"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Cpu className="w-4 h-4 text-blue-400" /> Hardware & Rules
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* QR Expiration Setting */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-slate-400">QR Code Expiry Timeout (Minutes)</label>
                      <input 
                        type="number" 
                        defaultValue={15}
                        className="bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>

                    {/* Websocket heartbeat setting */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-slate-400">Gate Connection Pulse Interval (Seconds)</label>
                      <input 
                        type="number" 
                        defaultValue={5}
                        className="bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Toggle Options */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/20 border border-slate-800/60">
                      <div className="flex items-center gap-3">
                        <Bell className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-sm font-medium text-slate-200">Emergency Audio Alerts</p>
                          <p className="text-xs text-slate-500">Play system sound on Force Lockdown/Open actions.</p>
                        </div>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer" />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/20 border border-slate-800/60">
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-sm font-medium text-slate-200">Global Logging Logs</p>
                          <p className="text-xs text-slate-500">Record all denied entrance scans into database permanently.</p>
                        </div>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer" />
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Save Button Footer */}
            <div className="mt-8 pt-4 border-t border-slate-800/60 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-blue-600/10"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving Changes...' : 'Save Settings'}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}