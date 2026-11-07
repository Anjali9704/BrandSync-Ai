import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatDate } from '../../utils/formatDate.js';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#DCE3DA] rounded-lg px-3 py-2 text-xs shadow-modal">
      <p className="text-[#737B75] font-medium mb-1">{formatDate(label)}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }} className="font-medium">
          {entry.name}: <span className="font-bold text-[#252B27]">{entry.value}</span>
        </p>
      ))}
    </div>
  );
};

export default function ActivityChart({ data = [], loading }) {
  if (loading) {
    return <div className="h-52 bg-[#F7F8F4] rounded-lg animate-pulse" />;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorSubmitted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#244C3A" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#244C3A" stopOpacity={0.0} />
          </linearGradient>
          <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#D5A45B" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#D5A45B" stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#DCE3DA" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: '#737B75', fontSize: 11 }}
          tickFormatter={(v) => formatDate(v, { month: 'short', day: 'numeric' })}
          axisLine={false}
          tickLine={false}
        />
        <YAxis tick={{ fill: '#737B75', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 12, color: '#737B75', paddingTop: 8 }}
          iconType="circle"
          iconSize={7}
        />
        <Area
          type="monotone"
          dataKey="submitted"
          name="Submissions"
          stroke="#244C3A"
          strokeWidth={2}
          fill="url(#colorSubmitted)"
          dot={{ stroke: '#244C3A', strokeWidth: 1.5, fill: '#fff', r: 3 }}
          activeDot={{ r: 5 }}
        />
        <Area
          type="monotone"
          dataKey="approved"
          name="Approvals"
          stroke="#D5A45B"
          strokeWidth={2}
          fill="url(#colorApproved)"
          dot={{ stroke: '#D5A45B', strokeWidth: 1.5, fill: '#fff', r: 3 }}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
