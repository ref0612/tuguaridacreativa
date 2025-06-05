import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';

export interface Category {
  name: string;
  href: string;
  count: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface CategoriesSectionProps {
  categories: Category[];
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  className?: string;
}

export function CategoriesSection({
  categories,
  title = 'Nuestras Categorías',
  subtitle = 'Explora nuestra amplia gama de productos',
  ctaText = 'Ver todas las categorías',
  ctaHref = '/categories',
  className = '',
}: CategoriesSectionProps) {
  return (
    <div className={`py-12 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          ctaText={ctaText}
          ctaHref={ctaHref}
        />

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div 
                key={category.name} 
                className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white">
                    {category.icon ? (
                      <category.icon className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <ShoppingBag className="h-6 w-6" aria-hidden="true" />
                    )}
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <Link href={category.href} className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {category.name}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">{category.count}</p>
                </div>
                <span
                  className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-indigo-400"
                  aria-hidden="true"
                >
                  <ArrowRight className="h-6 w-6" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoriesSection;
