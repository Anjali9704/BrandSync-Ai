import { diffText } from '../../utils/diffText.js';

export default function CorrectionComparison({ original, corrected }) {
  const diff = diffText(original, corrected);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Original Draft with Strikethroughs */}
      <div className="border border-[#DCE3DA] rounded-lg overflow-hidden bg-white shadow-xs">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#FDF2F2] border-b border-[#F6D0D0]">
          <span className="w-2 h-2 rounded-full bg-[#C0392B] shrink-0" />
          <span className="text-xs font-bold text-[#962317] uppercase tracking-wider">Original Text</span>
        </div>
        <div className="p-4 text-xs text-[#252B27] leading-relaxed min-h-36 whitespace-pre-wrap font-mono">
          {diff.map((seg, i) => (
            seg.type === 'removed' ? (
              <mark key={i} className="bg-[#FDF2F2] text-[#962317] border border-[#F6D0D0] rounded px-1 py-0.5 mx-0.5 line-through">
                {seg.text}
              </mark>
            ) : seg.type === 'added' ? null : (
              <span key={i}>{seg.text}</span>
            )
          ))}
        </div>
      </div>

      {/* Suggested Brand-Compliant Revision */}
      <div className="border border-[#CBD4C8] rounded-lg overflow-hidden bg-white shadow-xs">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#EBF2ED] border-b border-[#CBD4C8]">
          <span className="w-2 h-2 rounded-full bg-[#244C3A] shrink-0" />
          <span className="text-xs font-bold text-[#1E3F30] uppercase tracking-wider">AI Governed Revision</span>
        </div>
        <div className="p-4 text-xs text-[#252B27] leading-relaxed min-h-36 whitespace-pre-wrap font-mono">
          {diff.map((seg, i) => (
            seg.type === 'added' ? (
              <mark key={i} className="bg-[#EBF2ED] text-[#1E3F30] border border-[#CBD4C8] font-bold rounded px-1 py-0.5 mx-0.5 no-underline">
                {seg.text}
              </mark>
            ) : seg.type === 'removed' ? null : (
              <span key={i}>{seg.text}</span>
            )
          ))}
        </div>
      </div>
    </div>
  );
}
