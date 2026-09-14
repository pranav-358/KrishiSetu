import React, { useState } from 'react';
import { Cpu, Wifi, Power, Droplet } from 'lucide-react';

export default function HardwareSyncPanel({ moisture = 50, language = 'en' }) {
  const [autoMode, setAutoMode] = useState(true);

  // The Magic Trick: If Auto is ON and moisture drops below 35%, simulate pump activation
  const isPumpRunning = autoMode && moisture <= 35;

  return (
    <div className="bg-white/70 backdrop-blur-2xl border border-soil-ink/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_8px_32px_rgba(43,36,25,0.05)] mb-6 sm:mb-8 transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Hardware Status */}
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-soil-ink rounded-xl text-husk-cream">
            <Cpu size={24} />
          </div>
          <div>
            <h3 className="font-bold text-soil-ink flex items-center">
              {language === 'hi' ? 'रास्पबेरी पाई एज गेटवे' : 'Raspberry Pi Edge Gateway'}
              <span className="ml-2 flex items-center text-[10px] uppercase tracking-wider bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                <Wifi size={10} className="mr-1" /> Online
              </span>
            </h3>
            <p className="text-sm text-soil-ink/60 mt-0.5">
              {language === 'hi' ? 'ESP32 सेंसर नोड से जुड़ा हुआ है' : 'Connected to ESP32 Sensor Node'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-4 w-full sm:w-auto p-3 sm:p-0 bg-soil-ink/5 sm:bg-transparent rounded-xl sm:rounded-none">
          
          {/* Pump Status Indicator */}
          <div className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 border border-soil-ink/10 rounded-lg bg-white">
            <Droplet size={18} className={isPumpRunning ? "text-blue-500 animate-bounce" : "text-soil-ink/30"} />
            <span className={`text-sm font-bold ${isPumpRunning ? "text-blue-600" : "text-soil-ink/50"}`}>
              {isPumpRunning 
                ? (language === 'hi' ? 'पंप चालू है' : 'PUMP ACTIVE') 
                : (language === 'hi' ? 'पंप बंद है' : 'PUMP OFF')}
            </span>
          </div>

          {/* Auto-Irrigate Toggle */}
          <button 
            onClick={() => setAutoMode(!autoMode)}
            className={`flex items-center justify-center p-2 rounded-lg transition-all ${
              autoMode ? 'bg-leaf-green text-white shadow-md' : 'bg-soil-ink/10 text-soil-ink/50'
            }`}
            title="Toggle Auto-Irrigation"
          >
            <Power size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}