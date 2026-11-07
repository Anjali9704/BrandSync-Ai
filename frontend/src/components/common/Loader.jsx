import { Loader2 } from 'lucide-react';

export default function Loader({ text = 'Loading…', size = 'md', fullPage = false }) {
  const sizes = { sm: 16, md: 24, lg: 36 };

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#F7F8F4] z-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-[#244C3A]" size={32} />
          {text && <p className="text-sm font-medium text-[#737B75]">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2.5 py-10 text-[#737B75]">
      <Loader2 className="animate-spin text-[#244C3A]" size={sizes[size] || 22} />
      {text && <span className="text-sm font-medium">{text}</span>}
    </div>
  );
}
