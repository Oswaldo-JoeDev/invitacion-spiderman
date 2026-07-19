// src/presentation/theme/theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff1c24', // spider-man red
    },
    secondary: {
      main: '#00f0ff', // spider-verse cian
    },
    background: {
      default: '#070709',
      paper: 'rgba(16, 16, 22, 0.85)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#a0a0ab',
    },
  },
  typography: {
    fontFamily: "'Outfit', sans-serif",
    h1: {
      fontFamily: "'Space Grotesk', sans-serif",
      fontWeight: 800,
    },
    h2: {
      fontFamily: "'Space Grotesk', sans-serif",
      fontWeight: 800,
    },
    h3: {
      fontFamily: "'Space Grotesk', sans-serif",
      fontWeight: 700,
    },
    h4: {
      fontFamily: "'Space Grotesk', sans-serif",
      fontWeight: 700,
    },
    h5: {
      fontFamily: "'Space Grotesk', sans-serif",
      fontWeight: 700,
    },
    h6: {
      fontFamily: "'Space Grotesk', sans-serif",
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          textTransform: 'uppercase',
          fontWeight: 700,
          letterSpacing: '1px',
        },
      },
    },
  },
});
