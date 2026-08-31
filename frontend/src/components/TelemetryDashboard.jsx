import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Chip } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Droplets, Thermometer, Wind } from 'lucide-react';
import { api } from '../services/api';

export default function TelemetryDashboard() {
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);

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
        console.error("Failed to fetch telemetry", err);
      }
    };
    
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!current) return <Typography>Loading sensors...</Typography>;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card sx={{ borderRadius: 4, bgcolor: '#f1f8e9' }}>
          <CardContent>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Droplets color="#2e7d32" />
              <Typography variant="h6" color="textSecondary">Soil Moisture</Typography>
            </div>
            <Typography variant="h3" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
              {current.moisture_pct}%
            </Typography>
            <Chip 
              label={current.moisture_pct < 30 ? 'Low' : 'Good'} 
              color={current.moisture_pct < 30 ? 'warning' : 'success'} 
            />
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card sx={{ borderRadius: 4, bgcolor: '#fff3e0' }}>
          <CardContent>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Thermometer color="#ef6c00" />
              <Typography variant="h6" color="textSecondary">Temperature</Typography>
            </div>
            <Typography variant="h3" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
              {current.temperature}°C
            </Typography>
            <Chip 
              label={current.temperature > 35 ? 'High' : 'Optimal'} 
              color={current.temperature > 35 ? 'error' : 'success'} 
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card sx={{ borderRadius: 4, bgcolor: '#e3f2fd' }}>
          <CardContent>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wind color="#1565c0" />
              <Typography variant="h6" color="textSecondary">Humidity</Typography>
            </div>
            <Typography variant="h3" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
              {current.humidity}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card sx={{ borderRadius: 4, p: 2 }}>
          <Typography variant="h6" gutterBottom>24-Hour Trend</Typography>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={history}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="moisture_pct" stroke="#2e7d32" strokeWidth={2} name="Moisture" dot={false} />
                <Line type="monotone" dataKey="temperature" stroke="#ef6c00" strokeWidth={2} name="Temp" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Grid>
    </Grid>
  );
}