import React from 'react';
import Link from 'next/link';
import { Star, Shield, Truck, Check, Brush, Palette, Ruler, Gift, Layers, Package } from 'lucide-react';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProductList } from '@/components/products/ProductList';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';

// Datos de ejemplo para productos destacados
const featuredProducts = [
  {
    id: '1',
    name: 'Kit de Acuarelas Profesional',
    price: 29.99,
    originalPrice: 39.99,
    imageUrl: 'https://images.unsplash.com/photo-1579762715118-a6f1d4b934c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    reviewCount: 128,
    isFavorite: false,
  },
  {
    id: '2',
    name: 'Cuaderno de Bocetos A4',
    price: 12.99,
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.2,
    reviewCount: 89,
    isFavorite: true,
  },
  {
    id: '3',
    name: 'Set de Pinceles Profesionales',
    price: 24.99,
    originalPrice: 34.99,
    imageUrl: 'https://images.unsplash.com/photo-1586634246479-8a0dedfdcb43?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 156,
    isFavorite: false,
  },
  {
    id: '4',
    name: 'Lápices de Colores x24',
    price: 18.99,
    imageUrl: 'https://images.unsplash.com/photo-1582582621959-48d27397dc69?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviewCount: 204,
    isFavorite: false,
  },
];

// Datos de ejemplo para productos nuevos
const newArrivals = [
  {
    id: '5',
    name: 'Set de Acuarelas en Pastillas',
    price: 34.99,
    imageUrl: 'https://images.unsplash.com/photo-1574156936811-a3f00ca7f1d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 42,
    isFavorite: false,
  },
  {
    id: '6',
    name: 'Block de Papel para Acuarela',
    price: 15.99,
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.3,
    reviewCount: 31,
    isFavorite: true,
  },
  {
    id: '7',
    name: 'Tinta China Negra',
    price: 9.99,
    originalPrice: 12.99,
    imageUrl: 'https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    reviewCount: 27,
    isFavorite: false,
  },
  {
    id: '8',
    name: 'Set de Lápices de Grafito',
    price: 22.99,
    imageUrl: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 63,
    isFavorite: false,
  },
];

// Datos de ejemplo para ofertas especiales
const specialOffers = [
  {
    id: '9',
    name: 'Kit Completo de Arte',
    price: 89.99,
    originalPrice: 129.99,
    imageUrl: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 187,
    isFavorite: false,
  },
  {
    id: '10',
    name: 'Mesa de Dibujo Profesional',
    price: 149.99,
    originalPrice: 199.99,
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 92,
    isFavorite: true,
  },
  {
    id: '11',
    name: 'Set de Pinceles Premium',
    price: 39.99,
    originalPrice: 59.99,
    imageUrl: 'https://images.unsplash.com/photo-1579546978709-7d9c1e2b6069?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 143,
    isFavorite: false,
  },
  {
    id: '12',
    name: 'Maletín de Arte Profesional',
    price: 79.99,
    originalPrice: 99.99,
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviewCount: 78,
    isFavorite: false,
  },
];

// Datos para características de la tienda
const features = [
  {
    name: 'Productos de Calidad',
    description: 'Seleccionamos cuidadosamente cada producto para garantizar la mejor calidad.',
    icon: Star,
  },
  {
    name: 'Envío Rápido',
    description: 'Envíos rápidos y seguros a todo el país.',
    icon: Truck,
  },
  {
    name: 'Garantía de Satisfacción',
    description: 'Si no estás satisfecho, te devolvemos tu dinero.',
    icon: Shield,
  },
  {
    name: 'Soporte 24/7',
    description: 'Nuestro equipo está disponible para ayudarte en cualquier momento.',
    icon: Check,
  },
];

const Home = () => {
  // Manejadores para las acciones de los productos
  const handleAddToCart = (productId: string) => {
    console.log('Añadir al carrito:', productId);
    // Aquí iría la lógica para añadir al carrito
  };

  const handleToggleFavorite = (productId: string) => {
    console.log('Alternar favorito:', productId);
    // Aquí iría la lógica para alternar favoritos
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-indigo-700 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-indigo-700 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8 xl:mt-20">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block">Productos creativos</span>
                  <span className="block text-indigo-200">para tus proyectos</span>
                </h1>
                <p className="mt-3 text-base text-indigo-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Encuentra todo lo que necesitas para dar vida a tus ideas en nuestra tienda en línea.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      href="/products"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                    >
                      Ver productos
                    </Link>
                  </div>
                  <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                    <Link
                      href="/categories"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                    >
                      Explorar categorías
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80"
            alt="Productos creativos"
          />
        </div>
      </div>

      {/* Productos Destacados */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Productos Destacados"
            subtitle="Nuestras mejores selecciones para ti"
            ctaText="Ver todos los productos"
            ctaHref="/products"
          />
          
          <FeaturedProducts
            products={featuredProducts}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
      </div>

      {/* Características */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              Por qué elegirnos
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Todo lo que necesitas para tus proyectos
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              En TuGuaridaCreativa nos esforzamos por ofrecerte los mejores productos y la mejor experiencia de compra.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-x-8 md:gap-y-10">
              {features.map((feature) => (
                <div key={feature.name} className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                      {feature.name}
                    </p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Nuevos Productos */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Nuevos Productos"
            subtitle="Descubre nuestras últimas incorporaciones"
            ctaText="Ver más productos nuevos"
            ctaHref="/products?sort=newest"
          />
          
          <ProductList
            products={newArrivals}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
      </div>

      {/* Ofertas Especiales */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Ofertas Especiales"
            subtitle="Aprovecha nuestros descuentos por tiempo limitado"
            ctaText="Ver todas las ofertas"
            ctaHref="/deals"
          />
          
          <ProductList
            products={specialOffers}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
            className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">¿Listo para comenzar?</span>
            <span className="block text-indigo-200">Explora nuestra tienda hoy mismo.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Ver productos
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 bg-opacity-60 hover:bg-opacity-70"
              >
                Contáctanos
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Categorías Destacadas */}
      <CategoriesSection
        title="Explora Nuestras Categorías"
        subtitle="Encuentra todo lo que necesitas para tus proyectos creativos"
        categories={[
          { 
            name: 'Arte y Manualidades', 
            href: '/categories/arte-manualidades', 
            count: '24 productos',
            icon: Palette
          },
          { 
            name: 'Pintura y Dibujo', 
            href: '/categories/pintura-dibujo', 
            count: '36 productos',
            icon: Brush
          },
          { 
            name: 'Suministros para Arte', 
            href: '/categories/suministros-arte', 
            count: '42 productos',
            icon: Ruler
          },
          { 
            name: 'Papelería Creativa', 
            href: '/categories/papeleria', 
            count: '28 productos',
            icon: Package
          },
          { 
            name: 'Kits Creativos', 
            href: '/categories/kits', 
            count: '19 productos',
            icon: Layers
          },
          { 
            name: 'Regalos', 
            href: '/categories/regalos', 
            count: '15 productos',
            icon: Gift
          },
        ]}
      />

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">¿Listo para comenzar?</span>
            <span className="block text-indigo-200">Explora nuestra tienda hoy mismo.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Ver productos
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 bg-opacity-60 hover:bg-opacity-70"
              >
                Contáctanos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
