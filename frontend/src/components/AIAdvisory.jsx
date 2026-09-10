import React, { useState } from 'react';
import { Sparkles, Sprout, Loader2, Map, AlertTriangle, ClipboardList, Bug, Leaf, Droplets } from 'lucide-react';
import { api } from '../services/api';
import ReactMarkdown from 'react-markdown';

export default function AIAdvisory({ initialDisease = '', language = 'en', isOffline }) {
  const [cropType, setCropType] = useState('');
  const [landSize, setLandSize] = useState('');
  const [disease, setDisease] = useState(initialDisease);
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState(null);
  const [error, setError] = useState(null);
  const [showOtherCrop, setShowOtherCrop] = useState(false);

  const handleCropChip = (crop) => {
    if (crop === 'Other') {
      setShowOtherCrop(true);
      setCropType('');
    } else {
      setShowOtherCrop(false);
      setCropType(crop);
    }
  };

  const handleGetAdvice = async () => {
    if (!cropType || !landSize) {
      setError(language === 'hi' ? 'कृपया फसल का प्रकार और भूमि का आकार प्रदान करें।' : 'Please provide Crop Type and Land Size.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setAdvice(null);
    
    try {
      const response = await api.getAIAdvice({
        crop_type: cropType,
        land_size: landSize,
        disease: disease
      });
      setAdvice(response.data.advice);
    } catch (err) {
      console.error(err);
      setError(language === 'hi' ? 'AI सलाह प्राप्त करने में विफल। कृपया बाद में प्रयास करें।' : 'Failed to get AI advice. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-12 animate-in fade-in duration-700 pt-4">
      <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex-1">
          <h1 className="font-serif text-3xl sm:text-4xl text-soil-ink font-semibold leading-tight tracking-tight">
            <Leaf className="inline-block text-leaf-green mr-3 w-7 h-7 sm:w-9 sm:h-9 align-middle mb-1 sm:mb-2" />
            {language === 'hi' ? (
              <span>AI खुराक <span className="font-normal italic opacity-80">और</span> कृषि सलाह</span>
            ) : (
              <span>AI Dosage <span className="font-normal italic opacity-80">&</span> Agronomy Advisory</span>
            )}
          </h1>
          <p className="font-sans text-soil-ink/60 mt-4 text-sm max-w-2xl">
            {language === 'hi' ? 'अपने खेत की स्थितियों के आधार पर सटीक रासायनिक/जैविक खुराक सिफारिशें और सिंचाई मार्गदर्शन प्राप्त करें।' : 'Get precise chemical/organic dosage recommendations and irrigation guidance based on your field conditions.'}
          </p>
        </div>
        
        <div className="hidden lg:flex shrink-0">
          <div className="bg-white/60 backdrop-blur-sm border border-soil-ink/5 px-4 py-3 rounded-2xl shadow-[0_4px_20px_rgba(43,36,25,0.04)] flex items-center space-x-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-husk-cream bg-leaf-green/20 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-leaf-green" />
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-husk-cream bg-well-water-blue/20 flex items-center justify-center">
                <Droplets className="w-4 h-4 text-well-water-blue" />
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-husk-cream bg-amber-500/20 flex items-center justify-center">
                <Sprout className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <div className="flex flex-col pl-1">
              <span className="text-soil-ink font-bold font-sans text-sm">2,400+</span>
              <span className="text-soil-ink/60 text-xs font-sans">{language === 'hi' ? 'योजनाएं बनीं' : 'Plans Generated'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] p-6 sm:p-8 shadow-[0_20px_60px_rgba(43,36,25,0.05)] mb-8">
        <div className="mb-6">
          <label className="font-sans text-sm font-bold text-soil-ink mb-3 block">{language === 'hi' ? 'फसल का प्रकार' : 'Crop Type'}</label>
          <div className="flex flex-wrap gap-3">
              <button onClick={() => handleCropChip('Wheat')} className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-sans font-semibold transition-all border shadow-sm hover:shadow ${cropType === 'Wheat' && !showOtherCrop ? 'bg-sindoor-rust/10 border-sindoor-rust/30 text-sindoor-rust' : 'bg-white border-soil-ink/10 text-soil-ink/70 hover:bg-soil-ink/5'}`}>
                <span>🌾</span><span>{language === 'hi' ? 'गेहूं' : 'Wheat'}</span>
              </button>
              <button onClick={() => handleCropChip('Cotton')} className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-sans font-semibold transition-all border shadow-sm hover:shadow ${cropType === 'Cotton' && !showOtherCrop ? 'bg-leaf-green/10 border-leaf-green/30 text-leaf-green' : 'bg-white border-soil-ink/10 text-soil-ink/70 hover:bg-soil-ink/5'}`}>
                <span>🌿</span><span>{language === 'hi' ? 'कपास' : 'Cotton'}</span>
              </button>
              <button onClick={() => handleCropChip('Rice')} className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-sans font-semibold transition-all border shadow-sm hover:shadow ${cropType === 'Rice' && !showOtherCrop ? 'bg-well-water-blue/10 border-well-water-blue/30 text-well-water-blue' : 'bg-white border-soil-ink/10 text-soil-ink/70 hover:bg-soil-ink/5'}`}>
                <span>🌾</span><span>{language === 'hi' ? 'चावल' : 'Rice'}</span>
              </button>
              <button onClick={() => handleCropChip('Sugarcane')} className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-sans font-semibold transition-all border shadow-sm hover:shadow ${cropType === 'Sugarcane' && !showOtherCrop ? 'bg-amber-600/10 border-amber-600/30 text-amber-600' : 'bg-white border-soil-ink/10 text-soil-ink/70 hover:bg-soil-ink/5'}`}>
                <span>🎋</span><span>{language === 'hi' ? 'गन्ना' : 'Sugarcane'}</span>
              </button>
              <button onClick={() => handleCropChip('Maize')} className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-sans font-semibold transition-all border shadow-sm hover:shadow ${cropType === 'Maize' && !showOtherCrop ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600' : 'bg-white border-soil-ink/10 text-soil-ink/70 hover:bg-soil-ink/5'}`}>
                <span>🌽</span><span>{language === 'hi' ? 'मक्का' : 'Maize'}</span>
              </button>
              <button onClick={() => handleCropChip('Other')} className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-sans font-semibold transition-all border shadow-sm hover:shadow ${showOtherCrop ? 'bg-soil-ink/10 border-soil-ink/30 text-soil-ink' : 'bg-white border-soil-ink/10 text-soil-ink/70 hover:bg-soil-ink/5'}`}>
                <span>✍️</span><span>{language === 'hi' ? 'अन्य' : 'Other'}</span>
              </button>
          </div>
          
          {showOtherCrop && (
            <div className="relative mt-4">
              <Sprout className="absolute left-3 top-1/2 -translate-y-1/2 text-soil-ink/40 w-5 h-5" />
              <input 
                type="text" 
                placeholder={language === 'hi' ? 'कस्टम फसल दर्ज करें' : 'Enter custom crop'}
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full sm:w-1/2 pl-10 pr-4 py-3 rounded-xl bg-husk-cream/30 border border-soil-ink/10 text-soil-ink placeholder:text-soil-ink/40 font-sans focus:outline-none focus:border-well-water-blue focus:ring-1 focus:ring-well-water-blue transition-all"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col">
            <label className="font-sans text-sm font-bold text-soil-ink mb-1">{language === 'hi' ? 'भूमि का आकार' : 'Land Size'}</label>
            <div className="relative">
              <Map className="absolute left-3 top-1/2 -translate-y-1/2 text-soil-ink/40 w-5 h-5" />
              <input 
                type="text" 
                placeholder={language === 'hi' ? 'उदा. 2 एकड़' : 'e.g. 2 Acres'}
                value={landSize}
                onChange={(e) => setLandSize(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-husk-cream/30 border border-soil-ink/10 text-soil-ink placeholder:text-soil-ink/40 font-sans focus:outline-none focus:border-well-water-blue focus:ring-1 focus:ring-well-water-blue transition-all"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="font-sans text-sm font-bold text-soil-ink mb-1">{language === 'hi' ? 'वर्तमान रोग (वैकल्पिक)' : 'Current Disease (Optional)'}</label>
            <div className="relative">
              <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 text-soil-ink/40 w-5 h-5" />
              <input 
                type="text" 
                placeholder={language === 'hi' ? 'उदा. लीफ ब्लाइट' : 'e.g. Leaf Blight'}
                value={disease}
                onChange={(e) => setDisease(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-husk-cream/30 border border-soil-ink/10 text-soil-ink placeholder:text-soil-ink/40 font-sans focus:outline-none focus:border-well-water-blue focus:ring-1 focus:ring-well-water-blue transition-all"
              />
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-sindoor-rust/10 border border-sindoor-rust/20 rounded-xl text-sindoor-rust font-sans text-sm flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        <button 
          onClick={handleGetAdvice}
          disabled={loading || isOffline}
          className={`w-full group relative inline-flex items-center justify-center space-x-2 bg-[#1E1911] text-husk-cream px-8 py-4 rounded-xl font-bold shadow-[0_8px_20px_rgba(43,36,25,0.2)] hover:shadow-[0_12px_25px_rgba(43,36,25,0.3)] transition-all duration-300 overflow-hidden ${isOffline ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1'}`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              <span>{language === 'hi' ? 'विश्लेषण कर रहा है...' : 'Analyzing...'}</span>
            </>
          ) : (
            <>
              {!isOffline && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>}
              <Sparkles className="relative z-10 w-5 h-5" />
              <span className="relative z-10 text-lg">{isOffline ? (language === 'hi' ? 'ऑफ़लाइन होने पर उपलब्ध नहीं' : 'Unavailable Offline') : (language === 'hi' ? 'AI सलाह प्राप्त करें' : 'Get AI Advice')}</span>
            </>
          )}
        </button>
      </div>

      {!advice && (
        <div className="bg-white/50 backdrop-blur-md border border-white rounded-3xl p-6 sm:p-8 shadow-sm mb-8 animate-in fade-in duration-500">
          <h3 className="font-display text-xl text-soil-ink font-bold mb-4">
            {language === 'hi' ? `इस मौसम में ${(cropType && !showOtherCrop) ? (cropType === 'Wheat' ? 'गेहूं' : cropType === 'Cotton' ? 'कपास' : cropType === 'Rice' ? 'चावल' : cropType === 'Sugarcane' ? 'गन्ना' : cropType === 'Maize' ? 'मक्का' : cropType) : 'गेहूं'} के लिए आम समस्याएं` : `Common issues for ${(cropType && !showOtherCrop) ? cropType : 'Wheat'} this season`}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-soil-ink/5 shadow-sm flex items-start space-x-3">
              <div className="p-2 bg-sindoor-rust/10 rounded-full shrink-0">
                <Leaf className="w-5 h-5 text-sindoor-rust" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-soil-ink text-sm mb-1">{language === 'hi' ? 'रतुआ (Rust)' : 'Rust'}</h4>
                <p className="font-sans text-xs text-soil-ink/70 leading-relaxed">{language === 'hi' ? 'इस महीने उमस भरी स्थितियों में आम है। पत्तियों पर नजर रखें।' : 'Common in humid conditions this month. Watch for orange pustules on leaves.'}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-soil-ink/5 shadow-sm flex items-start space-x-3">
              <div className="p-2 bg-amber-500/10 rounded-full shrink-0">
                <Bug className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-soil-ink text-sm mb-1">{language === 'hi' ? 'एफिड प्रकोप (Aphid Infestation)' : 'Aphid Infestation'}</h4>
                <p className="font-sans text-xs text-soil-ink/70 leading-relaxed">{language === 'hi' ? 'घुंघराले या पीले पत्तों पर नजर रखें। नाइट्रोजन के उपयोग को नियंत्रित करें।' : 'Watch for curling or yellowing leaves. Control nitrogen application.'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {advice && (
        <div className="animate-in slide-in-from-bottom-8 duration-500">
          <div className="markdown-cards-container space-y-4 sm:space-y-6">
            <ReactMarkdown
              components={{
                h3: ({node, ...props}) => (
                  <h3 className="font-display text-xl sm:text-2xl text-soil-ink font-bold mt-8 mb-4 flex items-center" {...props} />
                ),
                // Wrap list sections in Sub-Cards
                ul: ({node, ...props}) => (
                  <div className="bg-white rounded-2xl p-5 sm:p-6 border border-soil-ink/10 shadow-sm mb-6">
                    <ul className="space-y-4" {...props} />
                  </div>
                ),
                li: ({node, ...props}) => {
                  const content = props.children;
                  // If it's a dosage or ingredient, format as a chip
                  const isChip = String(content).includes('Dosage:') || String(content).includes('Active Ingredient:') || String(content).includes('Total');
                  
                  if (isChip) {
                    return (
                      <li className="flex items-center font-sans text-sm sm:text-base text-soil-ink/90">
                        <div className="bg-husk-cream px-3 py-1.5 rounded-lg border border-soil-ink/5 shadow-sm inline-flex">
                          {content}
                        </div>
                      </li>
                    );
                  }
                  return (
                    <li className="flex items-start font-sans text-sm sm:text-base text-soil-ink/80 leading-relaxed">
                      <span className="mr-3 text-well-water-blue flex-shrink-0 mt-1">•</span>
                      <span className="flex-1">{content}</span>
                    </li>
                  );
                },
                p: ({node, ...props}) => {
                  const content = props.children;
                  if (String(content).includes('*(Note:')) {
                     return <p className="font-sans text-amber-600/90 text-xs sm:text-sm italic mt-8 text-center bg-amber-500/10 p-3 rounded-xl border border-amber-500/20" {...props} />;
                  }
                  return <p className="font-sans text-soil-ink/80 text-sm sm:text-base leading-relaxed mb-4" {...props} />;
                },
                strong: ({node, ...props}) => <strong className="font-bold text-soil-ink" {...props} />
              }}
            >
              {advice}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
