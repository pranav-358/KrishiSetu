import React from 'react';
import { Sun, CloudRain, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function RiskForecastCard({ temperature, moisture, language = "en" }) {
  // 1. Calculate disaster type dynamically based on live data
  let activeType = "safe";
  if (moisture >= 75) {
    activeType = "flood";
  } else if (moisture <= 35 && temperature >= 35) {
    activeType = "heat";
  }

  // 2. Your existing mock data, now functioning as our live templates
  const forecasts = {
    heat: {
      en: {
        title: "Heatwave & Drought Risk",
        desc: "Temperatures exceeding safe limits. Reduce midday irrigation to prevent scorch and increase evening water volume.",
        icon: Sun,
        color: "text-amber-600",
        border: "border-l-4 border-amber-500",
        bg: "bg-amber-50"
      },
      hi: {
        title: "गंभीर सूखा और हीटवेव अलर्ट",
        desc: "तापमान सुरक्षित सीमा से अधिक है। फसल को झुलसने से बचाने के लिए तुरंत सिंचाई शुरू करें।",
        icon: Sun,
        color: "text-amber-600",
        border: "border-l-4 border-amber-500",
        bg: "bg-amber-50"
      }
    },
    flood: {
      en: {
        title: "Flood & Waterlogging Alert",
        desc: "Field moisture exceeded 75%. High risk of root rot! Disengage irrigation immediately.",
        icon: CloudRain,
        color: "text-blue-600",
        border: "border-l-4 border-blue-500",
        bg: "bg-blue-50"
      },
      hi: {
        title: "बाढ़ और जलभराव की चेतावनी",
        desc: "खेत में नमी का स्तर 75% से अधिक हो गया है। जड़ सड़ने का खतरा! पंप तुरंत बंद करें।",
        icon: CloudRain,
        color: "text-blue-600",
        border: "border-l-4 border-blue-500",
        bg: "bg-blue-50"
      }
    },
    safe: {
      en: {
        title: "Field Conditions Optimal",
        desc: "Temperature and moisture levels are within safe, productive thresholds.",
        icon: CheckCircle2,
        color: "text-green-600",
        border: "border-l-4 border-green-500",
        bg: "bg-green-50"
      },
      hi: {
        title: "खेत की स्थिति सामान्य है",
        desc: "तापमान और नमी का स्तर सुरक्षित सीमा के भीतर है।",
        icon: CheckCircle2,
        color: "text-green-600",
        border: "border-l-4 border-green-500",
        bg: "bg-green-50"
      }
    }
  };

  const activeData = forecasts[activeType][language] || forecasts[activeType].en;
  const IconComponent = activeData.icon;

  return (
    <div className={`flex items-start space-x-4 p-4 rounded-xl shadow-sm mb-6 transition-all duration-500 ${activeData.bg} ${activeData.border}`}>
      <div className={`mt-1 ${activeData.color}`}>
        <IconComponent className={activeType !== 'safe' ? "animate-pulse" : ""} size={24} />
      </div>
      <div>
        <h3 className={`font-bold text-base flex items-center space-x-2 ${activeData.color}`}>
          {activeType !== 'safe' && <AlertTriangle size={16} className="mr-1" />}
          {activeData.title}
        </h3>
        <p className="text-sm mt-1 text-soil-ink/80">{activeData.desc}</p>
      </div>
    </div>
  );
}