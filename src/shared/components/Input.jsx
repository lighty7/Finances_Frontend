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
        <label htmlFor={inputId} className="font-medium text-slate-100 text-sm dark:text-slate-200">
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
          bg-slate-800 text-slate-100 border-slate-700
          dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700
          ${error 
            ? 'border-red-500 focus:border-red-500 focus:ring-3 focus:ring-red-500/20' 
            : 'focus:border-primary focus:ring-3 focus:ring-primary/20'
          }
          disabled:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70
          placeholder:text-slate-400
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

