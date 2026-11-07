import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, hint, className = '', containerClassName = '', leftIcon, rightIcon, required, ...props },
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
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737B75] pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={[
            'w-full h-9 bg-white border rounded px-3 text-sm text-[#252B27] placeholder-[#9CA39E]',
            'transition-colors duration-150 shadow-sm',
            'focus:outline-none focus:border-[#244C3A] focus:ring-1 focus:ring-[#244C3A]',
            error ? 'border-[#C0392B] focus:border-[#C0392B] focus:ring-[#C0392B]' : 'border-[#DCE3DA]',
            leftIcon ? 'pl-9' : '',
            rightIcon ? 'pr-9' : '',
            className,
          ].join(' ')}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737B75] flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-[#962317]">{error}</p>}
      {hint && !error && <p className="text-xs text-[#737B75]">{hint}</p>}
    </div>
  );
});

export default Input;
