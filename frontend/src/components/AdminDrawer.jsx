import React, { useState, useEffect } from 'react';
import { X, Settings2, Activity, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';

export default function AdminDrawer({ open, onClose }) {
  const [controls, setControls] = useState({
    simulation_enabled: true,
    moisture_pct: 50,
    temperature: 25,
    humidity: 60
  });

  useEffect(() => {
    if (open) {
      api.getControls().then(res => setControls(res.data)).catch(console.error);
    }
  }, [open]);

  const applyControls = async () => {
    try {
      await api.updateControls(controls);
      onClose();
    } catch (err) {
      console.error("Control update failed:", err);
    }
  };

  const setPreset = (presetName) => {
    if (presetName === 'heat_stress') {
      setControls({ simulation_enabled: false, moisture_pct: 20, temperature: 42, humidity: 20 });
    } else if (presetName === 'normal') {
      setControls({ simulation_enabled: true, moisture_pct: 50, temperature: 25, humidity: 60 });
    }
  };

  const TechnicalSlider = ({ label, value, min, max, onChange, colorClass, disabled }) => {
    const percentage = ((value - min) / (max - min)) * 100;
    
    return (
      <div className={`mb-8 ${disabled ? 'opacity-50' : ''}`}>
        <div className="flex justify-between items-end mb-2">
          <label className="font-sans text-sm text-husk-cream">{label}</label>
          <span className="font-sans tabular-nums text-lg font-medium text-husk-cream">{value}</span>
        </div>
        <div className="relative h-2 w-full bg-soil-ink border border-husk-cream/20">
          <div 
            className={`absolute top-0 left-0 h-full ${colorClass.replace('text-', 'bg-')}`}
            style={{ width: `${percentage}%` }}
          ></div>
          <input 
            type="range" 
            min={min} 
            max={max} 
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            disabled={disabled}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div 
            className={`absolute top-1/2 -mt-2 w-4 h-4 bg-husk-cream border border-soil-ink pointer-events-none ${disabled ? 'hidden' : ''}`}
            style={{ left: `calc(${percentage}% - 8px)` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-soil-ink/20 z-[100] transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      ></div>

      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[380px] bg-soil-ink text-husk-cream z-[101] border-l border-husk-cream/20 flex flex-col transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-husk-cream/10">
          <div className="flex items-center space-x-3">
            <Settings2 className="text-wheat-gold" size={24} />
            <h2 className="font-display text-2xl text-husk-cream">Control center</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-husk-cream/70 hover:text-husk-cream transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-husk-cream/70 text-sm mb-8 font-sans">
            Override telemetry sensors to test system alerts and irrigation logic.
          </p>

          <div className="p-4 border border-husk-cream/10 mb-8 flex items-center justify-between">
            <div>
              <h3 className="font-sans font-medium text-husk-cream">Auto-simulation</h3>
              <p className="text-xs text-husk-cream/60 mt-1">Real-time diurnal cycle</p>
            </div>
            
            <button 
              className={`relative w-12 h-6 border border-husk-cream/30 transition-colors ${
                controls.simulation_enabled ? 'bg-leaf-green' : 'bg-transparent'
              }`}
              onClick={() => setControls(prev => ({ ...prev, simulation_enabled: !prev.simulation_enabled }))}
            >
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-husk-cream transition-transform ${
                controls.simulation_enabled ? 'translate-x-6' : 'translate-x-0'
              }`}></div>
            </button>
          </div>

          <div className="space-y-4">
            <TechnicalSlider 
              label="Soil moisture (%)" 
              value={controls.moisture_pct} 
              min={0} max={100} 
              onChange={(val) => setControls(prev => ({ ...prev, moisture_pct: val }))}
              colorClass="text-well-water-blue"
              disabled={controls.simulation_enabled}
            />

            <TechnicalSlider 
              label="Temperature (°C)" 
              value={controls.temperature} 
              min={10} max={50} 
              onChange={(val) => setControls(prev => ({ ...prev, temperature: val }))}
              colorClass="text-sindoor-rust"
              disabled={controls.simulation_enabled}
            />

            <TechnicalSlider 
              label="Humidity (%)" 
              value={controls.humidity} 
              min={0} max={100} 
              onChange={(val) => setControls(prev => ({ ...prev, humidity: val }))}
              colorClass="text-leaf-green"
              disabled={controls.simulation_enabled}
            />
          </div>

          <div className="mt-10">
            <h4 className="font-sans text-sm text-husk-cream/70 mb-3">Quick presets</h4>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setPreset('normal')}
                className="flex items-center space-x-3 px-5 py-3 bg-leaf-green text-husk-cream font-sans font-medium text-sm transition-colors hover:bg-leaf-green/90"
              >
                <Activity size={18} />
                <span>Conditions optimal</span>
              </button>
              <button 
                onClick={() => setPreset('heat_stress')}
                className="flex items-center space-x-3 px-5 py-3 bg-sindoor-rust text-white font-sans font-medium text-sm transition-colors hover:bg-sindoor-rust/90"
              >
                <AlertTriangle size={18} />
                <span>Critical heat and moisture stress</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-husk-cream/10 bg-soil-ink">
          <button 
            onClick={applyControls}
            className="w-full py-3 bg-wheat-gold text-soil-ink font-sans font-medium hover:bg-wheat-gold/90 transition-colors"
          >
            Apply conditions
          </button>
        </div>
      </div>
    </>
  );
}