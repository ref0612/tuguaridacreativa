import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container, AppBar, Toolbar, Typography } from '@mui/material';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import CheckoutPage from '@/pages/CheckoutPage';





const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  // Estado del carrito comentado temporalmente
  // const [cartOpen, setCartOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TuTienda
          </Typography>
          {/* Botón del carrito temporalmente deshabilitado */}
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
      
      {/* CartDropdown ha sido eliminado temporalmente */}
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
