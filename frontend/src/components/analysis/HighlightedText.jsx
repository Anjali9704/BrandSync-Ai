export default function HighlightedText({ text, issues, activeIssueId, onIssueClick }) {
  if (!text || !issues?.length) {
    return (
      <div className="bg-white border border-[#DCE3DA] rounded-lg p-5 text-sm text-[#252B27] leading-relaxed whitespace-pre-wrap font-sans shadow-sm">
        {text}
      </div>
    );
  }

  const sorted = [...issues]
    .filter((i) => i.start_index !== undefined && i.end_index !== undefined)
    .sort((a, b) => a.start_index - b.start_index);

  // Modern Professional SaaS semantic highlight tints
  const severityStyles = {
    high: 'bg-[#FDF2F2] border-b-2 border-[#C0392B] text-[#962317] font-semibold',
    medium: 'bg-[#FCF6EC] border-b-2 border-[#D5A45B] text-[#8A5D19] font-semibold',
    low: 'bg-[#F0F4F8] border-b-2 border-[#4A6B82] text-[#2D4B60] font-semibold',
  };

  const segments = [];
  let cursor = 0;

  sorted.forEach((issue) => {
    const start = Math.max(cursor, issue.start_index);
    const end = Math.max(start, issue.end_index);

    if (start > cursor) {
      segments.push({ type: 'text', content: text.slice(cursor, start) });
    }
    if (end > start) {
      segments.push({ type: 'issue', content: text.slice(start, end), issue });
    }
    cursor = end;
  });

  if (cursor < text.length) {
    segments.push({ type: 'text', content: text.slice(cursor) });
  }

  return (
    <div className="bg-white border border-[#DCE3DA] rounded-lg p-5 text-sm text-[#252B27] leading-relaxed whitespace-pre-wrap font-sans shadow-sm">
      {segments.map((seg, i) => {
        if (seg.type === 'text') return <span key={i}>{seg.content}</span>;

        const isActive = activeIssueId === seg.issue.id || activeIssueId === seg.issue._id;
        const styleClass = severityStyles[seg.issue.severity] || severityStyles.low;

        return (
          <mark
            key={i}
            onClick={() => onIssueClick?.(seg.issue.id || seg.issue._id)}
            className={[
              'inline px-1 py-0.5 rounded-xs cursor-pointer transition-all duration-150 no-underline',
              styleClass,
              isActive ? 'ring-2 ring-[#244C3A] ring-offset-1' : 'hover:opacity-80',
            ].join(' ')}
            title={seg.issue.explanation}
            aria-label={`Flagged issue: ${seg.issue.type}`}
          >
            {seg.content}
          </mark>
        );
      })}
    </div>
  );
}
