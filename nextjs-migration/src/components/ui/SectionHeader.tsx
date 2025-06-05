import { ReactNode } from 'react';
import Link from 'next/link';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  className?: string;
  children?: ReactNode;
}

export function SectionHeader({
  title,
  subtitle,
  ctaText,
  ctaHref,
  onCtaClick,
  className = '',
  children,
}: SectionHeaderProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
        
        {(ctaText && (ctaHref || onCtaClick)) && (
          <div className="flex-shrink-0">
            {ctaHref ? (
              <Link
                href={ctaHref}
                className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                {ctaText}
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={onCtaClick}
                className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                {ctaText}
                <span aria-hidden="true"> &rarr;</span>
              </button>
            )}
          </div>
        )}
      </div>
      
      {children}
    </div>
  );
}

export default SectionHeader;
