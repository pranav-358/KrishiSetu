import React, { useState } from 'react';
import { Sprout, Settings, Activity, Camera, Menu, X, Sparkles } from 'lucide-react';
import TelemetryDashboard from './components/TelemetryDashboard';
import DiagnosisScanner from './components/DiagnosisScanner';
import AdminDrawer from './components/AdminDrawer';
import LandingPage from './components/LandingPage';
import AIAdvisory from './components/AIAdvisory';
import LanguageToggle from './components/LanguageToggle';
import SyncStatusToggle from './components/SyncStatusToggle';

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [adminOpen, setAdminOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [advisoryDisease, setAdvisoryDisease] = useState('');
  const [language, setLanguage] = useState('en');
  const [isOffline, setIsOffline] = useState(false);

  if (!hasStarted) {
    return <LandingPage onGetStarted={() => setHasStarted(true)} />;
  }

  // Active state nav item class generator
  const getNavClass = (viewName) => {
    return `flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300 ${
      currentView === viewName
        ? 'bg-husk-cream/10 text-husk-cream font-medium shadow-inner'
        : 'text-husk-cream/60 hover:text-husk-cream hover:bg-husk-cream/5'
    }`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-husk-cream text-soil-ink font-sans relative">
      
      {/* STICKY TOP NAV BAR */}
      <header className="sticky top-0 z-50 w-full bg-soil-ink text-husk-cream shadow-md border-b border-soil-ink/10">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Left Side: Logo & Desktop Nav */}
          <div className="flex items-center">
            {/* Logo */}
            <div 
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group mr-6 sm:mr-10"
              onClick={() => { setHasStarted(false); setMobileMenuOpen(false); }}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-husk-cream shadow-sm group-hover:shadow-[0_0_15px_rgba(245,239,230,0.3)] transition-all">
                <Sprout size={18} className="text-leaf-green" />
              </div>
              <span className="font-serif font-semibold text-lg sm:text-xl tracking-tight">AgriEdge</span>
            </div>

            {/* Desktop Nav Links (hidden on mobile) */}
            <nav className="hidden lg:flex items-center space-x-2">
              <button onClick={() => setCurrentView('dashboard')} className={getNavClass('dashboard')}>
                <Activity size={18} className={currentView === 'dashboard' ? 'text-well-water-blue' : ''} />
                <span>Dashboard</span>
              </button>
              <button onClick={() => setCurrentView('diagnosis')} className={getNavClass('diagnosis')}>
                <Camera size={18} className={currentView === 'diagnosis' ? 'text-well-water-blue' : ''} />
                <span>Scan Crop</span>
              </button>
              <button onClick={() => setCurrentView('advisory')} className={getNavClass('advisory')}>
                <Sparkles size={18} className={currentView === 'advisory' ? 'text-well-water-blue' : ''} />
                <span>AI Advisory</span>
              </button>
            </nav>
          </div>

          {/* Right Side: Controls */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            <div className="hidden sm:block">
              <SyncStatusToggle isOffline={isOffline} setIsOffline={setIsOffline} />
            </div>
            
            <div className="hidden sm:block">
              <LanguageToggle language={language} setLanguage={setLanguage} />
            </div>

            <button
              onClick={() => setAdminOpen(true)}
              className="p-2 text-husk-cream/60 hover:text-husk-cream hover:bg-husk-cream/10 rounded-xl transition-colors"
              title="Settings"
            >
              <Settings size={20} />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-husk-cream hover:bg-husk-cream/10 rounded-xl transition-colors ml-1"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay Dropdown */}
      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 top-16 bg-soil-ink/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 bg-soil-ink border-b border-soil-ink/20 z-50 lg:hidden shadow-xl p-4 flex flex-col space-y-2 animate-in slide-in-from-top-2">
            <button
              onClick={() => { setCurrentView('dashboard'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all ${
                currentView === 'dashboard' ? 'bg-husk-cream/10 text-husk-cream font-medium' : 'text-husk-cream/60 hover:bg-husk-cream/5'
              }`}
            >
              <Activity size={20} className={currentView === 'dashboard' ? 'text-well-water-blue' : ''} />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => { setCurrentView('diagnosis'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all ${
                currentView === 'diagnosis' ? 'bg-husk-cream/10 text-husk-cream font-medium' : 'text-husk-cream/60 hover:bg-husk-cream/5'
              }`}
            >
              <Camera size={20} className={currentView === 'diagnosis' ? 'text-well-water-blue' : ''} />
              <span>Scan Crop</span>
            </button>
            <button
              onClick={() => { setCurrentView('advisory'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all ${
                currentView === 'advisory' ? 'bg-husk-cream/10 text-husk-cream font-medium' : 'text-husk-cream/60 hover:bg-husk-cream/5'
              }`}
            >
              <Sparkles size={20} className={currentView === 'advisory' ? 'text-well-water-blue' : ''} />
              <span>AI Advisory</span>
            </button>
            
            <div className="h-px bg-husk-cream/10 my-2 sm:hidden" />
            
            <div className="flex sm:hidden items-center justify-between px-4 py-2">
              <span className="text-husk-cream/60 text-sm">Language</span>
              <LanguageToggle language={language} setLanguage={setLanguage} />
            </div>
            <div className="flex sm:hidden items-center justify-between px-4 py-2">
              <span className="text-husk-cream/60 text-sm">Sync Status</span>
              <SyncStatusToggle isOffline={isOffline} setIsOffline={setIsOffline} />
            </div>
          </div>
        </>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full relative">
        {/* Subtle topography background lines */}
        <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #2B2419 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="relative z-10 w-full h-full p-4 md:p-8 pb-20">
          {currentView === 'dashboard' && <TelemetryDashboard isOffline={isOffline} language={language} />}
          {currentView === 'diagnosis' && (
            <DiagnosisScanner 
              language={language}
              isOffline={isOffline}
              onGetTreatment={(disease) => {
                setAdvisoryDisease(disease);
                setCurrentView('advisory');
              }} 
            />
          )}
          {currentView === 'advisory' && <AIAdvisory initialDisease={advisoryDisease} language={language} isOffline={isOffline} />}
        </div>
      </main>

      <AdminDrawer open={adminOpen} onClose={() => setAdminOpen(false)} />
    </div>
  );
}