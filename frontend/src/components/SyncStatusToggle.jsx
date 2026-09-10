import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export default function SyncStatusToggle({ isOffline, setIsOffline }) {
  return (
    <div 
      onClick={() => setIsOffline(!isOffline)}
      className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border cursor-pointer transition-all duration-300 shadow-sm ${
        isOffline 
          ? 'bg-amber-500/10 border-amber-500/20 text-amber-700' 
          : 'bg-leaf-green/10 border-leaf-green/20 text-leaf-green'
      }`}
    >
      <div className="relative flex items-center justify-center">
        {!isOffline && <div className="absolute w-2 h-2 bg-leaf-green rounded-full animate-ping opacity-75"></div>}
        <div className={`relative w-2 h-2 rounded-full ${isOffline ? 'bg-amber-500 shadow-[0_0_8px_#F59E0B]' : 'bg-leaf-green shadow-[0_0_8px_#3F6B4A]'}`}></div>
      </div>
      
      {isOffline ? (
        <span className="text-xs font-bold font-sans">Offline — using cached field data</span>
      ) : (
        <span className="text-xs font-bold font-sans">Online</span>
      )}
    </div>
  );
}
