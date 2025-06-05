import { ProductCard } from '../products/ProductCard';
import { Carousel } from '../ui/Carousel';
import { Product } from '../products/ProductList';

interface FeaturedProductsProps {
  products: Product[];
  onAddToCart?: (productId: string) => void;
  onToggleFavorite?: (productId: string) => void;
  className?: string;
}

export function FeaturedProducts({
  products,
  onAddToCart,
  onToggleFavorite,
  className = '',
}: FeaturedProductsProps) {
  if (products.length === 0) return null;

  // Agrupar productos en grupos de 4 para el carrusel
  const productGroups = [];
  for (let i = 0; i < products.length; i += 4) {
    productGroups.push(products.slice(i, i + 4));
  }

  return (
    <div className={`relative ${className}`}>
      <Carousel
        autoPlay={true}
        interval={6000}
        showArrows={productGroups.length > 1}
        showDots={productGroups.length > 1}
      >
        {productGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {group.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onAddToCart={onAddToCart}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
            {/* Rellenar con elementos vacíos si es necesario para mantener el diseño */}
            {group.length < 4 &&
              Array(4 - group.length)
                .fill(null)
                .map((_, i) => <div key={`empty-${i}`} className="h-0" />)}
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default FeaturedProducts;
