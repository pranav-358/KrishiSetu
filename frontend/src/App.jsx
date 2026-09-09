import React, { useState } from 'react';
import { Sprout, Settings, Activity, Camera, Menu, X } from 'lucide-react';
import TelemetryDashboard from './components/TelemetryDashboard';
import DiagnosisScanner from './components/DiagnosisScanner';
import AdminDrawer from './components/AdminDrawer';
import LandingPage from './components/LandingPage';

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [adminOpen, setAdminOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!hasStarted) {
    return <LandingPage onGetStarted={() => setHasStarted(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-husk-cream text-soil-ink font-sans overflow-hidden">
      
      {/* 1. MOBILE TOP HEADER (Visible only on mobile/tablet) */}
      <div className="flex md:hidden items-center justify-between bg-soil-ink text-husk-cream px-6 py-4 shrink-0 z-40 border-b border-soil-ink/50">
        <div 
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => setHasStarted(false)}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-husk-cream">
            <Sprout size={18} className="text-leaf-green" />
          </div>
          <span className="font-display font-bold text-xl tracking-wide">KrishiSetu</span>
        </div>

        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-husk-cream hover:bg-husk-cream/10 rounded-xl transition-colors"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* 2. PREMIUM SIDEBAR (Responsive drawer on mobile, static sidebar on PC) */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 h-screen bg-gradient-to-b from-soil-ink to-[#1E1911] text-husk-cream 
        shadow-[4px_0_24px_rgba(0,0,0,0.15)] flex flex-col justify-between shrink-0 
        border-r border-soil-ink/50
        transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6">
          <div 
            className="hidden md:flex items-center space-x-3 font-display font-bold text-2xl mb-12 cursor-pointer group"
            onClick={() => { setHasStarted(false); setMobileMenuOpen(false); }}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-husk-cream shadow-[0_0_15px_rgba(245,239,230,0.15)] group-hover:shadow-[0_0_20px_rgba(245,239,230,0.3)] transition-all duration-300">
              <Sprout size={22} className="text-leaf-green" />
            </div>
            <span className="tracking-wide">KrishiSetu</span>
          </div>

          <nav className="space-y-3 mt-4 md:mt-0">
            <button
              onClick={() => { setCurrentView('dashboard'); setMobileMenuOpen(false); }}
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
              onClick={() => { setCurrentView('diagnosis'); setMobileMenuOpen(false); }}
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
            onClick={() => { setAdminOpen(true); setMobileMenuOpen(false); }}
            className="w-full flex items-center space-x-4 px-4 py-3.5 rounded-2xl text-husk-cream/50 hover:text-husk-cream hover:bg-husk-cream/5 transition-all duration-300 border border-transparent"
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* 3. MAIN CONTENT AREA (Takes 100% width on mobile, remaining width on PC) */}
      <main className="flex-1 h-[calc(100vh-65px)] md:h-screen overflow-y-auto relative w-full">
        {/* Subtle topography background lines */}
        <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #2B2419 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="relative z-10 w-full h-full flex flex-col">
          {currentView === 'dashboard' ? <TelemetryDashboard /> : <DiagnosisScanner />}
        </div>
      </main>

      <AdminDrawer open={adminOpen} onClose={() => setAdminOpen(false)} />
    </div>
  );
}