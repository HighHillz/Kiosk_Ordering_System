import React, { useState } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import SettingsPage from './pages/SettingsPage';
import KitchenDisplay from './pages/KitchenDisplay';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366F1', // Indigo
    },
    secondary: {
      main: '#EC4899', // Pink
    },
    background: {
      default: '#F9FAFB',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem('token')
  );

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoginPage onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar onLogout={handleLogout} />
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <TopBar />
            <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default' }}>
              <Routes>
                <Route path="/" element={<Navigate to="/products" replace />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/kitchen" element={<KitchenDisplay />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
