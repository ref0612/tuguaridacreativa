import React, { useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  ArrowForward as ArrowForwardIcon,
  Star as StarIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon,
  SupportAgent as SupportIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchFeaturedProducts } from '../store/slices/productsSlice';
import { Product } from '../types';

interface ProductCardProps {
  id: string | number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  stock: number;
  category: string;
  rating?: number;
  numReviews?: number;
  isFeatured?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const productsState = useAppSelector(
    (state: any) => state.products || {}
  );
  
  // Ensure we have safe defaults
  const { featuredProducts = [], loading = false, error = null } = productsState;
  
  // Ensure featuredProducts is always an array
  const safeFeaturedProducts: ProductCardProps[] = Array.isArray(featuredProducts) 
    ? featuredProducts.map(p => ({
        id: p.id || Math.random().toString(36).substr(2, 9),
        name: p.name || 'Producto sin nombre',
        description: p.description || '',
        price: typeof p.price === 'number' ? p.price : 0,
        originalPrice: typeof p.originalPrice === 'number' ? p.originalPrice : undefined,
        imageUrl: p.imageUrl || p.image || '/images/placeholder-product.png',
        stock: typeof p.stock === 'number' ? p.stock : 0,
        category: p.category || 'Sin categoría',
        rating: typeof p.rating === 'number' ? Math.min(5, Math.max(0, p.rating)) : 0,
        numReviews: typeof p.numReviews === 'number' ? p.numReviews : 0,
        isFeatured: p.isFeatured || false,
        isActive: p.isActive !== false,
        createdAt: p.createdAt || new Date().toISOString(),
        updatedAt: p.updatedAt || new Date().toISOString(),
      }))
    : [];

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  const features = [
    {
      icon: <ShippingIcon color="primary" fontSize="large" />,
      title: 'Envío Rápido',
      description: 'Envío rápido y seguro a todo el país',
    },
    {
      icon: <SecurityIcon color="primary" fontSize="large" />,
      title: 'Pago Seguro',
      description: 'Procesamiento de pagos seguro con cifrado SSL',
    },
    {
      icon: <RefreshIcon color="primary" fontSize="large" />,
      title: 'Devolución Fácil',
      description: '30 días de garantía de devolución',
    },
    {
      icon: <SupportIcon color="primary" fontSize="large" />,
      title: 'Soporte 24/7',
      description: 'Soporte al cliente disponible en todo momento',
    },
  ];

  if (loading && !featuredProducts.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Alert severity="error">Error al cargar los productos: {error}</Alert>
      </Container>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/hero-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          py: 12,
          mb: 6,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant={isMobile ? 'h4' : 'h2'}
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              mb: 3,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            Bienvenido a Nuestra Tienda
          </Typography>
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            component="p"
            gutterBottom
            sx={{
              mb: 4,
              maxWidth: '800px',
              mx: 'auto',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            Descubre nuestra amplia selección de productos de alta calidad a precios increíbles
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/products')}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: isMobile ? '0.875rem' : '1rem',
              }}
            >
              Ver Productos
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              onClick={() => window.scrollTo({ top: document.getElementById('featured')?.offsetTop, behavior: 'smooth' })}
              sx={{
                px: 4,
                py: 1.5,
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.8)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                fontSize: isMobile ? '0.875rem' : '1rem',
              }}
            >
              Ofertas Destacadas
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
          {features.map((feature, index) => (
            <Box key={index}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 3,
                  height: '100%',
                  '&:hover': {
                    '& .feature-icon': {
                      transform: 'translateY(-5px)',
                      transition: 'transform 0.3s ease',
                    },
                  },
                }}
              >
                <Box
                  className="feature-icon"
                  sx={{
                    backgroundColor: 'primary.light',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    transition: 'transform 0.3s ease',
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Featured Products */}
      <Box id="featured" sx={{ py: 6, backgroundColor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
              Productos Destacados
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/products')}
              size={isMobile ? 'small' : 'medium'}
            >
              Ver Todos
            </Button>
          </Box>

          {loading && !featuredProducts.length ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              Error al cargar los productos: {error}
            </Alert>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
              {safeFeaturedProducts.slice(0, 4).map((product: any) => (
                <Box key={product.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3,
                      },
                    }}
                  >
                    <Box sx={{ position: 'relative', pt: '100%' }}>
                      <CardMedia
                        component="img"
                        image={product.imageUrl}
                        alt={product.name}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      {product.stock === 0 && (
                        <Chip
                          label="Agotado"
                          color="error"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            fontWeight: 'bold',
                          }}
                        />
                      )}
                      {product.stock > 0 && product.stock < 10 && (
                        <Chip
                          label={`¡Solo ${product.stock} disponibles!`}
                          color="warning"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            fontWeight: 'bold',
                          }}
                        />
                      )}
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        gutterBottom
                        variant="subtitle1"
                        component="h3"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          minHeight: '3em',
                          fontWeight: 'medium',
                        }}
                      >
                        {product.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex' }}>
                          {[1, 2, 3, 4, 5].map((value) => {
                          const ratingValue = typeof product.rating === 'number' 
                            ? Math.min(5, Math.max(0, product.rating)) 
                            : 0;
                          return (
                            <StarIcon
                              key={value}
                              sx={{
                                color: value <= Math.round(ratingValue)
                                  ? 'gold'
                                  : 'action.disabled',
                                fontSize: '1rem',
                              }}
                            />
                          );
                        })}
                        </Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: 0.5 }}
                        >
                          ({product.numReviews || 0})
                        </Typography>
                      </Box>
                      <Typography
                        variant="h6"
                        color="primary"
                        sx={{ fontWeight: 'bold', mt: 'auto' }}
                      >
                        ${product.price.toFixed(2)}
                        {product.originalPrice && (
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              textDecoration: 'line-through',
                              ml: 1,
                            }}
                          >
                            ${product.originalPrice.toFixed(2)}
                          </Typography>
                        )}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        startIcon={<ShoppingCartIcon />}
                        onClick={() => {
                          // Aquí iría la lógica para agregar al carrito
                        }}
                        disabled={product.stock === 0}
                      >
                        {product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
              ))}
            </Box>
          )}
        </Container>
      </Box>

      {/* Call to Action */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: 8,
          my: 8,
          borderRadius: 2,
        }}
      >
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 'bold', mb: 3 }}
            >
              ¿Listo para comenzar a comprar?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}>
              Únete a miles de clientes satisfechos que ya están disfrutando de nuestros
              productos de alta calidad.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/register')}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: isMobile ? '0.875rem' : '1rem',
                backgroundColor: 'white',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              Crear Cuenta
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
