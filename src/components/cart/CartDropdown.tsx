import { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Drawer, 
  Typography, 
  Button, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  IconButton,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Close, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { 
  selectCartItems, 
  selectCartTotal, 
  removeFromCart, 
  updateQuantity, 
  clearCart 
} from '../../store/slices/cartSlice';

const drawerWidth = 360;

interface CartDropdownProps {
  open: boolean;
  onClose: () => void;
}

export const CartDropdown = ({ open, onClose }: CartDropdownProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const [drawerWidth, setDrawerWidth] = useState<number | string>(360);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDrawerWidth(isMobile ? '100%' : 360);
  }, [isMobile]);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    } else {
      handleRemoveItem(itemId);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          p: 2,
        },
      }}
      ref={drawerRef}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Tu Carrito</Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>
      
      <Divider />
      
      {items.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body1">Tu carrito está vacío</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={() => {
              onClose();
              navigate('/');
            }}
          >
            Seguir comprando
          </Button>
        </Box>
      ) : (
        <>
          <List sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: '60vh' }}>
            {items.map((item: any) => (
              <ListItem 
                key={item.id}
                secondaryAction={
                  <IconButton 
                    edge="end" 
                    aria-label="delete"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Delete />
                  </IconButton>
                }
                sx={{ 
                  mb: 1, 
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  boxShadow: 1
                }}
              >
                <ListItemAvatar>
                  <Avatar 
                    src={item.image} 
                    alt={item.name}
                    variant="rounded"
                    sx={{ width: 64, height: 64, mr: 2 }}
                  />
                </ListItemAvatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${item.price.toFixed(2)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Button 
                      size="small" 
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      sx={{ minWidth: '32px' }}
                    >
                      -
                    </Button>
                    <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                    <Button 
                      size="small" 
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      sx={{ minWidth: '32px' }}
                    >
                      +
                    </Button>
                  </Box>
                </Box>
                <Typography variant="subtitle1" sx={{ ml: 2, fontWeight: 'bold' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Typography>
              </ListItem>
            ))}
          </List>
          
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              mt: 2,
              position: 'sticky',
              bottom: 0,
              bgcolor: 'background.paper'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6">${total.toFixed(2)}</Typography>
            </Box>
            <Button 
              fullWidth 
              variant="contained" 
              color="primary"
              size="large"
              onClick={handleCheckout}
            >
              Proceder al pago
            </Button>
          </Paper>
        </>
      )}
    </Drawer>
  );
};

export default CartDropdown;
