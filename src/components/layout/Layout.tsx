import React, { ReactNode, useEffect } from 'react';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAppDispatch } from '@/store/store';
import { loadCart } from '@/store/slices/cartSlice';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  // Cargar el carrito al montar el componente
  useEffect(() => {
    dispatch(loadCart());
  }, [dispatch]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
        }}
      >
        <Container maxWidth={false} sx={{ mt: 2 }}>
          {children}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
