import React from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  Divider 
} from '@mui/material';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { useAppSelector } from '@/store/store';
import { selectCartItems, selectCartTotal } from '@/store/slices/cartSlice';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description?: string;
}

const OrderSummary = () => {
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>Resumen del pedido</Typography>
      <List>
        {items.map((item: CartItem) => (
          <ListItem key={item.id}>
            <Box sx={{ 
              mr: 2, 
              width: 56, 
              height: 56, 
              backgroundColor: '#f5f5f5', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              {item.image ? (
                <img 
                  src={item.image} 
                  alt={item.name} 
                  style={{ maxWidth: '100%', maxHeight: '100%' }} 
                />
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

export default OrderSummary;
