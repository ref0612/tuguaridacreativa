import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  rating?: number;
  reviewCount?: number;
  isFavorite?: boolean;
  onAddToCart?: (productId: string) => void;
  onToggleFavorite?: (productId: string) => void;
  className?: string;
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  imageUrl,
  rating = 0,
  reviewCount = 0,
  isFavorite = false,
  onAddToCart,
  onToggleFavorite,
  className = '',
}: ProductCardProps) {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  
  return (
    <div className={`group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
        <Link href={`/products/${id}`} className="block h-full w-full">
          <Image
            src={imageUrl}
            alt={name}
            width={400}
            height={400}
            className="h-full w-full object-cover object-center group-hover:opacity-75"
            priority={false}
          />
        </Link>
        
        {discount > 0 && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </span>
        )}
        
        <button
          type="button"
          onClick={() => onToggleFavorite?.(id)}
          className={`absolute top-2 left-2 p-2 rounded-full ${isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} bg-white/80 hover:bg-white transition-colors`}
          aria-label={isFavorite ? 'Eliminar de favoritos' : 'Añadir a favoritos'}
        >
          <Heart
            className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`}
            aria-hidden="true"
          />
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 h-12">
              <Link href={`/products/${id}`}>
                <span aria-hidden="true" className="absolute inset-0" />
                {name}
              </Link>
            </h3>
            
            <div className="mt-1 flex items-center">
              {[0, 1, 2, 3, 4].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${star < Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  aria-hidden="true"
                />
              ))}
              <span className="ml-1 text-xs text-gray-500">
                {reviewCount > 0 ? `(${reviewCount})` : 'Sin reseñas'}
              </span>
            </div>
          </div>
          
          <div className="text-right">
            {originalPrice && originalPrice > price ? (
              <>
                <p className="text-sm font-medium text-gray-900">{formatPrice(price)}</p>
                <p className="text-xs text-gray-500 line-through">{formatPrice(originalPrice)}</p>
              </>
            ) : (
              <p className="text-sm font-medium text-gray-900">{formatPrice(price)}</p>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => onAddToCart?.(id)}
          >
            <ShoppingCart className="h-4 w-4" />
            Añadir al carrito
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
