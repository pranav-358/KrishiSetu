import React, { useState, useEffect } from 'react';
import { Sprout, ArrowRight, Radio, Bell, Droplets } from 'lucide-react';

export default function LandingPage({ onGetStarted }) {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'how-it-works', 'sensors', 'join-us'];
      let current = 'home';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getNavLinkClass = (section) => {
    const baseClass = "px-4 py-1.5 rounded-full transition-all duration-300";
    if (activeSection === section) {
      return `${baseClass} text-soil-ink bg-wheat-gold/30 hover:scale-105`;
    }
    return `${baseClass} hover:text-soil-ink hover:bg-soil-ink/5`;
  };

  return (
    <div id="home" className="min-h-screen bg-husk-cream text-soil-ink font-sans selection:bg-wheat-gold/30">
      
      {/* 1. Floating Nav Pill (Kept the new styling & shadow) */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <nav className="bg-white/90 backdrop-blur-md shadow-[0_20px_50px_rgba(43,36,25,0.15)] border border-soil-ink/10 rounded-full px-8 py-4 flex items-center justify-between w-full max-w-5xl transition-all duration-500 hover:shadow-[0_25px_60px_rgba(43,36,25,0.2)]">
          <div className="flex items-center space-x-2 font-display font-bold text-xl cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <Sprout size={28} className="text-leaf-green" />
            <span className="tracking-tight">AgriEdge</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-2 font-medium text-sm text-soil-ink/80">
            <a href="#home" onClick={() => setActiveSection('home')} className={getNavLinkClass('home')}>Home</a>
            <a href="#how-it-works" onClick={() => setActiveSection('how-it-works')} className={getNavLinkClass('how-it-works')}>How it works</a>
            <a href="#sensors" onClick={() => setActiveSection('sensors')} className={getNavLinkClass('sensors')}>Sensors</a>
            <a href="#join-us" onClick={() => setActiveSection('join-us')} className={getNavLinkClass('join-us')}>Join Us</a>
          </div>
          
          <div className="flex items-center space-x-6">
            <button onClick={onGetStarted} className="hidden sm:block text-sm font-medium hover:text-leaf-green transition-colors">Sign in</button>
            <button 
              onClick={onGetStarted} 
              className="bg-wheat-gold text-soil-ink px-6 py-2.5 rounded-full font-bold text-sm shadow-lg hover:bg-[#F5CB60] hover:-translate-y-0.5 transition-all duration-300"
            >
              Get started
            </button>
          </div>
        </nav>
      </div>

      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-24">
        
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-700">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center space-x-2 bg-white border border-soil-ink/10 rounded-full px-4 py-1.5">
            <div className="w-2 h-2 rounded-full bg-leaf-green animate-pulse"></div>
            <span className="text-sm font-medium text-soil-ink uppercase tracking-wide">Live field monitoring</span>
          </div>
          
          {/* Headline */}
          <h1 className="font-sans text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.05] tracking-tighter text-soil-ink">
            Know your field's exact condition <br className="hidden md:block"/> before you step into it.
          </h1>
          
          {/* Subhead */}
          <p className="text-lg sm:text-xl text-soil-ink/70 max-w-2xl mx-auto leading-relaxed">
            AgriEdge combines real-time IoT soil sensors with an AI leaf-scanning tool to give Indian farmers precise, actionable irrigation and disease alerts—saving water and protecting yields.
          </p>
          
          {/* Primary CTA */}
          <div className="pt-6 flex justify-center">
            <button 
              onClick={onGetStarted} 
              className="group relative inline-flex items-center space-x-3 bg-gradient-to-r from-soil-ink to-[#3A3122] text-husk-cream px-10 py-4 rounded-full font-bold text-lg shadow-[0_10px_30px_rgba(43,36,25,0.25)] hover:shadow-[0_15px_40px_rgba(43,36,25,0.35)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Subtle shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
              
              <span className="relative z-10">View live dashboard</span>
              <ArrowRight size={22} className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
          </div>
        </section>

        {/* Hero Image */}
        <section className="relative w-full rounded-3xl overflow-hidden shadow-2xl animate-in fade-in duration-1000 delay-300">
          <img 
            src="/hero-field.png" 
            alt="Healthy Indian crop field monitored by AgriEdge" 
            className="w-full h-[500px] object-cover"
          />
          {/* Gradient Scrim for text readability */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-soil-ink/80 to-transparent"></div>
          
          {/* Bottom Left Callout */}
          <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 text-husk-cream">
            <p className="font-display text-xl font-bold">Built for Indian Agriculture.</p>
            <p className="font-sans text-sm text-husk-cream/80 mt-1">Rugged sensors, actionable data.</p>
          </div>
          
          {/* Bottom Right Callout */}
          <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10">
            <button onClick={onGetStarted} className="bg-white/10 backdrop-blur-md border border-white/20 text-husk-cream px-6 py-3 rounded-full font-medium text-sm hover:bg-white/20 transition-colors">
              See a live sector demo
            </button>
          </div>
        </section>

        {/* Stats Strip */}
        <section id="sensors" className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-soil-ink/10">
          <div className="text-center space-y-2">
            <div className="font-display text-4xl sm:text-5xl font-bold tabular-nums">4,200+</div>
            <div className="font-sans text-soil-ink/70 font-medium">Active sensors deployed</div>
          </div>
          <div className="text-center space-y-2">
            <div className="font-display text-4xl sm:text-5xl font-bold tabular-nums">1,850</div>
            <div className="font-sans text-soil-ink/70 font-medium">Sectors monitored</div>
          </div>
          <div className="text-center space-y-2">
            <div className="font-display text-4xl sm:text-5xl font-bold tabular-nums">32%</div>
            <div className="font-sans text-soil-ink/70 font-medium">Average water saved</div>
          </div>
          <div className="text-center space-y-2">
            <div className="font-display text-4xl sm:text-5xl font-bold tabular-nums">98%</div>
            <div className="font-sans text-soil-ink/70 font-medium">Disease detection accuracy</div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-12">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold">From soil to insight in seconds.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-well-water-blue/10 text-well-water-blue rounded-2xl flex items-center justify-center">
                <Radio size={32} />
              </div>
              <h3 className="font-display text-2xl font-bold">1. Sensors read the field</h3>
              <p className="font-sans text-soil-ink/70 leading-relaxed">
                Solar-powered IoT nodes embedded in the soil constantly measure moisture, temperature, and humidity levels, transmitting data even from remote sectors.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="w-16 h-16 bg-sindoor-rust/10 text-sindoor-rust rounded-2xl flex items-center justify-center">
                <Bell size={32} />
              </div>
              <h3 className="font-display text-2xl font-bold">2. System analyzes risks</h3>
              <p className="font-sans text-soil-ink/70 leading-relaxed">
                AgriEdge processes the telemetry against specific crop thresholds. If heat stress or dangerous moisture depletion is detected, the dashboard flags it instantly.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="w-16 h-16 bg-leaf-green/10 text-leaf-green rounded-2xl flex items-center justify-center">
                <Droplets size={32} />
              </div>
              <h3 className="font-display text-2xl font-bold">3. You take precise action</h3>
              <p className="font-sans text-soil-ink/70 leading-relaxed">
                You receive a clear, plain-language alert (e.g. "Low soil moisture — schedule irrigation"). No guesswork, just timely decisions that protect your yield.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer CTA Band */}
      <footer id="join-us" className="bg-soil-ink text-husk-cream py-24 px-4 text-center mt-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="font-display text-4xl sm:text-5xl font-bold">Ready to modernize your farm?</h2>
          <p className="font-sans text-husk-cream/70 text-lg">
            Join thousands of Indian farmers using AgriEdge to make confident, data-driven decisions every day.
          </p>
          <div className="pt-4">
            <button onClick={onGetStarted} className="bg-wheat-gold text-soil-ink px-8 py-4 rounded-full font-medium text-lg hover:bg-wheat-gold/90 transition-colors">
              Get started today
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
