import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ label, value, icon: Icon, iconColor = 'text-[#244C3A]', trend, trendLabel, loading }) {
  if (loading) {
    return (
      <div className="bg-white border border-[#DCE3DA] rounded-lg p-5 animate-pulse shadow-sm">
        <div className="h-3 bg-[#EFEFEA] rounded w-20 mb-3" />
        <div className="h-7 bg-[#EFEFEA] rounded w-16 mb-2" />
        <div className="h-3 bg-[#EFEFEA] rounded w-24" />
      </div>
    );
  }

  const isPositive = trend > 0;

  return (
    <div className="bg-white border border-[#DCE3DA] rounded-lg p-5 hover:border-[#CBD4C8] hover:shadow-card transition-all duration-150">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-semibold text-[#737B75] uppercase tracking-wider">{label}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-md bg-[#F7F8F4] border border-[#DCE3DA] flex items-center justify-center">
            <Icon size={16} className={iconColor} />
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-[#252B27] tracking-tight mb-1">{value}</div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-[11px] font-semibold ${isPositive ? 'text-[#1E3F30]' : 'text-[#962317]'}`}>
          {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          <span>{Math.abs(trend)}% {trendLabel || 'vs prior period'}</span>
        </div>
      )}
    </div>
  );
}
