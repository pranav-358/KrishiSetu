import React, { useState } from 'react';
import { Camera, CheckCircle, AlertTriangle, Settings, Sprout, Leaf, UploadCloud } from 'lucide-react';
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
    // In a real app, this might load a sample image.
    // For now, just trigger a simulated analysis.
    console.log("Selected sample:", crop);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center animate-in fade-in duration-700 pb-12">
      
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

      <div className="w-full max-w-3xl z-10 pt-4">
        
        {/* Upload Box - Light & Airy Design */}
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] p-2 shadow-[0_20px_60px_rgba(43,36,25,0.05)]">
          
          {!file && (
            <label
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center p-16 rounded-[2.25rem] border-2 border-dashed transition-all duration-500 overflow-hidden min-h-[450px] ${
                isDragging 
                  ? 'border-well-water-blue bg-well-water-blue/10 scale-[0.99]' 
                  : 'border-soil-ink/15 hover:border-well-water-blue/40 hover:bg-gradient-to-b hover:from-transparent hover:to-well-water-blue/5'
              }`}
            >
              {/* SVG Leaf Illustration & Scan Line */}
              <div className="relative w-36 h-36 mb-8 flex justify-center animate-float-leaf">
                <Leaf className={`w-full h-full text-leaf-green transition-opacity duration-300 ${isDragging ? 'opacity-100 drop-shadow-lg' : 'opacity-80'}`} strokeWidth={1} />
                
                {/* Glowing Scan Line */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-well-water-blue rounded-full shadow-[0_0_20px_#2196F3] animate-scan-line"></div>
              </div>
              
              <h3 className="font-display text-3xl text-soil-ink mb-3 text-center">
                {isDragging ? 'Drop to analyze...' : 'Scan crop for disease'}
              </h3>
              <p className="text-soil-ink/60 font-sans text-base mb-10 text-center max-w-md leading-relaxed">
                Drag and drop a photo of the affected leaf, or click below. Our AI will instantly identify diseases and recommend treatments.
              </p>
              
              {/* Action Button */}
              <div className="relative inline-flex items-center justify-center">
                <div className="relative inline-flex items-center space-x-3 px-10 py-4 bg-leaf-green text-white font-bold rounded-full shadow-[0_8px_20px_rgba(76,175,80,0.25)] hover:shadow-[0_12px_25px_rgba(76,175,80,0.35)] hover:-translate-y-1 hover:bg-[#43A047] transition-all duration-300">
                  <Camera size={22} />
                  <span className="text-lg">Select file to scan</span>
                </div>
              </div>
              
              <input type="file" className="hidden" accept="image/jpeg, image/png" onChange={handleUpload} />

              {/* Sample Crop Chips (Color Mapping) */}
              <div className="mt-14 flex space-x-4">
                <button onClick={(e) => { e.preventDefault(); handleChipClick('Wheat Rust'); }} className="flex items-center space-x-2 px-5 py-2 rounded-full bg-white text-sindoor-rust text-sm font-sans font-semibold hover:bg-sindoor-rust/10 transition-all border border-sindoor-rust/20 shadow-sm hover:shadow">
                  <span>🌾</span><span>Wheat Rust</span>
                </button>
                <button onClick={(e) => { e.preventDefault(); handleChipClick('Maize Blight'); }} className="flex items-center space-x-2 px-5 py-2 rounded-full bg-white text-well-water-blue text-sm font-sans font-semibold hover:bg-well-water-blue/10 transition-all border border-well-water-blue/20 shadow-sm hover:shadow">
                  <span>🌽</span><span>Maize Blight</span>
                </button>
                <button onClick={(e) => { e.preventDefault(); handleChipClick('Rice Blast'); }} className="flex items-center space-x-2 px-5 py-2 rounded-full bg-white text-leaf-green text-sm font-sans font-semibold hover:bg-leaf-green/10 transition-all border border-leaf-green/20 shadow-sm hover:shadow">
                  <span>🌾</span><span>Rice Blast</span>
                </button>
              </div>
            </label>
          )}

          {/* Loading & Result States within the Glassmorphism Card */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-32 rounded-[2.25rem]">
              <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 border-4 border-well-water-blue/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-well-water-blue rounded-full animate-spin"></div>
              </div>
              <h3 className="text-2xl font-display text-soil-ink mb-3">Analyzing Biomarkers...</h3>
              <p className="text-soil-ink/60 font-sans text-base animate-pulse">Running neural scan on cellular structures</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-24 px-8 rounded-[2.25rem]">
              <div className="w-20 h-20 rounded-full bg-sindoor-rust/10 flex items-center justify-center mb-6 border border-sindoor-rust/20">
                <AlertTriangle size={40} className="text-sindoor-rust" />
              </div>
              <p className="text-soil-ink font-sans text-center mb-8 text-lg">{error}</p>
              <button onClick={() => setError('')} className="px-8 py-3 bg-white border border-soil-ink/20 text-soil-ink font-bold rounded-full hover:bg-soil-ink/5 transition-colors shadow-sm hover:shadow">Try Again</button>
            </div>
          )}

          {result && !loading && !error && (
            <div className="p-8 animate-in zoom-in-95 duration-500 rounded-[2.25rem]">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Image Preview */}
                <div className="w-full md:w-1/3 relative rounded-3xl overflow-hidden border border-soil-ink/10 shadow-[0_10px_30px_rgba(33,150,243,0.15)]">
                  <img src={file} alt="Analyzed Crop" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-soil-ink/70 via-soil-ink/20 to-transparent"></div>
                  <div className="absolute bottom-5 left-5">
                    <span className="px-4 py-1.5 bg-white backdrop-blur-md text-well-water-blue text-xs font-black tracking-wider rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)]">SCANNED</span>
                  </div>
                </div>
                
                {/* Analysis Data */}
                <div className="w-full md:w-2/3 flex flex-col">
                  
                  {/* Status Banner */}
                  <div className={`p-6 mb-8 rounded-3xl flex items-center space-x-5 border backdrop-blur-sm shadow-sm ${
                    result.urgency === 'high' 
                      ? 'bg-gradient-to-r from-sindoor-rust/10 to-white border-sindoor-rust/20' 
                      : 'bg-gradient-to-r from-leaf-green/10 to-white border-leaf-green/20'
                  }`}>
                    {result.urgency === 'high' ? (
                      <div className="p-4 bg-white rounded-full shadow-[0_8px_20px_rgba(216,67,21,0.15)] shrink-0">
                        <AlertTriangle size={36} className="text-sindoor-rust" />
                      </div>
                    ) : (
                      <div className="p-4 bg-white rounded-full shadow-[0_8px_20px_rgba(76,175,80,0.15)] shrink-0">
                        <CheckCircle size={36} className="text-leaf-green" />
                      </div>
                    )}
                    
                    <div>
                      <h3 className={`font-display text-4xl mb-1.5 ${result.urgency === 'high' ? 'text-sindoor-rust' : 'text-leaf-green'}`}>
                        {result.name}
                      </h3>
                      <p className="text-soil-ink/70 text-sm font-sans flex items-center">
                        <span className="bg-white/60 px-2 py-0.5 rounded-md font-bold text-soil-ink shadow-sm mr-2">{result.confidence}%</span>
                        AI Confidence Match
                      </p>
                    </div>
                  </div>
                  
                  {/* Treatment and Prevention Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                    <div className="bg-gradient-to-b from-well-water-blue/5 to-transparent rounded-3xl p-6 border border-well-water-blue/10 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-well-water-blue/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
                      <h4 className="font-sans font-bold text-soil-ink mb-4 flex items-center text-lg relative z-10">
                        <div className="p-2 bg-white rounded-xl shadow-sm mr-3">
                          <Leaf size={20} className="text-well-water-blue" />
                        </div>
                        Treatment
                      </h4>
                      <p className="text-soil-ink/80 font-sans text-sm leading-relaxed relative z-10">
                        {result.treatment}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-b from-leaf-green/5 to-transparent rounded-3xl p-6 border border-leaf-green/10 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-leaf-green/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
                      <h4 className="font-sans font-bold text-soil-ink mb-4 flex items-center text-lg relative z-10">
                        <div className="p-2 bg-white rounded-xl shadow-sm mr-3">
                          <CheckCircle size={20} className="text-leaf-green" />
                        </div>
                        Prevention
                      </h4>
                      <p className="text-soil-ink/80 font-sans text-sm leading-relaxed relative z-10">
                        {result.prevention}
                      </p>
                    </div>
                  </div>
                  
                  {/* Scan Another Button */}
                  <div className="mt-10 flex justify-end">
                    <button 
                      onClick={() => { setFile(null); setResult(null); setError(''); }}
                      className="group relative inline-flex items-center space-x-3 bg-soil-ink text-husk-cream px-8 py-4 rounded-full font-bold shadow-[0_8px_20px_rgba(43,36,25,0.2)] hover:shadow-[0_12px_25px_rgba(43,36,25,0.3)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                      <span className="relative z-10">Scan another leaf</span>
                      <UploadCloud size={20} className="relative z-10 group-hover:-translate-y-1 transition-transform duration-300" />
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