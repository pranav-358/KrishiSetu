import React from 'react';
import { Sun, CloudRain, Wind, AlertTriangle } from 'lucide-react';

export default function RiskForecastCard({ type = "heat", language = "en" }) {
  // Mock data tailored for agricultural resilience based on language and type
  const forecasts = {
    heat: {
      en: {
        title: "Heatwave Risk in 36 hrs",
        desc: "Temperatures expected to exceed 42°C. Reduce midday irrigation to prevent scorch and increase evening water volume.",
        icon: Sun,
        color: "text-amber-500",
        border: "border-l-amber-500",
        bg: "bg-amber-500/10"
      },
      hi: {
        title: "36 घंटे में लू (Heatwave) का खतरा",
        desc: "तापमान 42°C से अधिक होने की उम्मीद है। फसल को झुलसने से बचाने के लिए दोपहर की सिंचाई कम करें और शाम को पानी बढ़ाएं।",
        icon: Sun,
        color: "text-amber-500",
        border: "border-l-amber-500",
        bg: "bg-amber-500/10"
      }
    },
    rain: {
      en: {
        title: "Heavy Rain Expected in 18 hrs",
        desc: "Delay fertilizer application to prevent runoff. Ensure field drainage channels are clear.",
        icon: CloudRain,
        color: "text-blue-500",
        border: "border-l-blue-500",
        bg: "bg-blue-500/10"
      },
      hi: {
        title: "18 घंटे में भारी बारिश की उम्मीद",
        desc: "उर्वरक (खाद) डालने में देरी करें ताकि वह बह न जाए। सुनिश्चित करें कि खेत की जल निकासी नालियां साफ हों।",
        icon: CloudRain,
        color: "text-blue-500",
        border: "border-l-blue-500",
        bg: "bg-blue-500/10"
      }
    }
  };

  const data = forecasts[type][language] || forecasts.heat.en;
  const Icon = data.icon;

  return (
    <div className={`flex items-start sm:items-center space-x-4 p-4 sm:p-5 bg-white shadow-[0_8px_30px_rgba(43,36,25,0.06)] rounded-2xl border-l-4 ${data.border} border-t border-r border-b border-soil-ink/5`}>
      <div className={`p-3 rounded-full shrink-0 ${data.bg}`}>
        <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${data.color}`} />
      </div>
      <div className="flex-1">
        <h3 className="font-display font-bold text-base sm:text-lg text-soil-ink flex items-center">
          <AlertTriangle size={16} className={`${data.color} mr-2`} />
          {data.title}
        </h3>
        <p className="font-sans text-xs sm:text-sm text-soil-ink/70 mt-1 leading-relaxed">
          {data.desc}
        </p>
      </div>
    </div>
  );
}
