import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton } from '@mui/material';
import { Sprout, Settings, Activity, Camera } from 'lucide-react';
import TelemetryDashboard from './components/TelemetryDashboard';
import DiagnosisScanner from './components/DiagnosisScanner';
import AdminDrawer from './components/AdminDrawer';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f9fbe7' }}>
      <AppBar position="static" elevation={1} sx={{ bgcolor: '#2e7d32' }}>
        <Toolbar>
          <Sprout size={30} style={{ marginRight: '12px' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            KrishiSetu
          </Typography>
          
          <Button 
            color="inherit" 
            startIcon={<Activity size={18} />}
            onClick={() => setCurrentView('dashboard')}
            sx={{ mr: 1, opacity: currentView === 'dashboard' ? 1 : 0.7 }}
          >
            Dashboard
          </Button>
          
          <Button 
            color="inherit" 
            startIcon={<Camera size={18} />}
            onClick={() => setCurrentView('diagnosis')}
            sx={{ mr: 1, opacity: currentView === 'diagnosis' ? 1 : 0.7 }}
          >
            Scan Crop
          </Button>

          <IconButton color="inherit" onClick={() => setAdminOpen(true)}>
            <Settings />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        {currentView === 'dashboard' ? <TelemetryDashboard /> : <DiagnosisScanner />}
      </Container>

      <AdminDrawer open={adminOpen} onClose={() => setAdminOpen(false)} />
    </Box>
  );
}