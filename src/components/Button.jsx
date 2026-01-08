import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 border border-transparent',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm',
    accent: 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/30 border border-transparent',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600 border border-transparent',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30 border border-transparent'
  };

  const sizes = {
    sm: 'text-sm px-3 py-1.5 rounded-lg',
    md: 'text-base px-4 py-2 rounded-lg',
    lg: 'text-lg px-6 py-3 rounded-xl'
  };

  
  return (
    <button 
      className={`btn btn-${variant} btn-${size} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
