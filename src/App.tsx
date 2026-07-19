// src/App.tsx
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './presentation/theme/theme';
import { InvitationPage } from './presentation/pages/InvitationPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <InvitationPage />
    </ThemeProvider>
  );
}

export default App;
