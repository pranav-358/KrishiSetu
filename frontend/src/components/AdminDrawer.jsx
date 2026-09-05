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

  const applyControls = async () => {
    try {
      await api.updateControls(controls);
      onClose();
    } catch (err) {
      console.error("Control update failed:", err);
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
      <Box sx={{ width: 340, p: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">Simulation Overrides</Typography>
        <Typography variant="body2" color="textSecondary" mb={3}>
          Override live telemetry to test advisory triggers.
        </Typography>

        <FormControlLabel
          control={
            <Switch 
              checked={controls.simulation_enabled} 
              onChange={(e) => setControls(prev => ({ ...prev, simulation_enabled: e.target.checked }))} 
              color="primary" 
            />
          }
          label="Auto-Simulation"
          sx={{ mb: 2 }}
        />

        <Divider sx={{ my: 2 }} />

        <Typography gutterBottom>Soil Moisture: {controls.moisture_pct}%</Typography>
        <Slider
          disabled={controls.simulation_enabled}
          value={controls.moisture_pct}
          onChange={(e, val) => setControls(prev => ({ ...prev, moisture_pct: val }))}
          min={0} max={100}
        />

        <Typography gutterBottom sx={{ mt: 2 }}>Temperature: {controls.temperature}°C</Typography>
        <Slider
          disabled={controls.simulation_enabled}
          value={controls.temperature}
          onChange={(e, val) => setControls(prev => ({ ...prev, temperature: val }))}
          min={10} max={50}
          color="warning"
        />

        <Typography gutterBottom sx={{ mt: 2 }}>Humidity: {controls.humidity}%</Typography>
        <Slider
          disabled={controls.simulation_enabled}
          value={controls.humidity}
          onChange={(e, val) => setControls(prev => ({ ...prev, humidity: val }))}
          min={0} max={100}
          color="info"
        />

        <Button variant="contained" fullWidth onClick={applyControls} sx={{ mt: 3, mb: 2 }}>
          Apply Conditions
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" size="small" fullWidth onClick={() => setPreset('normal')}>Normal</Button>
          <Button variant="outlined" color="error" size="small" fullWidth onClick={() => setPreset('heat_stress')}>Heat Stress</Button>
        </Box>
      </Box>
    </Drawer>
  );
}