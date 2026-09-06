export const generateMockDiurnalData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = time.getHours();
    
    // Temperature peaks around 14:00 (2 PM)
    const tempBase = 22;
    const tempPeak = 14;
    const hourOffset = Math.abs(14 - hour);
    const tempCurve = Math.max(0, 1 - (hourOffset / 12));
    const temperature = tempBase + (tempPeak * tempCurve) + (Math.random() * 2 - 1);
    
    // Moisture dips as temp rises
    const moistureBase = 45;
    const moistureDip = 25;
    const moistureCurve = tempCurve; // Inversely correlated
    const moisture_pct = moistureBase - (moistureDip * moistureCurve) + (Math.random() * 3 - 1.5);
    
    data.push({
      timestamp: time.toISOString(),
      temperature: Number(temperature.toFixed(1)),
      moisture_pct: Number(moisture_pct.toFixed(1)),
      humidity: Number((80 - (temperature * 1.5) + (Math.random() * 5)).toFixed(1))
    });
  }
  
  return data;
};

// You can swap api.getTelemetryHistory with this function in TelemetryDashboard.jsx for a local preview
export const getMockHistory = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ data: generateMockDiurnalData() });
    }, 500);
  });
};
