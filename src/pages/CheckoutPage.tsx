import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderSummary from '@/components/OrderSummary';
import { 
  Container,
  Typography, 
  Button, 
  TextField, 
  Stepper, 
  Step, 
  StepLabel, 
  StepContent,
  List, 
  ListItem, 
  ListItemText,
  Alert,
  CircularProgress,
  Box
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { selectCartItems, selectCartTotal, clearCart } from '@/store/slices/cartSlice';
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

const CheckoutPage: React.FC = () => {
  // Estado y lógica del componente...
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Finalizar Compra
      </Typography>
      <Box sx={{ mt: 4 }}>
        <OrderSummary />
      </Box>
    </Container>
  );
};

export default CheckoutPage;
