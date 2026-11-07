import { Edit3, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import Button from '../common/Button.jsx';
import { GUIDELINE_SECTIONS } from '../../utils/constants.js';
import { formatDate } from '../../utils/formatDate.js';

const sectionLabels = Object.fromEntries(GUIDELINE_SECTIONS.map((s) => [s.value, s.label]));

export default function GuidelineCard({ guideline, canEdit, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-[#DCE3DA] rounded-lg hover:border-[#CBD4C8] hover:shadow-card transition-all duration-150">
      <div
        className="flex items-start justify-between gap-3 px-5 py-4 cursor-pointer"
        onClick={() => setExpanded((p) => !p)}
        role="button"
        aria-expanded={expanded}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') setExpanded((p) => !p);
        }}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold text-[#244C3A] bg-[#EBF2ED] border border-[#CBD4C8] px-2 py-0.5 rounded-full">
              {sectionLabels[guideline.section] || guideline.section}
            </span>
          </div>
          <h3 className="text-sm font-bold text-[#252B27]">{guideline.title}</h3>
          <p className="text-[11px] text-[#737B75] mt-0.5">Last updated {formatDate(guideline.updated_at || guideline.updatedAt)}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {canEdit && (
            <>
              <Button
                variant="ghost"
                size="xs"
                icon={<Edit3 size={13} />}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(guideline);
                }}
                aria-label={`Edit ${guideline.title}`}
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="xs"
                icon={<Trash2 size={13} />}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(guideline);
                }}
                className="hover:text-[#962317] hover:bg-[#FDF2F2]"
                aria-label={`Delete ${guideline.title}`}
              >
                Delete
              </Button>
            </>
          )}
          <div className="text-[#737B75] p-1">
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5 border-t border-[#DCE3DA]/60 pt-3.5 bg-[#F7F8F4]/30">
          {guideline.content && (
            <p className="text-xs text-[#252B27] leading-relaxed mb-3">{guideline.content}</p>
          )}
          {guideline.items?.length > 0 && (
            <ul className="space-y-1.5">
              {guideline.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#737B75]">
                  <span className="text-[#244C3A] font-bold shrink-0">•</span>
                  <span className="text-[#252B27] leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
