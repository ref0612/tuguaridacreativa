import { Box, Drawer, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store/store';
import { selectCartItems, selectCartTotal } from '@/store/slices/cartSlice';

interface CartDropdownProps {
  open: boolean;
  onClose: () => void;
}

export const CartDropdown = ({ open, onClose }: CartDropdownProps) => {
  const navigate = useNavigate();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 360,
          maxWidth: '100%',
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Carrito de Compras</Typography>
      </Box>
      
      {items.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">Tu carrito está vacío</Typography>
        </Box>
      ) : (
        <Box sx={{ p: 2 }}>
          <Typography variant="body1">Productos en el carrito: {items.length}</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>Total: ${total.toFixed(2)}</Typography>
          
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleCheckout}
            disabled={items.length === 0}
            sx={{ mt: 2 }}
          >
            Proceder al pago
          </Button>
        </Box>
      )}
    </Drawer>
  );
};

export default CartDropdown;
