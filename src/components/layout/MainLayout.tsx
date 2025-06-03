import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const MainLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
                flexGrow: 1,
              }}
            >
              Mi Tienda
            </Typography>
            <Box>
              <Button
                component={RouterLink}
                to="/login"
                sx={{ color: 'white' }}
              >
                Iniciar Sesión
              </Button>
              <Button
                component={RouterLink}
                to="/register"
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white', ml: 2 }}
              >
                Registrarse
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
      <Box component="footer" sx={{ py: 3, backgroundColor: 'primary.main', color: 'white' }}>
        <Container maxWidth="xl">
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} Mi Tienda. Todos los derechos reservados.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
