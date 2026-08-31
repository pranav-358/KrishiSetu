import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton } from '@mui/material';
import { Sprout, Settings, Activity, Camera } from 'lucide-react';
import TelemetryDashboard from './components/TelemetryDashboard';
import DiagnosisScanner from './components/DiagnosisScanner';
import AdminDrawer from './components/AdminDrawer';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' or 'diagnosis'
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Sprout size={32} style={{ marginRight: '12px', color: '#fff' }} />
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            KrishiSetu
          </Typography>
          
          <Button 
            color="inherit" 
            startIcon={<Activity size={20} />}
            onClick={() => setCurrentView('dashboard')}
            sx={{ mr: 2, opacity: currentView === 'dashboard' ? 1 : 0.7 }}
          >
            Dashboard
          </Button>
          
          <Button 
            color="inherit" 
            startIcon={<Camera size={20} />}
            onClick={() => setCurrentView('diagnosis')}
            sx={{ mr: 2, opacity: currentView === 'diagnosis' ? 1 : 0.7 }}
          >
            Scan Crop
          </Button>

          <IconButton color="inherit" onClick={() => setAdminOpen(true)}>
            <Settings />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        {currentView === 'dashboard' ? <TelemetryDashboard /> : <DiagnosisScanner />}
      </Container>

      {/* Admin / Demo Control Drawer */}
      <AdminDrawer open={adminOpen} onClose={() => setAdminOpen(false)} />
    </Box>
  );
}