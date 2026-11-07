import { formatRelativeTime } from '../../utils/formatDate.js';
import { CheckCircle2, XCircle, AlertCircle, Upload, Scan } from 'lucide-react';

const activityIcons = {
  approved: { icon: CheckCircle2, color: 'text-[#1E3F30]', bg: 'bg-[#EBF2ED]' },
  rejected: { icon: XCircle, color: 'text-[#962317]', bg: 'bg-[#FDF2F2]' },
  changes_requested: { icon: AlertCircle, color: 'text-[#8A5D19]', bg: 'bg-[#FCF6EC]' },
  submitted: { icon: Upload, color: 'text-[#244C3A]', bg: 'bg-[#F0F4EF]' },
  analyzed: { icon: Scan, color: 'text-[#2D4B60]', bg: 'bg-[#F0F4F8]' },
};

export default function RecentActivity({ activities = [], loading }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse flex gap-3">
            <div className="w-7 h-7 rounded-full bg-[#EFEFEA] shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 bg-[#EFEFEA] rounded w-3/4" />
              <div className="h-3 bg-[#EFEFEA] rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return <p className="text-xs text-[#737B75] text-center py-6">No recent audit log activity.</p>;
  }

  return (
    <ul className="space-y-3">
      {activities.map((activity) => {
        const actDef = activityIcons[activity.type] || activityIcons.submitted;
        const Icon = actDef.icon;
        return (
          <li key={activity.id} className="flex items-start gap-3">
            <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${actDef.bg} ${actDef.color}`}>
              <Icon size={14} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[#252B27] leading-relaxed">
                <span className="font-semibold text-[#252B27]">{activity.user}</span>
                {' '}{activity.type.replace('_', ' ')}{' '}
                <span className="font-medium text-[#244C3A]">"{activity.content_title}"</span>
              </p>
              <p className="text-[11px] text-[#737B75] mt-0.5">{formatRelativeTime(activity.created_at)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
