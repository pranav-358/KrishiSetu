import React, { useState, useEffect } from 'react';
import { Mic, Loader2, X } from 'lucide-react';
import { api } from '../services/api'; // <-- IMPORTED API

export default function GlobalVoiceAssistant({ language = "hi" }) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState(""); // <-- NEW: Stores AI answer
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = true;
      setRecognition(recog);
    }
  }, []);

  // Function to make the browser speak the AI's answer
  const speakAnswer = (text, lang) => {
    window.speechSynthesis?.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognition) {
      alert("Voice recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      window.speechSynthesis?.cancel(); // Stop any current speaking
      recognition.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      
      let finalTranscript = "";

      recognition.onstart = () => {
        setIsListening(true);
        setShowPopup(true);
        setTranscript("Listening...");
        setAiResponse(""); // Clear old response
      };
      
      recognition.onresult = (event) => {
        finalTranscript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setTranscript(finalTranscript);
      };

      recognition.onend = async () => {
        setIsListening(false);
        
        // If the user actually said something, send it to the backend!
        if (finalTranscript.trim()) {
          setAiResponse("Thinking...");
          try {
            const res = await api.askVoiceAssistant(finalTranscript, language);
            setAiResponse(res.data.answer);
            speakAnswer(res.data.answer, language); // Read it out loud
            
            // Auto-hide popup after 10 seconds
            setTimeout(() => setShowPopup(false), 10000); 
          } catch (error) {
            setAiResponse("Sorry, I could not connect to the network.");
          }
        } else {
          setTimeout(() => setShowPopup(false), 3000);
        }
      };

      recognition.start();
    }
  };

  return (
    <div className="fixed bottom-28 right-6 z-[9999] flex flex-col items-end">
      {/* Transcript & AI Response Popup */}
      {showPopup && (
        <div className="mb-4 bg-white/95 backdrop-blur-md border border-leaf-green/20 p-5 rounded-2xl shadow-xl max-w-sm transition-all animate-in slide-in-from-bottom-5">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold text-leaf-green uppercase tracking-wider">
              AI Voice Assistant
            </span>
            <button onClick={() => {
              setShowPopup(false);
              window.speechSynthesis?.cancel(); // Stop talking if closed
            }} className="text-soil-ink/50 hover:text-soil-ink">
              <X size={18} />
            </button>
          </div>
          
          {/* User's spoken text */}
          <p className="text-soil-ink font-medium text-sm mb-2 italic">
            "{transcript}"
          </p>
          
          {/* Gemini's spoken answer */}
          {aiResponse && (
            <div className="pt-3 border-t border-soil-ink/10">
              <p className={`text-sm ${aiResponse === 'Thinking...' ? 'text-soil-ink/50 animate-pulse' : 'text-soil-ink font-semibold'}`}>
                {aiResponse}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Floating Mic Button */}
      <button
        onClick={toggleListening}
        className={`flex items-center justify-center p-4 rounded-full shadow-2xl transition-all duration-300 border-4 ${
          isListening 
            ? 'bg-red-500 border-red-200 text-white animate-pulse scale-110' 
            : 'bg-leaf-green border-white text-white hover:bg-green-700 hover:scale-105'
        }`}
      >
        {isListening ? <Loader2 className="animate-spin" size={28} /> : <Mic size={28} />}
      </button>
    </div>
  );
}