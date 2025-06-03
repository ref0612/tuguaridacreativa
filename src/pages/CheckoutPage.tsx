import OrderSummary from '@/components/OrderSummary';
import { Container, Typography, Box } from '@mui/material';

// Las interfaces se han movido a types/index.ts para ser reutilizadas

const CheckoutPage: React.FC = () => {
  // Estado y lógica del componente...
  // Se han eliminado imports no utilizados para limpiar los warnings de ESLint
  
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
