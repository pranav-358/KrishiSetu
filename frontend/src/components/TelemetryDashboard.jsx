import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { Sprout, CheckCircle2, AlertTriangle, CloudRain, Thermometer, Droplets } from 'lucide-react';
import { api } from '../services/api';

const RadialGauge = ({ value, label, unit }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center p-6 bg-white border border-soil-ink/10">
      <div className="relative flex items-center justify-center">
        <svg className="transform -rotate-90 w-32 h-32">
          <circle cx="64" cy="64" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-soil-ink/10" />
          <circle cx="64" cy="64" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="text-well-water-blue transition-all duration-1000 ease-out" strokeLinecap="round" />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-sans font-medium tabular-nums text-soil-ink">{value.toFixed(1)}</span>
          <span className="text-sm font-sans text-soil-ink/60">{unit}</span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <h3 className="font-display text-lg text-soil-ink">{label}</h3>
      </div>
    </div>
  );
};

const ThermometerBar = ({ value, label, unit }) => {
  const isHot = value > 35;
  const heightPct = Math.min(Math.max((value / 50) * 100, 0), 100);

  return (
    <div className="flex flex-col items-center p-6 bg-white border border-soil-ink/10">
      <div className="relative h-32 w-12 bg-soil-ink/5 rounded-full border border-soil-ink/10 flex items-end p-1">
        <div 
          className="w-full rounded-full transition-all duration-1000 ease-out bg-sindoor-rust" 
          style={{ height: `${heightPct}%` }}
        />
      </div>
      <div className="mt-6 text-center">
        <span className="text-3xl font-sans font-medium tabular-nums text-soil-ink block">{value.toFixed(1)}{unit}</span>
        <h3 className="font-display text-lg text-soil-ink mt-1">{label}</h3>
      </div>
    </div>
  );
};

const WaveArc = ({ value, label, unit }) => {
  return (
    <div className="flex flex-col items-center p-6 bg-white border border-soil-ink/10">
      <div className="relative flex items-center justify-center w-32 h-32">
        <svg viewBox="0 0 100 50" className="w-full">
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="currentColor" strokeWidth="8" className="text-soil-ink/10" strokeLinecap="round" />
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="currentColor" strokeWidth="8" className="text-leaf-green transition-all duration-1000 ease-out" strokeLinecap="round" strokeDasharray="125.6" strokeDashoffset={125.6 - (value/100)*125.6} />
        </svg>
        <div className="absolute bottom-0 flex flex-col items-center translate-y-4">
          <span className="text-3xl font-sans font-medium tabular-nums text-soil-ink">{value.toFixed(1)}</span>
          <span className="text-sm font-sans text-soil-ink/60">{unit}</span>
        </div>
      </div>
      <div className="mt-8 text-center">
        <h3 className="font-display text-lg text-soil-ink">{label}</h3>
      </div>
    </div>
  );
};

export default function TelemetryDashboard() {
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);
  const [timeRange, setTimeRange] = useState('24h');

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
    <div className="space-y-6">
      <div className="h-24 bg-soil-ink/10 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-64 bg-soil-ink/5 animate-pulse" />
        <div className="h-64 bg-soil-ink/5 animate-pulse" />
        <div className="h-64 bg-soil-ink/5 animate-pulse" />
      </div>
      <div className="h-96 bg-soil-ink/5 animate-pulse" />
    </div>
  );

  const hasHeatStress = current.temperature > 35;
  const hasLowMoisture = current.moisture_pct < 30;

  let statusMessage = "Conditions optimal — no action needed";
  let StatusIcon = CheckCircle2;
  let statusColor = "bg-leaf-green text-husk-cream";

  if (hasHeatStress && hasLowMoisture) {
    statusMessage = "Critical heat and moisture stress — irrigate immediately";
    StatusIcon = AlertTriangle;
    statusColor = "bg-sindoor-rust text-white";
  } else if (hasHeatStress) {
    statusMessage = "Heat stress — irrigate soon";
    StatusIcon = AlertTriangle;
    statusColor = "bg-sindoor-rust text-white";
  } else if (hasLowMoisture) {
    statusMessage = "Low soil moisture — schedule irrigation";
    StatusIcon = AlertTriangle;
    statusColor = "bg-wheat-gold text-soil-ink";
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* 1. Status Band */}
      <div className="bg-soil-ink text-husk-cream p-6 sm:p-8 relative overflow-hidden">
        {/* Subtle topographic/grain texture SVG overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#F7F1E4 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-wheat-gold mb-2">
              <Sprout size={20} />
              <span className="font-sans font-medium uppercase tracking-wider text-sm">Sector Alpha &middot; Wheat</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl text-husk-cream">Field Overview</h1>
            <p className="font-sans text-husk-cream/70 mt-2 tabular-nums">Updated just now</p>
          </div>
          
          <div className={`inline-flex items-center space-x-3 px-5 py-4 ${statusColor} self-start`}>
            <StatusIcon size={24} />
            <span className="font-sans font-medium text-lg">{statusMessage}</span>
          </div>
        </div>
      </div>

      {/* 2. Telemetry Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RadialGauge value={current.moisture_pct} label="Soil moisture" unit="%" />
        <ThermometerBar value={current.temperature} label="Temperature" unit="°C" />
        <WaveArc value={current.humidity} label="Humidity" unit="%" />
      </div>

      {/* 3. Trends Chart */}
      <div className="border border-soil-ink/10 bg-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h2 className="font-display text-2xl text-soil-ink">24-Hour Trends</h2>
          <div className="flex font-sans text-sm border border-soil-ink/20 bg-husk-cream/30">
            <button className={`px-4 py-2 font-medium ${timeRange === '24h' ? 'bg-soil-ink text-husk-cream' : 'text-soil-ink hover:bg-soil-ink/5'}`} onClick={() => setTimeRange('24h')}>24h</button>
            <button className={`px-4 py-2 font-medium border-l border-soil-ink/20 ${timeRange === '7d' ? 'bg-soil-ink text-husk-cream' : 'text-soil-ink hover:bg-soil-ink/5'}`} onClick={() => setTimeRange('7d')}>7d</button>
            <button className={`px-4 py-2 font-medium border-l border-soil-ink/20 ${timeRange === '30d' ? 'bg-soil-ink text-husk-cream' : 'text-soil-ink hover:bg-soil-ink/5'}`} onClick={() => setTimeRange('30d')}>30d</button>
          </div>
        </div>

        <div className="h-80 w-full font-sans text-sm tabular-nums">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3E6E8E" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3E6E8E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C1440E" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#C1440E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2B2419" strokeOpacity={0.1} />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#2B2419', opacity: 0.6 }} dy={10} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#2B2419', opacity: 0.6 }} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#2B2419', opacity: 0.6 }} />
              
              <Tooltip
                contentStyle={{ backgroundColor: '#2B2419', color: '#F7F1E4', border: 'none', borderRadius: '0' }}
                itemStyle={{ color: '#F7F1E4' }}
                labelStyle={{ color: '#E8B84B', marginBottom: '8px' }}
              />
              
              <ReferenceLine y={30} yAxisId="left" stroke="#C1440E" strokeDasharray="4 4" label={{ position: 'insideTopLeft', value: 'Moisture stress line', fill: '#C1440E', fontSize: 12, dy: -10 }} />
              
              <Area yAxisId="left" type="monotone" dataKey="moisture_pct" name="Moisture (%)" stroke="#3E6E8E" strokeWidth={2} fillOpacity={1} fill="url(#moistureGradient)" />
              <Area yAxisId="right" type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#C1440E" strokeWidth={2} fillOpacity={1} fill="url(#tempGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}