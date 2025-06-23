
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ label, id, error, className = '', containerClassName = '', children, ...props }) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-zyberion-gray mb-1">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full px-3 py-2 bg-input-bg border border-zyberion-dark-gray rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-zyberion-teal focus:border-zyberion-teal text-zyberion-light-gray ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};
    