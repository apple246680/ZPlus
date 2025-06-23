
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zyberion-blue transition-colors duration-150 ease-in-out flex items-center justify-center';

  const variantStyles = {
    primary: 'bg-zyberion-teal hover:bg-opacity-80 text-white focus:ring-zyberion-teal',
    secondary: 'bg-zyberion-light-blue hover:bg-opacity-80 text-zyberion-light-gray focus:ring-zyberion-light-blue border border-zyberion-gray',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    ghost: 'bg-transparent hover:bg-zyberion-light-blue/20 text-zyberion-teal focus:ring-zyberion-teal'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled || isLoading ? disabledStyles : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};
    