import React, { useState } from 'react';
import { Sprout, Settings, Activity, Camera } from 'lucide-react';
import TelemetryDashboard from './components/TelemetryDashboard';
import DiagnosisScanner from './components/DiagnosisScanner';
import AdminDrawer from './components/AdminDrawer';
import LandingPage from './components/LandingPage';

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [adminOpen, setAdminOpen] = useState(false);

  if (!hasStarted) {
    return <LandingPage onGetStarted={() => setHasStarted(true)} />;
  }

  return (
    <div className="min-h-screen flex bg-husk-cream text-soil-ink font-sans overflow-hidden">
      {/* Premium Dark Sidebar */}
      <aside className="w-64 h-screen bg-gradient-to-b from-soil-ink to-[#1E1911] text-husk-cream shadow-[4px_0_24px_rgba(0,0,0,0.15)] flex flex-col justify-between shrink-0 relative z-50 border-r border-soil-ink/50">
        <div className="p-6">
          <div 
            className="flex items-center space-x-3 font-display font-bold text-2xl mb-12 cursor-pointer group"
            onClick={() => setHasStarted(false)}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-husk-cream shadow-[0_0_15px_rgba(245,239,230,0.15)] group-hover:shadow-[0_0_20px_rgba(245,239,230,0.3)] transition-all duration-300">
              <Sprout size={22} className="text-leaf-green" />
            </div>
            <span className="tracking-wide">KrishiSetu</span>
          </div>

          <nav className="space-y-3">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`w-full flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                currentView === 'dashboard'
                  ? 'bg-husk-cream/10 text-husk-cream font-medium shadow-inner border border-husk-cream/5'
                  : 'text-husk-cream/50 hover:text-husk-cream hover:bg-husk-cream/5 border border-transparent'
              }`}
            >
              <Activity size={20} className={currentView === 'dashboard' ? 'text-well-water-blue' : ''} />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setCurrentView('diagnosis')}
              className={`w-full flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                currentView === 'diagnosis'
                  ? 'bg-husk-cream/10 text-husk-cream font-medium shadow-inner border border-husk-cream/5'
                  : 'text-husk-cream/50 hover:text-husk-cream hover:bg-husk-cream/5 border border-transparent'
              }`}
            >
              <Camera size={20} className={currentView === 'diagnosis' ? 'text-well-water-blue' : ''} />
              <span>Scan Crop</span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          <button
            onClick={() => setAdminOpen(true)}
            className="w-full flex items-center space-x-4 px-4 py-3.5 rounded-2xl text-husk-cream/50 hover:text-husk-cream hover:bg-husk-cream/5 transition-all duration-300 border border-transparent"
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto relative">
        {/* Subtle topography background lines (simulated with radial gradient) */}
        <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #2B2419 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto p-8 h-full flex flex-col">
          {currentView === 'dashboard' ? <TelemetryDashboard /> : <DiagnosisScanner />}
        </div>
      </main>

      <AdminDrawer open={adminOpen} onClose={() => setAdminOpen(false)} />
    </div>
  );
}