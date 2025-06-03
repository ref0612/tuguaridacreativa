import { Badge, IconButton, styled } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useAppSelector } from '../../store/hooks';
import { selectCartItemsCount } from '../../store/slices/cartSlice';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

interface CartIconProps {
  onClick: () => void;
}

export const CartIcon = ({ onClick }: CartIconProps) => {
  const itemCount = useAppSelector(selectCartItemsCount);

  return (
    <IconButton aria-label="cart" onClick={onClick} color="inherit">
      <StyledBadge badgeContent={itemCount} color="secondary">
        <ShoppingCart />
      </StyledBadge>
    </IconButton>
  );
};

export default CartIcon;
