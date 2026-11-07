import { STATUS_COLORS, SEVERITY_COLORS, ISSUE_TYPE_COLORS } from '../../utils/constants.js';

export default function Badge({ children, variant = 'default', size = 'sm', className = '' }) {
  const base = 'inline-flex items-center font-medium border rounded-full select-none';
  const sizes = {
    xs: 'text-[11px] px-2 py-0.5 leading-none',
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-xs px-3 py-1 font-semibold',
  };

  let variantClass = '';
  if (STATUS_COLORS[variant]) {
    variantClass = STATUS_COLORS[variant];
  } else if (SEVERITY_COLORS[variant]) {
    const sc = SEVERITY_COLORS[variant];
    variantClass = `${sc.bg} ${sc.text} ${sc.border}`;
  } else if (ISSUE_TYPE_COLORS[variant]) {
    variantClass = ISSUE_TYPE_COLORS[variant];
  } else {
    variantClass = 'bg-[#F7F8F4] text-[#737B75] border-[#DCE3DA]';
  }

  return (
    <span className={`${base} ${sizes[size] || sizes.sm} ${variantClass} ${className}`}>
      {children}
    </span>
  );
}
