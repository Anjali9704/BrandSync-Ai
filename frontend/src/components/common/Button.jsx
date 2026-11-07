import { cloneElement } from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-[#244C3A] text-white hover:bg-[#1B3B2D] active:bg-[#152E23] shadow-sm font-medium',
  secondary: 'bg-white text-[#252B27] border border-[#DCE3DA] hover:bg-[#F7F8F4] hover:border-[#CBD4C8] shadow-sm',
  accent: 'bg-[#D5A45B] text-white hover:bg-[#C19047] active:bg-[#AC7E38] shadow-sm font-medium',
  ghost: 'text-[#737B75] hover:text-[#252B27] hover:bg-[#EFEFEA]',
  danger: 'bg-[#FDF2F2] text-[#962317] border border-[#F6D0D0] hover:bg-[#FBE4E4]',
  success: 'bg-[#EBF2ED] text-[#1E3F30] border border-[#CBD4C8] hover:bg-[#DFEAE2]',
  sage: 'bg-[#DCE3DA] text-[#244C3A] hover:bg-[#CBD4C8]',
};

const sizes = {
  xs: 'h-7 px-2.5 text-xs rounded-sm gap-1',
  sm: 'h-8 px-3 text-xs rounded gap-1.5',
  md: 'h-9 px-4 text-sm rounded gap-2',
  lg: 'h-10 px-5 text-sm rounded-md gap-2 font-medium',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconRight,
  className = '',
  type = 'button',
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center transition-all duration-150 select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#244C3A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F8F4]',
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
        className,
      ].join(' ')}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={size === 'xs' ? 12 : 14} />
      ) : icon ? (
        cloneElement(icon, { size: size === 'xs' ? 12 : size === 'sm' ? 14 : 15 })
      ) : null}
      {children}
      {iconRight && !loading ? cloneElement(iconRight, { size: 14 }) : null}
    </button>
  );
}
