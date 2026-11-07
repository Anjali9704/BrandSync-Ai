import { forwardRef } from 'react';

const Select = forwardRef(function Select(
  { label, error, hint, options = [], placeholder = 'Select…', className = '', containerClassName = '', required, ...props },
  ref
) {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-xs font-medium text-[#252B27] tracking-wide">
          {label}
          {required && <span className="text-[#962317] ml-0.5">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={[
          'w-full h-9 bg-white border rounded px-3 text-sm text-[#252B27] shadow-sm',
          'transition-colors duration-150 cursor-pointer',
          'focus:outline-none focus:border-[#244C3A] focus:ring-1 focus:ring-[#244C3A]',
          error ? 'border-[#C0392B]' : 'border-[#DCE3DA]',
          className,
        ].join(' ')}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-[#962317]">{error}</p>}
      {hint && !error && <p className="text-xs text-[#737B75]">{hint}</p>}
    </div>
  );
});

export default Select;
