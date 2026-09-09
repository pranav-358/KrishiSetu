import React, { useState } from 'react';
import { Camera, CheckCircle, AlertTriangle, Sprout, Leaf, UploadCloud } from 'lucide-react';
import { api } from '../services/api';

export default function DiagnosisScanner() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const processFile = async (selected) => {
    if (!selected) return;
    setFile(URL.createObjectURL(selected));
    setLoading(true);
    setError('');
    
    try {
      const res = await api.diagnoseImage(selected);
      setResult(res.data);
    } catch (err) {
      setError('Unable to analyze image. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (e) => processFile(e.target.files[0]);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => setIsDragging(false);
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleChipClick = (crop) => {
    console.log("Selected sample:", crop);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center animate-in fade-in duration-700 p-4 sm:p-6 pb-12">
      
      {/* Custom CSS for Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(150px); opacity: 0; }
        }
        .animate-scan-line {
          animation: scan 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes float-leaf {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        .animate-float-leaf {
          animation: float-leaf 4s ease-in-out infinite;
        }
      `}} />

      <div className="w-full max-w-5xl z-10 pt-4">
        
        {/* Upload Box - Glassmorphism Restored */}
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] sm:rounded-[2.5rem] p-2 shadow-[0_20px_60px_rgba(43,36,25,0.05)]">
          
          {!file && (
            <label
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center p-6 sm:p-16 rounded-[1.75rem] sm:rounded-[2.25rem] border-2 border-dashed transition-all duration-500 overflow-hidden min-h-[400px] sm:min-h-[450px] ${
                isDragging 
                  ? 'border-well-water-blue bg-well-water-blue/10 scale-[0.99]' 
                  : 'border-soil-ink/15 hover:border-well-water-blue/40 hover:bg-gradient-to-b hover:from-transparent hover:to-well-water-blue/5'
              }`}
            >
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 mb-6 sm:mb-8 flex justify-center animate-float-leaf">
                <Leaf className={`w-full h-full text-leaf-green transition-opacity duration-300 ${isDragging ? 'opacity-100 drop-shadow-lg' : 'opacity-80'}`} strokeWidth={1} />
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-well-water-blue rounded-full shadow-[0_0_20px_#2196F3] animate-scan-line"></div>
              </div>
              
              <h3 className="font-display text-2xl sm:text-3xl text-soil-ink mb-3 text-center px-4">
                {isDragging ? 'Drop to analyze...' : 'Scan crop for disease'}
              </h3>
              <p className="text-soil-ink/60 font-sans text-sm sm:text-base mb-8 sm:mb-10 text-center max-w-md leading-relaxed px-4">
                Drag and drop a photo of the affected leaf, or click below. Our AI will instantly identify diseases and recommend treatments.
              </p>
              
              <div className="relative inline-flex items-center justify-center">
                <div className="relative inline-flex items-center space-x-2 sm:space-x-3 px-6 sm:px-10 py-3 sm:py-4 bg-leaf-green text-white font-bold rounded-full shadow-[0_8px_20px_rgba(76,175,80,0.25)] hover:shadow-[0_12px_25px_rgba(76,175,80,0.35)] hover:-translate-y-1 hover:bg-[#43A047] transition-all duration-300 cursor-pointer">
                  <Camera size={22} />
                  <span className="text-base sm:text-lg">Select file to scan</span>
                </div>
              </div>
              
              <input type="file" className="hidden" accept="image/jpeg, image/png" onChange={handleUpload} />

              {/* Sample Chips - Now wrapping on mobile */}
              <div className="mt-10 sm:mt-14 flex flex-wrap justify-center gap-3 sm:gap-4 px-4">
                <button onClick={(e) => { e.preventDefault(); handleChipClick('Wheat Rust'); }} className="flex items-center space-x-2 px-4 sm:px-5 py-2 rounded-full bg-white text-sindoor-rust text-xs sm:text-sm font-sans font-semibold hover:bg-sindoor-rust/10 transition-all border border-sindoor-rust/20 shadow-sm hover:shadow">
                  <span>🌾</span><span>Wheat Rust</span>
                </button>
                <button onClick={(e) => { e.preventDefault(); handleChipClick('Maize Blight'); }} className="flex items-center space-x-2 px-4 sm:px-5 py-2 rounded-full bg-white text-well-water-blue text-xs sm:text-sm font-sans font-semibold hover:bg-well-water-blue/10 transition-all border border-well-water-blue/20 shadow-sm hover:shadow">
                  <span>🌽</span><span>Maize Blight</span>
                </button>
                <button onClick={(e) => { e.preventDefault(); handleChipClick('Rice Blast'); }} className="flex items-center space-x-2 px-4 sm:px-5 py-2 rounded-full bg-white text-leaf-green text-xs sm:text-sm font-sans font-semibold hover:bg-leaf-green/10 transition-all border border-leaf-green/20 shadow-sm hover:shadow">
                  <span>🌾</span><span>Rice Blast</span>
                </button>
              </div>
            </label>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-24 sm:py-32 rounded-[2.25rem]">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-6 sm:mb-8">
                <div className="absolute inset-0 border-4 border-well-water-blue/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-well-water-blue rounded-full animate-spin"></div>
              </div>
              <h3 className="text-xl sm:text-2xl font-display text-soil-ink mb-2 sm:mb-3 text-center">Analyzing Biomarkers...</h3>
              <p className="text-soil-ink/60 font-sans text-sm sm:text-base animate-pulse text-center">Running neural scan on cellular structures</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-20 sm:py-24 px-6 sm:px-8 rounded-[2.25rem]">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-sindoor-rust/10 flex items-center justify-center mb-4 sm:mb-6 border border-sindoor-rust/20">
                <AlertTriangle size={32} className="text-sindoor-rust sm:w-10 sm:h-10" />
              </div>
              <p className="text-soil-ink font-sans text-center mb-6 sm:mb-8 text-base sm:text-lg">{error}</p>
              <button onClick={() => setError('')} className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white border border-soil-ink/20 text-soil-ink font-bold rounded-full hover:bg-soil-ink/5 transition-colors shadow-sm hover:shadow">Try Again</button>
            </div>
          )}

          {result && !loading && !error && (
            <div className="p-4 sm:p-8 animate-in zoom-in-95 duration-500 rounded-[2.25rem]">
              <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
                
                {/* Image Preview - Responsive Sizing */}
                <div className="w-full lg:w-1/3 relative rounded-2xl sm:rounded-3xl overflow-hidden border border-soil-ink/10 shadow-[0_10px_30px_rgba(33,150,243,0.15)] h-[250px] sm:h-[350px]">
                  <img src={file} alt="Analyzed Crop" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-soil-ink/70 via-soil-ink/20 to-transparent"></div>
                  <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5">
                    <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-white backdrop-blur-md text-well-water-blue text-[10px] sm:text-xs font-black tracking-wider rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)]">SCANNED</span>
                  </div>
                </div>
                
                {/* Analysis Data */}
                <div className="w-full lg:w-2/3 flex flex-col">
                  
                  {/* Status Banner */}
                  <div className={`p-4 sm:p-6 mb-6 sm:mb-8 rounded-2xl sm:rounded-3xl flex items-center space-x-4 sm:space-x-5 border backdrop-blur-sm shadow-sm ${
                    result.urgency === 'high' 
                      ? 'bg-gradient-to-r from-sindoor-rust/10 to-white border-sindoor-rust/20' 
                      : 'bg-gradient-to-r from-leaf-green/10 to-white border-leaf-green/20'
                  }`}>
                    {result.urgency === 'high' ? (
                      <div className="p-3 sm:p-4 bg-white rounded-full shadow-[0_8px_20px_rgba(216,67,21,0.15)] shrink-0">
                        <AlertTriangle className="text-sindoor-rust w-7 h-7 sm:w-9 sm:h-9" />
                      </div>
                    ) : (
                      <div className="p-3 sm:p-4 bg-white rounded-full shadow-[0_8px_20px_rgba(76,175,80,0.15)] shrink-0">
                        <CheckCircle className="text-leaf-green w-7 h-7 sm:w-9 sm:h-9" />
                      </div>
                    )}
                    
                    <div>
                      <h3 className={`font-display text-2xl sm:text-4xl mb-1 sm:mb-1.5 ${result.urgency === 'high' ? 'text-sindoor-rust' : 'text-leaf-green'}`}>
                        {result.name}
                      </h3>
                      <p className="text-soil-ink/70 text-xs sm:text-sm font-sans flex items-center">
                        <span className="bg-white/60 px-1.5 sm:px-2 py-0.5 rounded-md font-bold text-soil-ink shadow-sm mr-1.5 sm:mr-2">{result.confidence}%</span>
                        AI Confidence Match
                      </p>
                    </div>
                  </div>
                  
                  {/* Actionable Cards Grid - 1 Col on Mobile, 2 on Tablet, 3 on Desktop */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 flex-1">
                    
                    {/* Treatment Card */}
                    <div className="bg-gradient-to-b from-well-water-blue/5 to-transparent rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-well-water-blue/10 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-well-water-blue/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
                      <h4 className="font-sans font-bold text-soil-ink mb-2 sm:mb-3 flex items-center text-sm sm:text-md relative z-10">
                        <div className="p-1 sm:p-1.5 bg-white rounded-xl shadow-sm mr-2 sm:mr-2.5">
                          <Leaf className="text-well-water-blue w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        Treatment
                      </h4>
                      <p className="text-soil-ink/80 font-sans text-xs sm:text-sm leading-relaxed relative z-10">
                        {result.treatment}
                      </p>
                    </div>
                    
                    {/* Prevention Card */}
                    <div className="bg-gradient-to-b from-leaf-green/5 to-transparent rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-leaf-green/10 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-leaf-green/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
                      <h4 className="font-sans font-bold text-soil-ink mb-2 sm:mb-3 flex items-center text-sm sm:text-md relative z-10">
                        <div className="p-1 sm:p-1.5 bg-white rounded-xl shadow-sm mr-2 sm:mr-2.5">
                          <CheckCircle className="text-leaf-green w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        Prevention
                      </h4>
                      <p className="text-soil-ink/80 font-sans text-xs sm:text-sm leading-relaxed relative z-10">
                        {result.prevention}
                      </p>
                    </div>

                    {/* Fertilizer Card */}
                    <div className="bg-gradient-to-b from-amber-500/5 to-transparent rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-amber-500/10 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-amber-500/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
                      <h4 className="font-sans font-bold text-soil-ink mb-2 sm:mb-3 flex items-center text-sm sm:text-md relative z-10">
                        <div className="p-1 sm:p-1.5 bg-white rounded-xl shadow-sm mr-2 sm:mr-2.5">
                          <Sprout className="text-amber-600 w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        Fertilizer
                      </h4>
                      <p className="text-soil-ink/80 font-sans text-xs sm:text-sm leading-relaxed relative z-10">
                        {result.fertilizer || "Maintain standard NPK balanced fertilizer for optimal soil health."}
                      </p>
                    </div>

                  </div>
                  
                  {/* Scan Another Button - Responsive alignment */}
                  <div className="mt-6 sm:mt-8 flex justify-center lg:justify-end">
                    <button 
                      onClick={() => { setFile(null); setResult(null); setError(''); }}
                      className="w-full sm:w-auto group relative inline-flex items-center justify-center space-x-2 sm:space-x-3 bg-soil-ink text-husk-cream px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold shadow-[0_8px_20px_rgba(43,36,25,0.2)] hover:shadow-[0_12px_25px_rgba(43,36,25,0.3)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                      <span className="relative z-10 text-sm sm:text-base">Scan another leaf</span>
                      <UploadCloud className="relative z-10 group-hover:-translate-y-1 transition-transform duration-300 w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}