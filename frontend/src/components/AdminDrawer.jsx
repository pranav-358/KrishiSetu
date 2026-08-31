import React, { useState, useEffect } from 'react';
import { Drawer, Box, Typography, Switch, Slider, Button, FormControlLabel, Divider } from '@mui/material';
import { api } from '../services/api';

export default function AdminDrawer({ open, onClose }) {
  const [controls, setControls] = useState({
    simulation_enabled: true,
    moisture_pct: 50,
    temperature: 25,
    humidity: 60
  });

  useEffect(() => {
    if (open) {
      api.getControls().then(res => setControls(res.data)).catch(console.error);
    }
  }, [open]);

  const handleChange = (field, value) => {
    setControls(prev => ({ ...prev, [field]: value }));
  };

  const applyControls = async () => {
    try {
      await api.updateControls(controls);
      onClose();
    } catch (err) {
      console.error("Failed to apply controls", err);
    }
  };

  const setPreset = (presetName) => {
    if (presetName === 'heat_stress') {
      setControls({ simulation_enabled: false, moisture_pct: 20, temperature: 42, humidity: 20 });
    } else if (presetName === 'normal') {
      setControls({ simulation_enabled: true, moisture_pct: 50, temperature: 25, humidity: 60 });
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 350, p: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Simulator Controls</Typography>
        <Typography variant="body2" color="textSecondary" mb={3}>
          Override field conditions to test KrishiSetu alerts.
        </Typography>

        <FormControlLabel
          control={
            <Switch 
              checked={controls.simulation_enabled} 
              onChange={(e) => handleChange('simulation_enabled', e.target.checked)} 
              color="primary" 
            />
          }
          label="Auto-Simulation (Time/Weather Cycle)"
          sx={{ mb: 3 }}
        />

        <Divider sx={{ mb: 3 }} />

        <Typography gutterBottom>Soil Moisture: {controls.moisture_pct}%</Typography>
        <Slider
          disabled={controls.simulation_enabled}
          value={controls.moisture_pct}
          onChange={(e, val) => handleChange('moisture_pct', val)}
          min={0} max={100}
          color="primary"
          sx={{ mb: 3 }}
        />

        <Typography gutterBottom>Temperature: {controls.temperature}°C</Typography>
        <Slider
          disabled={controls.simulation_enabled}
          value={controls.temperature}
          onChange={(e, val) => handleChange('temperature', val)}
          min={10} max={50}
          color="warning"
          sx={{ mb: 3 }}
        />

        <Typography gutterBottom>Humidity: {controls.humidity}%</Typography>
        <Slider
          disabled={controls.simulation_enabled}
          value={controls.humidity}
          onChange={(e, val) => handleChange('humidity', val)}
          min={0} max={100}
          color="info"
          sx={{ mb: 4 }}
        />

        <Button variant="contained" fullWidth onClick={applyControls} sx={{ mb: 2 }}>
          Apply Conditions
        </Button>

        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Quick Presets</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" size="small" fullWidth onClick={() => setPreset('normal')}>Normal</Button>
          <Button variant="outlined" color="error" size="small" fullWidth onClick={() => setPreset('heat_stress')}>Heat Stress</Button>
        </Box>
      </Box>
    </Drawer>
  );
}