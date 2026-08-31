import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = {
  getLatestTelemetry: () => axios.get(`${API_BASE}/telemetry/latest`),
  getTelemetryHistory: (hours = 24) => axios.get(`${API_BASE}/telemetry/history?hours=${hours}`),
  getAlerts: () => axios.get(`${API_BASE}/alerts`),
  updateAlert: (id, status) => axios.patch(`${API_BASE}/alerts/${id}`, { status }),
  getControls: () => axios.get(`${API_BASE}/controls`),
  updateControls: (data) => axios.post(`${API_BASE}/controls`, data),
  diagnoseImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_BASE}/diagnose`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};