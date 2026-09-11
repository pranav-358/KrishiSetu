import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Thermometer, Droplets, Wind, Search, Activity } from 'lucide-react';
import { api } from '../services/api';
import RiskForecastCard from './RiskForecastCard';

const CircularGaugeCard = ({ value, min = 0, max = 100, label, unit, colorClass, Icon }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(Math.max((value - min) / (max - min), 0), 1);
  const strokeDashoffset = circumference - (percentage * circumference);

  return (
    <div className="flex flex-row items-center justify-between sm:justify-center gap-4 sm:gap-6 lg:gap-8 p-5 sm:p-6 bg-white/70 backdrop-blur-2xl border border-soil-ink/10 rounded-3xl shadow-[0_8px_32px_rgba(43,36,25,0.05)] transition-all duration-300 hover:bg-white group">
      {/* Left side: Circular Gauge */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg className="transform -rotate-90 w-[100px] h-[100px] sm:w-[120px] sm:h-[120px]">
          {/* Responsive circle sizing via viewBox trick or scaling. For fixed radius, SVG scales based on CSS width/height if viewBox is set. Let's add viewBox to make it truly fluid inside its container. */}
          <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
            <circle cx="60" cy="60" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-soil-ink/5" />
            <circle cx="60" cy="60" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" 
              strokeDasharray={circumference} 
              strokeDashoffset={strokeDashoffset} 
              className={`${colorClass} transition-all duration-1000 ease-out`} 
              strokeLinecap="round" 
              style={{ filter: 'drop-shadow(0 0 4px currentColor)' }}
            />
          </svg>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span translate="no" className="text-xl sm:text-2xl font-display font-bold tabular-nums text-soil-ink whitespace-nowrap">
            {value.toFixed(1)}<span className="text-sm sm:text-base ml-0.5">{unit}</span>
          </span>
        </div>
      </div>
      
      {/* Right side: Icon and Label */}
      <div className="flex flex-col items-end sm:items-center justify-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-soil-ink/10 flex items-center justify-center mb-1 sm:mb-2 bg-white shadow-sm group-hover:scale-105 transition-transform duration-300">
          <Icon size={20} className={`sm:w-6 sm:h-6 ${colorClass}`} />
        </div>
        <h3 className="font-sans text-xs sm:text-sm font-medium text-soil-ink/80 text-right sm:text-center leading-tight">
          {label.split(' ').map((word, i) => (
            <span key={i} className="block">{word}</span>
          ))}
        </h3>
      </div>
    </div>
  );
};

export default function TelemetryDashboard({ isOffline, language = 'en' }) {
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(false);

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
        if (!current) {
          setError(true);
        }
      }
    };
    
    if (!isOffline) {
      fetchTelemetry();
      const interval = setInterval(fetchTelemetry, 5000);
      return () => clearInterval(interval);
    } else {
      // Simulate cached data if offline
      setCurrent({ moisture_pct: 42.5, temperature: 31.2, humidity: 55.4 });
      setHistory(Array.from({length: 24}).map((_, i) => ({ time: `${i}:00`, moisture_pct: 40 + Math.random() * 10 })));
    }
  }, [isOffline]);

  if (error && !current) return (
    <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-soil-ink/60">
      <div className="mb-4 text-sindoor-rust">
        <Activity size={32} />
      </div>
      <p>Unable to connect to backend.</p>
      <p className="text-sm">Please ensure the backend is running.</p>
    </div>
  );

  if (!current) return (
    <div className="flex items-center justify-center h-full min-h-[50vh]">
      <div className="w-8 h-8 border-4 border-soil-ink/10 border-t-well-water-blue rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col space-y-6 sm:space-y-8 animate-in fade-in duration-700 pb-28 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 max-w-7xl mx-auto">
      
      {/* 1. Header Area */}
      <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-soil-ink font-semibold leading-tight tracking-tight">Field Overview</h1>
          <div className="flex items-center space-x-2 mt-3 sm:mt-4">
            <p className="font-sans text-soil-ink/60 text-xs sm:text-sm">Updated just now</p>
            {isOffline && (
              <>
                <span className="text-soil-ink/30">•</span>
                <p className="font-sans text-amber-600/80 font-medium text-xs sm:text-sm flex items-center">
                  <Activity size={12} className="mr-1" />
                  {language === 'hi' ? 'आखिरी बार 4 घंटे पहले सिंक हुआ' : 'Last synced 4 hours ago'}
                </p>
              </>
            )}
          </div>
        </div>
        
        {/* Premium Status Chip */}
        <div className="self-start sm:self-auto inline-flex items-center space-x-2 sm:space-x-3 px-4 sm:px-5 py-2 sm:py-2.5 bg-white backdrop-blur-md border border-soil-ink/10 rounded-full shadow-sm">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-2.5 h-2.5 sm:w-3 sm:h-3 bg-leaf-green rounded-full animate-ping opacity-75"></div>
            <div className="relative w-1.5 h-1.5 sm:w-2 sm:h-2 bg-leaf-green rounded-full shadow-[0_0_8px_#3F6B4A]"></div>
          </div>
          <span className="font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest text-soil-ink">Sector Alpha</span>
        </div>
      </header>

      {/* Priority Risk Forecast */}
      <RiskForecastCard type="heat" language={language} />

      {/* 2. Glassmorphism Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        <CircularGaugeCard value={current.moisture_pct} min={0} max={100} label="Soil Moisture" unit="%" colorClass="text-well-water-blue" Icon={Droplets} />
        <CircularGaugeCard value={current.temperature} min={10} max={50} label="Temperature" unit="°C" colorClass="text-sindoor-rust" Icon={Thermometer} />
        <CircularGaugeCard value={current.humidity} min={0} max={100} label="Humidity" unit="%" colorClass="text-leaf-green" Icon={Wind} />
        <CircularGaugeCard value={6.5} min={0} max={14} label="Soil pH" unit="" colorClass="text-leaf-green" Icon={Activity} />
      </div>

      {/* 3. Trends Area Chart */}
      <div className="bg-white/70 backdrop-blur-2xl border border-soil-ink/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 flex flex-col shadow-[0_8px_32px_rgba(43,36,25,0.05)]">
        <h2 className="font-sans font-bold text-base sm:text-lg text-soil-ink mb-4 sm:mb-6">24-Hour Soil Moisture Trends</h2>
        
        <div className="w-full h-64 sm:h-[350px] font-sans text-xs sm:text-sm tabular-nums">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
                tick={{ fill: '#2B2419', opacity: 0.6, fontSize: 11 }} 
                dy={10} 
                minTickGap={40}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#2B2419', opacity: 0.6, fontSize: 11 }} 
              />
              
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', color: '#2B2419', border: '1px solid rgba(43,36,25,0.1)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(43,36,25,0.1)', fontSize: '12px' }}
                itemStyle={{ color: '#2B2419' }}
                labelStyle={{ color: '#E8B84B', marginBottom: '6px', fontWeight: 'bold' }}
              />
              
              <Area type="monotone" dataKey="moisture_pct" name="Moisture (%)" stroke="#3E6E8E" strokeWidth={2.5} fillOpacity={1} fill="url(#moistureGradient)" style={{ filter: 'drop-shadow(0 4px 6px rgba(62,110,142,0.2))' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>



    </div>
  );
}