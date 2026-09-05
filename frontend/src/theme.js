import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Leaf Green
      light: '#60ad5e',
      dark: '#005005',
    },
    secondary: {
      main: '#8d6e63', // Earth Brown
    },
    background: {
      default: '#f9fbe7',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
      fontSize: '1.05rem',
    }
  },
  shape: {
    borderRadius: 12,
  },
});