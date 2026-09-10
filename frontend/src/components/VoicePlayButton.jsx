import React, { useState, useEffect } from 'react';
import { Volume2, Square } from 'lucide-react';

export default function VoicePlayButton({ text, language = "en" }) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleToggle = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      if (!text) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <button 
      onClick={handleToggle}
      className={`relative inline-flex items-center justify-center space-x-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 shadow-sm border whitespace-nowrap shrink-0 ${
        isPlaying 
          ? 'bg-sindoor-rust/10 border-sindoor-rust/20 text-sindoor-rust' 
          : 'bg-white border-soil-ink/10 text-soil-ink hover:bg-soil-ink/5'
      }`}
    >
      {isPlaying && (
        <span className="absolute inset-0 rounded-full animate-ping bg-sindoor-rust/20"></span>
      )}
      
      {isPlaying ? (
        <Square size={14} className="relative z-10 fill-current" />
      ) : (
        <Volume2 size={14} className="relative z-10" />
      )}
      <span className="relative z-10">
        {isPlaying ? (language === 'hi' ? 'रोकें' : 'Stop') : (language === 'hi' ? 'सुनें' : 'Listen')}
      </span>
    </button>
  );
}
