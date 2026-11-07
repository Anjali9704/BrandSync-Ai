import { forwardRef } from 'react';

const Textarea = forwardRef(function Textarea(
  { label, error, hint, className = '', containerClassName = '', required, maxLength, showCount = false, value, ...props },
  ref
) {
  const count = typeof value === 'string' ? value.length : 0;

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-[#252B27] tracking-wide">
            {label}
            {required && <span className="text-[#962317] ml-0.5">*</span>}
          </label>
          {showCount && maxLength && (
            <span className={`text-xs ${count > maxLength * 0.9 ? 'text-[#8A5D19]' : 'text-[#737B75]'}`}>
              {count}/{maxLength}
            </span>
          )}
        </div>
      )}
      <textarea
        ref={ref}
        value={value}
        maxLength={maxLength}
        className={[
          'w-full bg-white border rounded px-3 py-2.5 text-sm text-[#252B27] placeholder-[#9CA39E] shadow-sm',
          'transition-colors duration-150 resize-y min-h-[120px]',
          'focus:outline-none focus:border-[#244C3A] focus:ring-1 focus:ring-[#244C3A]',
          error ? 'border-[#C0392B]' : 'border-[#DCE3DA]',
          className,
        ].join(' ')}
        {...props}
      />
      {error && <p className="text-xs text-[#962317]">{error}</p>}
      {hint && !error && <p className="text-xs text-[#737B75]">{hint}</p>}
    </div>
  );
});

export default Textarea;
