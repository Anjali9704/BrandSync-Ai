export default function ComplianceScore({ score, label = 'Compliance Score', size = 'lg' }) {
  const radius = size === 'lg' ? 48 : 32;
  const stroke = size === 'lg' ? 6 : 4;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const dim = (radius + stroke) * 2;

  // Modern Professional SaaS: Forest green for high, Muted Gold for medium, Terracotta for low
  const color = score >= 80 ? '#244C3A' : score >= 60 ? '#D5A45B' : '#C0392B';

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`} role="img" aria-label={`${label}: ${score}%`}>
        {/* Background track */}
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke="#EFEFEA"
          strokeWidth={stroke}
        />
        {/* Fill gauge */}
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${dim / 2} ${dim / 2})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
        {/* Percentage Center */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#252B27"
          fontSize={size === 'lg' ? 18 : 13}
          fontWeight={700}
          fontFamily="Inter, sans-serif"
        >
          {score}%
        </text>
      </svg>
      <span className="text-xs font-semibold text-[#737B75] text-center">{label}</span>
    </div>
  );
}
