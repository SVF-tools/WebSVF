import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a default Material-UI theme
const defaultTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

export const Providers: React.FC = ({ children }) => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </BrowserRouter>
  );
};
