import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { Sprout, CheckCircle2, AlertTriangle, CloudRain, Thermometer, Droplets, Wind, Search } from 'lucide-react';
import { api } from '../services/api';

const CircularGaugeCard = ({ value, min = 0, max = 100, label, unit, colorClass, Icon }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(Math.max((value - min) / (max - min), 0), 1);
  const strokeDashoffset = circumference - (percentage * circumference);

  return (
    <div className="flex items-center justify-center gap-8 p-6 bg-white/70 backdrop-blur-2xl border border-soil-ink/10 rounded-3xl shadow-[0_8px_32px_rgba(43,36,25,0.05)] transition-all duration-300 hover:bg-white group">
      {/* Left side: Circular Gauge */}
      <div className="relative flex items-center justify-center">
        <svg className="transform -rotate-90 w-[120px] h-[120px]">
          <circle cx="60" cy="60" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-soil-ink/5" />
          <circle cx="60" cy="60" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            className={`${colorClass} transition-all duration-1000 ease-out`} 
            strokeLinecap="round" 
            style={{ filter: 'drop-shadow(0 0 4px currentColor)' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-display font-bold tabular-nums text-soil-ink">{value.toFixed(1)}{unit}</span>
        </div>
      </div>
      
      {/* Right side: Icon and Label */}
      <div className="flex flex-col items-center justify-center">
        <div className={`w-14 h-14 rounded-full border border-soil-ink/10 flex items-center justify-center mb-2 bg-white shadow-sm group-hover:scale-105 transition-transform duration-300`}>
          <Icon size={24} className={colorClass} />
        </div>
        <h3 className="font-sans text-sm font-medium text-soil-ink/80 text-center leading-tight">
          {label.split(' ').map((word, i) => (
            <span key={i} className="block">{word}</span>
          ))}
        </h3>
      </div>
    </div>
  );
};

export default function TelemetryDashboard() {
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const [latestRes, histRes] = await Promise.all([
          api.getLatestTelemetry(),
          api.getTelemetryHistory(24)
        ]);
        setCurrent(latestRes.data);
        setHistory(histRes.data.map(d => ({
          ...d,
          time: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })));
      } catch (err) {
        console.error("Telemetry fetch error:", err);
      }
    };
    
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!current) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-4 border-soil-ink/10 border-t-well-water-blue rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700 pb-24">
      
      {/* 1. Header Area */}
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl text-soil-ink font-bold">Field Overview</h1>
          <p className="font-sans text-soil-ink/60 mt-2 text-sm">Updated just now</p>
        </div>
        
        {/* Premium Status Chip Top Right */}
        <div className="inline-flex items-center space-x-3 px-5 py-2.5 bg-white backdrop-blur-md border border-soil-ink/10 rounded-full shadow-sm">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-3 h-3 bg-leaf-green rounded-full animate-ping opacity-75"></div>
            <div className="relative w-2 h-2 bg-leaf-green rounded-full shadow-[0_0_8px_#3F6B4A]"></div>
          </div>
          <span className="font-sans font-bold text-xs uppercase tracking-widest text-soil-ink">Sector Alpha &middot; Wheat</span>
        </div>
      </header>

      {/* 2. Glassmorphism Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        <CircularGaugeCard value={current.moisture_pct} min={0} max={100} label="Soil Moisture" unit="%" colorClass="text-well-water-blue" Icon={Droplets} />
        <CircularGaugeCard value={current.temperature} min={10} max={50} label="Temperature" unit="°C" colorClass="text-sindoor-rust" Icon={Thermometer} />
        <CircularGaugeCard value={current.humidity} min={0} max={100} label="Humidity" unit="%" colorClass="text-leaf-green" Icon={Wind} />
      </div>

      {/* 3. Trends Area Chart */}
      <div className="flex-1 min-h-[400px] bg-white/70 backdrop-blur-2xl border border-soil-ink/10 rounded-3xl p-6 sm:p-8 flex flex-col shadow-[0_8px_32px_rgba(43,36,25,0.05)]">
        <h2 className="font-sans font-bold text-lg text-soil-ink mb-6">24-Hour Trends</h2>
        
        <div className="flex-1 w-full font-sans text-sm tabular-nums">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
              <defs>
                <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3E6E8E" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3E6E8E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#2B2419', opacity: 0.6, fontSize: 12 }} 
                dy={10} 
                minTickGap={60}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#2B2419', opacity: 0.6, fontSize: 12 }} />
              
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', color: '#2B2419', border: '1px solid rgba(43,36,25,0.1)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(43,36,25,0.1)' }}
                itemStyle={{ color: '#2B2419' }}
                labelStyle={{ color: '#E8B84B', marginBottom: '8px', fontWeight: 'bold' }}
              />
              
              <Area type="monotone" dataKey="moisture_pct" name="Moisture (%)" stroke="#3E6E8E" strokeWidth={3} fillOpacity={1} fill="url(#moistureGradient)" style={{ filter: 'drop-shadow(0 4px 6px rgba(62,110,142,0.2))' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Floating Bottom Dock */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center pointer-events-none z-50">
        <div className="bg-white/80 backdrop-blur-3xl border border-soil-ink/10 shadow-[0_10px_40px_rgba(43,36,25,0.15)] rounded-full px-6 py-3 flex items-center justify-between pointer-events-auto min-w-[300px]">
          <button className="text-soil-ink/70 hover:text-soil-ink transition-colors">
            <Search size={20} />
          </button>
          
          <div className="flex items-center space-x-3 text-xs font-mono font-medium text-soil-ink/80 ml-8">
            <span>ENG | IN</span>
            <span className="w-1 h-1 rounded-full bg-soil-ink/20"></span>
            <span>17:44</span>
            <span className="w-1 h-1 rounded-full bg-soil-ink/20"></span>
            <span>08-09-2026</span>
          </div>
        </div>
      </div>

    </div>
  );
}