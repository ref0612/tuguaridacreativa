import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container,
  Typography, 
  Button, 
  TextField, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel, 
  StepContent,
  Card, 
  CardContent, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton,
  Alert,
  CircularProgress,
  Box,
  Grid
} from '@mui/material';
import { 
  LocalShipping as ShippingIcon, 
  Payment as PaymentIcon, 
  CheckCircle as CheckCircleIcon,
  ShoppingCart as ShoppingCartIcon 
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/store';
import { selectCartItems, selectCartTotal, clearCart } from '../store/slices/cartSlice';
import paymentService from '../services/payment.service';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description?: string;
}

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

const steps = ['Envío', 'Pago', 'Confirmación'];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  
  const itemsInCart = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    if (itemsInCart.length === 0 && !orderSuccess) {
      navigate('/');
    }
  }, [itemsInCart, orderSuccess, navigate]);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Crear la preferencia de pago en Mercado Pago
      const items = itemsInCart.map((item: CartItem) => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        quantity: item.quantity,
        price: item.price,
      }));
      
      // Generar un ID de orden
      const newOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(newOrderId);
      
      // Obtener la URL de pago de Mercado Pago
      const paymentUrl = await paymentService.createMercadoPagoPreference(items, newOrderId);
      
      // Redirigir a Mercado Pago
      window.location.href = paymentUrl;
      
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
            <TextField
              required
              fullWidth
              label="Nombre"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              required
              fullWidth
              label="Apellido"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              margin="normal"
            />
            <Box sx={{ gridColumn: '1 / -1' }}>
              <TextField
                required
                fullWidth
                label="Correo electrónico"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
              />
            </Box>
            <Box sx={{ gridColumn: '1 / -1' }}>
              <TextField
                required
                fullWidth
                label="Dirección"
                name="address"
                value={formData.address}
                onChange={handleChange}
                margin="normal"
              />
            </Box>
            <Box>
              <TextField
                required
                fullWidth
                label="Ciudad"
                name="city"
                value={formData.city}
                onChange={handleChange}
                margin="normal"
              />
            </Box>
            <Box>
              <TextField
                required
                fullWidth
                label="Código postal"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                margin="normal"
              />
            </Box>
            <Box sx={{ gridColumn: '1 / -1' }}>
              <TextField
                required
                fullWidth
                label="País"
                name="country"
                value={formData.country}
                onChange={handleChange}
                margin="normal"
              />
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
            <Box sx={{ gridColumn: '1 / -1' }}>
              <TextField
                required
                fullWidth
                label="Número de tarjeta"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                margin="normal"
                placeholder="1234 5678 9012 3456"
              />
            </Box>
            <Box sx={{ gridColumn: '1 / -1' }}>
              <TextField
                required
                fullWidth
                label="Nombre en la tarjeta"
                name="cardName"
                value={formData.cardName}
                onChange={handleChange}
                margin="normal"
              />
            </Box>
            <Box>
              <TextField
                required
                fullWidth
                label="Fecha de vencimiento"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                margin="normal"
                placeholder="MM/AA"
              />
            </Box>
            <Box>
              <TextField
                required
                fullWidth
                label="CVV"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                margin="normal"
                type="password"
              />
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Resumen del pedido
            </Typography>
            <List>
              {itemsInCart.map((item) => (
                <ListItem key={item.id}>
                  <Box sx={{ mr: 2, width: 56, height: 56, backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.image ? (
                      <Box component="img" src={item.image} alt={item.name} sx={{ maxWidth: '100%', maxHeight: '100%' }} />
                    ) : (
                      <Box sx={{ color: 'text.secondary' }}>No image</Box>
                    )}
                  </Box>
                  <ListItemText
                    primary={item.name}
                    secondary={`Cantidad: ${item.quantity}`}
                    sx={{ flex: 1 }}
                  />
                  <Typography variant="body2">
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1">Subtotal</Typography>
              <Typography>${total.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1">Envío</Typography>
              <Typography>Gratis</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">${total.toFixed(2)}</Typography>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  const renderSuccessMessage = () => {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          ¡Pedido realizado con éxito!
        </Typography>
        <Typography variant="body1" paragraph>
          Tu pedido ha sido procesado correctamente.
        </Typography>
        <Typography variant="body1" paragraph>
          Número de pedido: {orderId}
        </Typography>
        <Typography variant="body1" paragraph>
          Hemos enviado un correo de confirmación a {formData.email}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Volver a la tienda
        </Button>
      </Box>
    );
  };

  // Página de éxito después del pago
  const searchParams = new URLSearchParams(window.location.search);
  const paymentStatus = searchParams.get('status');
  const paymentId = searchParams.get('payment_id');
  const externalReference = searchParams.get('external_reference');

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (paymentId && paymentStatus) {
        try {
          const status = await paymentService.getPaymentStatus(paymentId);
          if (status.status === 'approved') {
            // Pago exitoso
            setOrderId(externalReference || '');
            setOrderSuccess(true);
            dispatch(clearCart());
            // Limpiar la URL
            window.history.replaceState({}, document.title, '/checkout/success');
          }
        } catch (error) {
          console.error('Error al verificar el estado del pago:', error);
        }
      }
    };

    checkPaymentStatus();
  }, [paymentId, paymentStatus, externalReference, dispatch]);
  
  const renderOrderSummary = () => {
    const items = useAppSelector(selectCartItems);
    const total = useAppSelector(selectCartTotal);
    
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>Resumen del pedido</Typography>
        <List>
          {items.map((item) => (
            <ListItem key={item.id}>
              <Box sx={{ mr: 2, width: 56, height: 56, backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.image ? (
                  <img src={item.image} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                ) : (
                  <ShoppingCartIcon color="action" />
                )}
              </Box>
              <ListItemText
                primary={item.name}
                secondary={`Cantidad: ${item.quantity}`}
              />
              <ListItemSecondaryAction>
                <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Typography variant="h6">Total</Typography>
          <Typography variant="h6">${total.toFixed(2)}</Typography>
        </Box>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (orderSuccess) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        {renderSuccessMessage()}
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Finalizar Compra
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
        <Box>
          {renderStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mt: 1, mr: 1 }}
            >
              Atrás
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={
                (activeStep === 0 && (
                  !formData.firstName ||
                  !formData.lastName ||
                  !formData.email ||
                  !formData.address ||
                  !formData.city ||
                  !formData.zipCode ||
                  !formData.country
                )) ||
                (activeStep === 1 && !formData.cardNumber) ||
                (activeStep === 1 && !formData.cardName) ||
                (activeStep === 1 && !formData.expiryDate) ||
                (activeStep === 1 && !formData.cvv) ||
                loading
              }
            >
              {activeStep === steps.length - 1 ? 'Finalizar compra' : 'Siguiente'}
            </Button>
          </Box>
        </Box>

        {/* Resumen del pedido */}
        <Box>
          <Paper sx={{ p: 3, position: 'sticky', top: 16 }}>
            {renderOrderSummary()}
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default CheckoutPage;
