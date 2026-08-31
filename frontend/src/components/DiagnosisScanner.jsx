import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { UploadCloud } from 'lucide-react';
import { api } from '../services/api';

export default function DiagnosisScanner() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(URL.createObjectURL(selected));
    setLoading(true);
    setError('');
    
    try {
      const res = await api.diagnoseImage(selected);
      setResult(res.data);
    } catch (err) {
      setError('Unable to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ borderRadius: 4, maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">Crop Disease Scanner</Typography>
        <Typography color="textSecondary" mb={4}>
          Upload a clear photo of the affected plant leaf for an instant assessment.
        </Typography>

        {!file && (
          <Button
            variant="contained"
            component="label"
            size="large"
            sx={{ bgcolor: '#2e7d32', py: 2, px: 4, borderRadius: 2 }}
            startIcon={<UploadCloud />}
          >
            Select Photo
            <input type="file" hidden accept="image/jpeg, image/png" onChange={handleUpload} />
          </Button>
        )}

        {loading && <CircularProgress sx={{ mt: 4, color: '#2e7d32' }} />}

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        {result && !loading && (
          <div style={{ marginTop: '24px', textAlign: 'left' }}>
            <img src={file} alt="Crop" style={{ width: '100%', borderRadius: '8px', marginBottom: '16px' }} />
            <Alert severity={result.urgency === 'high' ? 'error' : 'info'} sx={{ mb: 2 }}>
              <strong>{result.name}</strong> ({result.confidence}% confidence)
            </Alert>
            <Typography variant="subtitle1" fontWeight="bold">Treatment:</Typography>
            <Typography paragraph>{result.treatment}</Typography>
            <Typography variant="subtitle1" fontWeight="bold">Prevention:</Typography>
            <Typography paragraph>{result.prevention}</Typography>
            
            <Button variant="outlined" fullWidth onClick={() => { setFile(null); setResult(null); }}>
              Scan Another Image
            </Button>
            <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 2, textAlign: 'center' }}>
              Disclaimer: AI diagnosis is advisory. Consult a local agronomist for severe cases.
            </Typography>
          </div>
        )}
      </CardContent>
    </Card>
  );
}