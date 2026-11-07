import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = {
  approved: '#244C3A', // Forest green
  pending_review: '#D5A45B', // Muted gold
  changes_requested: '#4A6B82', // Slate
  rejected: '#C0392B', // Terracotta red
};

const LABELS = {
  approved: 'Approved',
  pending_review: 'Pending Review',
  changes_requested: 'Changes Requested',
  rejected: 'Rejected',
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#DCE3DA] rounded-lg px-3 py-2 text-xs shadow-modal">
      <p style={{ color: payload[0].payload.fill }} className="font-semibold">
        {LABELS[payload[0].payload.status] || payload[0].name}: <span className="text-[#252B27]">{payload[0].value}</span>
      </p>
    </div>
  );
};

export default function ComplianceChart({ data = [], loading }) {
  if (loading) {
    return <div className="h-52 bg-[#F7F8F4] rounded-lg animate-pulse" />;
  }

  const chartData = data.map((d) => ({
    ...d,
    name: LABELS[d.status] || d.status,
    fill: COLORS[d.status] || '#737B75',
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={78}
          paddingAngle={4}
          dataKey="count"
          stroke="#FFFFFF"
          strokeWidth={2}
        >
          {chartData.map((entry, idx) => (
            <Cell key={idx} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 11, color: '#737B75', paddingTop: 6 }}
          iconType="circle"
          iconSize={7}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
