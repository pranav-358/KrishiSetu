import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Deep nature green
      light: '#60ad5e',
      dark: '#005005',
    },
    secondary: {
      main: '#8d6e63', // Earthy brown
    },
    background: {
      default: '#f9fbe7', // Very light green/white tint
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none', // Better readability for rural users
      fontSize: '1.1rem',
    }
  },
  shape: {
    borderRadius: 12, // Softer, modern rounded corners
  },
});