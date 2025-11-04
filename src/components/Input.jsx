const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  error,
  placeholder,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const inputId = `input-${name}`;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="font-medium text-gray-900 text-sm">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`
          w-full px-4 py-3 border-2 rounded-lg text-base font-sans transition-all duration-200
          bg-white text-gray-900
          ${error 
            ? 'border-red-500 focus:border-red-500 focus:ring-3 focus:ring-red-100' 
            : 'border-gray-200 focus:border-primary focus:ring-3 focus:ring-primary/10'
          }
          disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70
          placeholder:text-gray-400
        `}
        {...props}
      />
      {error && (
        <span className="text-red-500 text-sm flex items-center gap-1 mt-[-4px]">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;

