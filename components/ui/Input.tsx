import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, id, error, className = '', containerClassName = '', ...props }, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-zyberion-gray mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`w-full px-3 py-2 bg-input-bg border border-zyberion-dark-gray rounded-md shadow-sm placeholder-zyberion-gray focus:outline-none focus:ring-2 focus:ring-zyberion-teal focus:border-zyberion-teal text-zyberion-light-gray ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';