import React from 'react';
import { Languages } from 'lucide-react';

export default function LanguageToggle({ language, setLanguage }) {
  return (
    <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 shadow-sm w-max mb-4">
      <Languages size={16} className="text-husk-cream/80" />
      <button 
        onClick={() => setLanguage('en')}
        className={`text-xs font-bold font-sans transition-colors ${language === 'en' ? 'text-husk-cream' : 'text-husk-cream/40 hover:text-husk-cream/80'}`}
      >
        ENG
      </button>
      <span className="text-husk-cream/20 text-xs">|</span>
      <button 
        onClick={() => setLanguage('hi')}
        className={`text-xs font-bold font-sans transition-colors ${language === 'hi' ? 'text-husk-cream' : 'text-husk-cream/40 hover:text-husk-cream/80'}`}
      >
        HIN
      </button>
    </div>
  );
}
