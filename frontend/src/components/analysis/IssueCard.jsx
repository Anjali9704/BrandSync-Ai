import { AlertTriangle, AlertCircle, Info, Check, X } from 'lucide-react';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import { ISSUE_TYPE_LABELS, SEVERITY_COLORS } from '../../utils/constants.js';

const severityIcons = {
  high: { icon: AlertTriangle, color: 'text-[#962317]' },
  medium: { icon: AlertCircle, color: 'text-[#8A5D19]' },
  low: { icon: Info, color: 'text-[#2D4B60]' },
};

export default function IssueCard({ issue, isActive, onClick, onAccept, onReject }) {
  const sevDef = severityIcons[issue.severity] || severityIcons.low;
  const SevIcon = sevDef.icon;

  const isResolved = issue.status === 'accepted' || issue.status === 'rejected';

  return (
    <div
      onClick={onClick}
      className={[
        'rounded-lg border p-4 cursor-pointer transition-all duration-150 text-left',
        isActive
          ? 'border-[#244C3A] bg-[#F0F4EF] shadow-card'
          : isResolved
          ? 'border-[#DCE3DA] bg-[#F7F8F4] opacity-65'
          : 'border-[#DCE3DA] hover:border-[#CBD4C8] hover:shadow-sm bg-white',
      ].join(' ')}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onClick?.();
      }}
      aria-pressed={isActive}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <SevIcon size={14} className={`shrink-0 ${sevDef.color}`} />
          <span className="text-xs font-bold text-[#252B27] truncate">
            {ISSUE_TYPE_LABELS[issue.type] || issue.type}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Badge variant={issue.severity} size="xs">{issue.severity}</Badge>
          {issue.status !== 'open' && (
            <Badge variant={issue.status} size="xs">{issue.status}</Badge>
          )}
        </div>
      </div>

      {/* Flagged snippet */}
      <div className="bg-[#F7F8F4] border border-[#DCE3DA] rounded px-2.5 py-1.5 mb-2 font-mono text-xs text-[#252B27]">
        "{issue.original_text}"
      </div>

      {/* Explanation */}
      <p className="text-xs text-[#737B75] leading-relaxed mb-2.5">{issue.explanation}</p>

      {/* Guideline Citation */}
      {issue.guideline_ref && (
        <p className="text-[11px] font-medium text-[#244C3A] mb-3 bg-[#EBF2ED] px-2 py-1 rounded border border-[#CBD4C8] inline-block">
          📋 {issue.guideline_ref}
        </p>
      )}

      {/* Recommendation Box */}
      {issue.suggestion && (
        <div className="bg-[#EBF2ED]/60 border border-[#CBD4C8] rounded-md p-2.5 mb-3">
          <p className="text-[11px] font-bold text-[#1E3F30] uppercase tracking-wider mb-0.5">Recommended Correction</p>
          <p className="text-xs text-[#252B27] leading-relaxed">{issue.suggestion}</p>
        </div>
      )}

      {/* Action Buttons */}
      {!isResolved && (
        <div className="flex gap-2 pt-1 border-t border-[#DCE3DA]/50">
          <Button
            variant="primary"
            size="xs"
            icon={<Check size={12} />}
            onClick={(e) => {
              e.stopPropagation();
              onAccept?.();
            }}
          >
            Apply Fix
          </Button>
          <Button
            variant="ghost"
            size="xs"
            icon={<X size={12} />}
            onClick={(e) => {
              e.stopPropagation();
              onReject?.();
            }}
          >
            Dismiss
          </Button>
        </div>
      )}
    </div>
  );
}
