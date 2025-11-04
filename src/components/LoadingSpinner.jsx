const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-7 h-7',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5">
      <div className={`relative ${sizeClasses[size]}`}>
        <div className="absolute inset-0 border-[3px] border-transparent border-t-primary rounded-full animate-spin"></div>
        <div className="absolute inset-0 border-[3px] border-transparent border-t-secondary rounded-full animate-spin" style={{ animationDelay: '-0.3s' }}></div>
        <div className="absolute inset-0 border-[3px] border-transparent border-t-accent rounded-full animate-spin" style={{ animationDelay: '-0.6s' }}></div>
      </div>
      {message && <p className="text-gray-600 text-sm">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;

