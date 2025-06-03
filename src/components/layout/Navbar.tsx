import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { logoutUser } from '../../store/slices/authSlice';
import { loadCart } from '../../store/slices/cartSlice';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Container,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
  ExitToApp as ExitToAppIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  // Cargar el carrito al montar el componente
  useEffect(() => {
    dispatch(loadCart());
  }, [dispatch]);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    handleMenuClose();
    navigate('/');
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  // Calcular el total de ítems en el carrito
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => {
        handleMenuClose();
        navigate('/profile');
      }}>
        <PersonIcon sx={{ mr: 1 }} /> Perfil
      </MenuItem>
      {user?.role === 'ADMIN' && (
        <MenuItem onClick={() => {
          handleMenuClose();
          navigate('/admin/dashboard');
        }}>
          <DashboardIcon sx={{ mr: 1 }} /> Panel de Administración
        </MenuItem>
      )}
      <Divider />
      <MenuItem onClick={handleLogout}>
        <ExitToAppIcon sx={{ mr: 1 }} /> Cerrar Sesión
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => {
        handleMobileMenuClose();
        navigate('/cart');
      }}>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={cartItemsCount} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <p>Carrito</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <Avatar sx={{ width: 32, height: 32 }}>
            {user?.firstName?.[0]?.toUpperCase()}
          </Avatar>
        </IconButton>
        <p>Perfil</p>
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar position="sticky">
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          {/* Logo y nombre de la tienda */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: 'flex',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
              alignItems: 'center',
            }}
          >
            Mi Tienda
          </Typography>

          {/* Menú de navegación */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 3 }}>
            <Button
              component={RouterLink}
              to="/products"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Productos
            </Button>
            <Button
              component={RouterLink}
              to="/about"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Sobre Nosotros
            </Button>
            <Button
              component={RouterLink}
              to="/contact"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Contacto
            </Button>
          </Box>

          {/* Iconos de acción */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Carrito de compras */}
            <Tooltip title="Carrito">
              <IconButton
                size="large"
                color="inherit"
                component={RouterLink}
                to="/cart"
                sx={{ mr: 1 }}
              >
                <Badge badgeContent={cartItemsCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Menú de usuario */}
            {isAuthenticated ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                  sx={{ display: { xs: 'none', md: 'flex' } }}
                >
                  <Avatar
                    sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}
                    alt={user?.firstName}
                  >
                    {user?.firstName?.[0]?.toUpperCase()}
                  </Avatar>
                </IconButton>
                <Typography 
                  variant="body1" 
                  sx={{ ml: 1, display: { xs: 'none', md: 'block' } }}
                >
                  Hola, {user?.firstName}
                </Typography>

                {/* Menú móvil */}
                <IconButton
                  size="large"
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                  sx={{ display: { xs: 'flex', md: 'none' } }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  color="inherit"
                  variant="outlined"
                  size="small"
                  sx={{ 
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    },
                  }}
                >
                  Iniciar Sesión
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  color="secondary"
                  variant="contained"
                  size="small"
                  sx={{
                    display: { xs: 'none', sm: 'inline-flex' },
                  }}
                >
                  Registrarse
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
      {renderMobileMenu}
      {renderMenu}
    </AppBar>
  );
};

export default Navbar;
