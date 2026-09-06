import React, { useState } from 'react';
import { Camera, CheckCircle, AlertTriangle } from 'lucide-react';
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-soil-ink text-husk-cream p-6">
        <h2 className="font-display text-3xl">Crop disease scanner</h2>
        <p className="font-sans mt-2">Upload a photo of the affected leaf for automated advisory.</p>
      </div>

      <div className="p-6 bg-white border border-soil-ink/10">
        {!file && (
          <label
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative flex flex-col items-center justify-center p-12 border-2 border-dashed cursor-pointer transition-all ${
              isDragging 
                ? 'border-leaf-green bg-leaf-green/5' 
                : 'border-leaf-green/40 hover:border-leaf-green hover:bg-leaf-green/5'
            }`}
          >
            <Camera 
              size={32} 
              className={`mb-4 transition-colors ${
                isDragging ? 'text-leaf-green' : 'text-leaf-green/70'
              }`}
            />
            
            <h3 className={`font-sans font-medium text-lg mb-4 ${isDragging ? 'text-leaf-green' : 'text-soil-ink'}`}>
              {isDragging ? 'Drop leaf image to analyze' : 'Drag & drop image here'}
            </h3>
            
            <div className="inline-flex items-center px-6 py-2 bg-soil-ink text-husk-cream font-medium hover:bg-soil-ink/90 transition-colors">
              Select file
            </div>
            
            <input type="file" className="hidden" accept="image/jpeg, image/png" onChange={handleUpload} />
          </label>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-leaf-green/20 border-t-leaf-green rounded-full animate-spin"></div>
            <p className="mt-4 text-soil-ink font-sans">Analyzing leaf...</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-sindoor-rust/10 border border-sindoor-rust text-sindoor-rust flex items-start space-x-3">
            <AlertTriangle size={20} className="mt-0.5 shrink-0" />
            <p className="font-sans text-sm">{error}</p>
          </div>
        )}

        {result && !loading && (
          <div className="animate-in fade-in duration-500">
            <img src={file} alt="Crop" className="w-full h-64 object-cover border border-soil-ink/10 mb-6" />
            
            <div className={`p-4 mb-6 flex items-start space-x-3 border ${
              result.urgency === 'high' 
                ? 'bg-sindoor-rust/10 border-sindoor-rust' 
                : 'bg-leaf-green/10 border-leaf-green'
            }`}>
              {result.urgency === 'high' ? (
                <AlertTriangle size={24} className="text-sindoor-rust mt-1 shrink-0" />
              ) : (
                <CheckCircle size={24} className="text-leaf-green mt-1 shrink-0" />
              )}
              
              <div>
                <h3 className={`font-display text-xl ${result.urgency === 'high' ? 'text-sindoor-rust' : 'text-leaf-green'}`}>
                  {result.name}
                </h3>
                <p className="text-soil-ink/70 text-sm mt-1">Confidence: <span className="tabular-nums font-medium">{result.confidence}%</span></p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-sans font-bold text-soil-ink mb-2">Recommended treatment</h4>
                <div className="text-soil-ink font-sans text-sm leading-relaxed">
                  {result.treatment}
                </div>
              </div>
              
              <div>
                <h4 className="font-sans font-bold text-soil-ink mb-2">Preventive action</h4>
                <div className="text-soil-ink font-sans text-sm leading-relaxed">
                  {result.prevention}
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => { setFile(null); setResult(null); }}
              className="mt-8 px-6 py-2 bg-wheat-gold text-soil-ink font-medium hover:bg-wheat-gold/90 transition-colors"
            >
              Scan another crop leaf
            </button>
          </div>
        )}
      </div>
    </div>
  );
}