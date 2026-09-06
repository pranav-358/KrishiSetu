import React, { useState } from 'react';
import { Sprout, Settings, Activity, Camera } from 'lucide-react';
import TelemetryDashboard from './components/TelemetryDashboard';
import DiagnosisScanner from './components/DiagnosisScanner';
import AdminDrawer from './components/AdminDrawer';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-husk-cream text-soil-ink font-sans">
      <nav className="bg-soil-ink text-husk-cream sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2 font-display font-semibold text-lg">
                <Sprout size={24} className="text-leaf-green" />
                <span>KrishiSetu</span>
              </div>
              
              <div className="flex space-x-6 h-full">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    currentView === 'dashboard'
                      ? 'border-wheat-gold text-husk-cream'
                      : 'border-transparent text-husk-cream/60 hover:text-husk-cream hover:border-husk-cream/30'
                  }`}
                >
                  <Activity size={16} className="mr-2" />
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentView('diagnosis')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    currentView === 'diagnosis'
                      ? 'border-wheat-gold text-husk-cream'
                      : 'border-transparent text-husk-cream/60 hover:text-husk-cream hover:border-husk-cream/30'
                  }`}
                >
                  <Camera size={16} className="mr-2" />
                  Scan Crop
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <button
                onClick={() => setAdminOpen(true)}
                className="p-2 text-husk-cream/60 hover:text-husk-cream hover:bg-husk-cream/5 rounded-full transition-colors"
                aria-label="Settings"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' ? <TelemetryDashboard /> : <DiagnosisScanner />}
      </main>

      <AdminDrawer open={adminOpen} onClose={() => setAdminOpen(false)} />
    </div>
  );
}