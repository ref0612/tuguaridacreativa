import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { Box, Container, AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import store from '@/store/store';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import CheckoutPage from '@/pages/CheckoutPage';
import { CartDropdown } from '@/components/cart/CartDropdown';
import { CartIcon } from '@/components/cart/CartIcon';

// Crear un tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
    h3: {
      fontWeight: 500,
    },
  },
});

const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TuTienda
          </Typography>
          <IconButton color="inherit" onClick={() => setCartOpen(true)}>
            <CartIcon onClick={() => {}} />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>
      
      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: (theme) => theme.palette.grey[200] }}>
        <Container maxWidth="sm">
          <Typography variant="body1" color="text.secondary" align="center">
            © {new Date().getFullYear()} TuTienda. Todos los derechos reservados.
          </Typography>
        </Container>
      </Box>
      
      <CartDropdown open={cartOpen} onClose={() => setCartOpen(false)} />
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
            <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
            <Route path="/checkout" element={<MainLayout><CheckoutPage /></MainLayout>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
