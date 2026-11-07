import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, footer, size = 'md', className = '' }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#252B27]/40 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className={`w-full ${sizes[size] || sizes.md} bg-white border border-[#DCE3DA] rounded-xl shadow-modal ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DCE3DA]">
          <h2 className="text-base font-semibold text-[#252B27]">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-[#737B75] hover:text-[#252B27] hover:bg-[#F7F8F4] transition-colors"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 max-h-[72vh] overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#DCE3DA] bg-[#F7F8F4]/50 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
