import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, CheckCircle2, Clock, AlertTriangle, ShieldCheck,
  ArrowRight, Scan, BookOpen, Library,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getDashboardStats } from '../../services/dashboardService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import StatCard from '../../components/dashboard/StatCard.jsx';
import ActivityChart from '../../components/dashboard/ActivityChart.jsx';
import ComplianceChart from '../../components/dashboard/ComplianceChart.jsx';
import RecentActivity from '../../components/dashboard/RecentActivity.jsx';
import Card from '../../components/common/Card.jsx';
import Badge from '../../components/common/Badge.jsx';
import Button from '../../components/common/Button.jsx';
import { ISSUE_TYPE_LABELS } from '../../utils/constants.js';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load dashboard metrics');
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats
    ? [
      { label: 'Total Submitted', value: stats.total_submitted, icon: FileText, iconColor: 'text-[#244C3A]', trend: 12 },
      { label: 'Approved', value: stats.approved, icon: CheckCircle2, iconColor: 'text-[#1E3F30]', trend: 8 },
      { label: 'Pending Review', value: stats.pending_review, icon: Clock, iconColor: 'text-[#8A5D19]', trend: -3 },
      { label: 'Issues Detected', value: stats.issues_detected, icon: AlertTriangle, iconColor: 'text-[#962317]', trend: -5, trendLabel: 'vs last week' },
      { label: 'Compliance Score', value: `${stats.compliance_percentage}%`, icon: ShieldCheck, iconColor: 'text-[#244C3A]' },
    ]
    : [];

  const quickActions = [
    { label: 'Submit Content for Analysis', icon: Scan, to: '/analysis', variant: 'primary' },
    { label: 'Review Guidelines', icon: BookOpen, to: '/guidelines', variant: 'secondary' },
    { label: 'Browse Content Library', icon: Library, to: '/content', variant: 'secondary' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title={`Welcome, ${user?.name?.split(' ')[0] || 'User'}`}
        description="Unified corporate governance cockpit. Real-time brand guideline compliance monitoring."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {loading
          ? [...Array(5)].map((_, i) => <StatCard key={i} loading />)
          : statCards.map((card) => <StatCard key={card.label} {...card} />)}
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3.5 border border-[#DCE3DA] rounded-lg shadow-sm">
        <span className="text-xs font-semibold text-[#737B75] uppercase tracking-wider pl-1 mr-1">Workflows:</span>
        {quickActions.map((action) => (
          <Button
            key={action.to}
            variant={action.variant}
            size="sm"
            icon={<action.icon size={14} />}
            iconRight={<ArrowRight size={13} />}
            onClick={() => navigate(action.to)}
          >
            {action.label}
          </Button>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2" padding={false}>
          <div className="px-5 py-4 border-b border-[#DCE3DA] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[#252B27]">Content Submission Velocity</h2>
              <p className="text-xs text-[#737B75] mt-0.5">Submission volumes vs authorized approvals over time</p>
            </div>
            <span className="text-xs font-medium text-[#244C3A] bg-[#EBF2ED] px-2.5 py-1 rounded-full border border-[#CBD4C8]">
              Weekly Velocity
            </span>
          </div>
          <div className="p-5">
            <ActivityChart data={stats?.activity} loading={loading} />
          </div>
        </Card>

        <Card padding={false}>
          <div className="px-5 py-4 border-b border-[#DCE3DA]">
            <h2 className="text-sm font-semibold text-[#252B27]">Governance Status</h2>
            <p className="text-xs text-[#737B75] mt-0.5">Approval distribution breakdown</p>
          </div>
          <div className="p-5">
            <ComplianceChart data={stats?.status_breakdown} loading={loading} />
          </div>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Detected Issues */}
        <Card padding={false}>
          <div className="px-5 py-4 border-b border-[#DCE3DA] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[#252B27]">Recent Flagged Violations</h2>
              <p className="text-xs text-[#737B75] mt-0.5">High & medium severity deviations caught by AI engine</p>
            </div>
            <Button variant="ghost" size="xs" onClick={() => navigate('/analysis')}>
              Check text
            </Button>
          </div>
          <div className="divide-y divide-[#DCE3DA]">
            {loading
              ? [...Array(4)].map((_, i) => (
                <div key={i} className="px-5 py-3.5 animate-pulse flex gap-3">
                  <div className="h-4 bg-[#EFEFEA] rounded flex-1" />
                  <div className="h-4 bg-[#EFEFEA] rounded w-16" />
                </div>
              ))
              : stats?.recent_issues?.length === 0 ? (
                <div className="px-5 py-8 text-center text-xs text-[#737B75]">
                  No violations detected across recent submissions.
                </div>
              ) : (
                stats?.recent_issues?.map((issue) => (
                  <div key={issue.id} className="px-5 py-3 hover:bg-[#F7F8F4] transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#252B27] truncate">
                          "{issue.original_text}"
                        </p>
                        <p className="text-[11px] text-[#737B75] mt-0.5">{issue.content_title}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Badge variant={issue.severity} size="xs">{issue.severity}</Badge>
                        <Badge variant={issue.type} size="xs">{ISSUE_TYPE_LABELS[issue.type] || issue.type}</Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
          </div>
        </Card>

        {/* Audit Log Activity */}
        <Card padding={false}>
          <div className="px-5 py-4 border-b border-[#DCE3DA]">
            <h2 className="text-sm font-semibold text-[#252B27]">Audit Trail</h2>
            <p className="text-xs text-[#737B75] mt-0.5">Chronological record of reviewer actions & submissions</p>
          </div>
          <div className="p-5">
            <RecentActivity activities={stats?.recent_activities} loading={loading} />
          </div>
        </Card>
      </div>
    </div>
  );
}
