import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'primary' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      isLoading = false,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default: 'bg-gray-900 text-white hover:bg-gray-800',
      primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
      secondary: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
      outline: 'bg-transparent border border-gray-300 hover:bg-gray-50',
      ghost: 'bg-transparent hover:bg-gray-100',
      link: 'bg-transparent text-indigo-600 hover:underline',
    };

    const sizeClasses = {
      sm: 'h-9 px-3 rounded-md text-sm',
      default: 'h-10 py-2 px-4 rounded-md',
      lg: 'h-11 px-8 rounded-md',
    };

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
