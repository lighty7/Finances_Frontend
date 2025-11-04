const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  type = 'button',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 border-none rounded-lg font-medium cursor-pointer transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md',
    secondary: 'bg-white text-gray-900 border-2 border-gray-200 hover:border-primary hover:bg-gray-50',
    danger: 'bg-red-500 text-white hover:opacity-90',
  };
  
  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-current rounded-full animate-spin"></span>
      )}
      {children}
    </button>
  );
};

export default Button;

