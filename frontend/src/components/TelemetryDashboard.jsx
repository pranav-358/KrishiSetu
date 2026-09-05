import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Chip, Box, Avatar } from '@mui/material';
// Upgraded chart imports: We are using AreaChart now for a beautiful filled-in look!
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Droplets, ThermometerSun, Wind, Sprout, CheckCircle2, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';

export default function TelemetryDashboard() {
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);

  // Fetch telemetry data from the FastAPI backend
  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const [latestRes, histRes] = await Promise.all([
          api.getLatestTelemetry(),
          api.getTelemetryHistory(24)
        ]);
        setCurrent(latestRes.data);
        setHistory(histRes.data.map(d => ({
          ...d,
          time: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })));
      } catch (err) {
        console.error("Telemetry fetch error:", err);
      }
    };
    
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!current) return <Typography sx={{ mt: 5, textAlign: 'center' }}>Connecting to field sensors...</Typography>;

  // Determine overall field health based on conditions
  const isHealthy = current.moisture_pct >= 30 && current.temperature <= 35;

  return (
    <Grid container spacing={3}>
      
      {/* 
        -------------------------------------------------------------
        1. HERO SECTION: FIELD OVERVIEW
        Adds a beautiful gradient banner to ground the user in the context 
        of a specific farm field.
        ------------------------------------------------------------- 
      */}
      <Grid item xs={12}>
        <Card sx={{ 
          borderRadius: 4, 
          background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)', // Rich green gradient
          color: 'white',
          boxShadow: '0 8px 32px rgba(46, 125, 50, 0.2)' // Soft glowing shadow
        }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                <Sprout size={32} color="white" />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold">Sector Alpha: Wheat Crop</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Active Sensors • Last updated just now</Typography>
              </Box>
            </Box>
            
            {/* Dynamic Status Badge */}
            <Chip 
              icon={isHealthy ? <CheckCircle2 color="white" size={18} /> : <AlertTriangle color="white" size={18} />}
              label={isHealthy ? "Conditions Optimal" : "Requires Attention"} 
              sx={{ 
                bgcolor: isHealthy ? 'rgba(255,255,255,0.2)' : '#d32f2f',
                color: 'white', 
                fontWeight: 'bold',
                px: 1, py: 2.5, borderRadius: 3
              }} 
            />
          </CardContent>
        </Card>
      </Grid>

      {/* 
        -------------------------------------------------------------
        2. TELEMETRY CARDS
        Upgraded with gradients, avatars for icons, and rounded numbers.
        ------------------------------------------------------------- 
      */}
      <Grid item xs={12} md={4}>
        <Card sx={{ borderRadius: 4, background: 'linear-gradient(to bottom right, #f1f8e9, #dcedc8)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Avatar sx={{ bgcolor: '#2e7d32' }}><Droplets size={20} color="white" /></Avatar>
              <Typography variant="h6" color="textSecondary" fontWeight="600">Soil Moisture</Typography>
            </Box>
            {/* toFixed(1) keeps the number clean, e.g., 68.7% instead of 68.7123% */}
            <Typography variant="h3" sx={{ fontWeight: '900', color: '#1b5e20' }}>
              {current.moisture_pct.toFixed(1)}%
            </Typography>
            <Chip 
              label={current.moisture_pct < 30 ? 'Critically Low' : 'Adequate Moisture'} 
              color={current.moisture_pct < 30 ? 'error' : 'success'} 
              size="small" sx={{ mt: 2, fontWeight: 'bold' }}
            />
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card sx={{ borderRadius: 4, background: 'linear-gradient(to bottom right, #fff3e0, #ffe0b2)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <CardContent>
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Avatar sx={{ bgcolor: '#ef6c00' }}><ThermometerSun size={20} color="white" /></Avatar>
              <Typography variant="h6" color="textSecondary" fontWeight="600">Temperature</Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: '900', color: '#e65100' }}>
              {current.temperature.toFixed(1)}°C
            </Typography>
            <Chip 
              label={current.temperature > 35 ? 'Heat Stress Risk' : 'Optimal Temp'} 
              color={current.temperature > 35 ? 'error' : 'success'} 
              size="small" sx={{ mt: 2, fontWeight: 'bold' }}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card sx={{ borderRadius: 4, background: 'linear-gradient(to bottom right, #e3f2fd, #bbdefb)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Avatar sx={{ bgcolor: '#1565c0' }}><Wind size={20} color="white" /></Avatar>
              <Typography variant="h6" color="textSecondary" fontWeight="600">Humidity</Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: '900', color: '#0d47a1' }}>
              {current.humidity.toFixed(1)}%
            </Typography>
            <Chip 
              label="Stable" color="info" 
              size="small" sx={{ mt: 2, fontWeight: 'bold' }}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* 
        -------------------------------------------------------------
        3. UPGRADED AREA CHART
        Using Recharts AreaChart with <defs> for beautiful color gradients!
        ------------------------------------------------------------- 
      */}
      <Grid item xs={12}>
        <Card sx={{ borderRadius: 4, p: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom color="#2e7d32">
            24-Hour Environmental Trends
          </Typography>
          
          <Box sx={{ width: '100%', height: 350, mt: 2 }}>
            <ResponsiveContainer>
              <AreaChart data={history} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                {/* SVG Gradients for the chart fill */}
                <defs>
                  <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2e7d32" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef6c00" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef6c00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis dataKey="time" tick={{fill: '#757575', fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis tick={{fill: '#757575', fontSize: 12}} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                />
                
                {/* Area lines with smooth curves (type="monotone") */}
                <Area type="monotone" dataKey="moisture_pct" stroke="#2e7d32" strokeWidth={3} fillOpacity={1} fill="url(#colorMoisture)" name="Moisture %" />
                <Area type="monotone" dataKey="temperature" stroke="#ef6c00" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" name="Temperature °C" />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      </Grid>
      
    </Grid>
  );
}