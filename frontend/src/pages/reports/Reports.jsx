import { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Loader from '../../components/common/Loader.jsx';
import { getReportsSummary } from '../../services/reportService.js';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import toast from 'react-hot-toast';

export default function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReportsSummary()
      .then(setData)
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load compliance analytics');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <PageHeader
        title="Governance Reports & Compliance Analytics"
        description="Comprehensive audit trends, category violations, and approval performance metrics."
      />

      {loading || !data ? (
        <Loader text="Compiling organizational analytics…" />
      ) : (
        <>
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <p className="text-xs font-semibold text-[#737B75] uppercase tracking-wider mb-1">Approval Clearance Rate</p>
              <p className="text-3xl font-bold text-[#1E3F30]">
                {Math.round(
                  (data.approval_stats.approved /
                    (data.approval_stats.approved +
                      data.approval_stats.rejected +
                      data.approval_stats.changes_requested || 1)) *
                  100
                )}
                %
              </p>
              <p className="text-xs text-[#737B75] mt-1">{data.approval_stats.approved} approved pieces across channels</p>
            </Card>

            <Card>
              <p className="text-xs font-semibold text-[#737B75] uppercase tracking-wider mb-1">Revisions Requested</p>
              <p className="text-3xl font-bold text-[#8A5D19]">{data.approval_stats.changes_requested}</p>
              <p className="text-xs text-[#737B75] mt-1">Returned to authors for brand guideline adjustments</p>
            </Card>

            <Card>
              <p className="text-xs font-semibold text-[#737B75] uppercase tracking-wider mb-1">Direct Policy Rejections</p>
              <p className="text-3xl font-bold text-[#962317]">{data.approval_stats.rejected}</p>
              <p className="text-xs text-[#737B75] mt-1">Severe or repeated compliance deviations</p>
            </Card>
          </div>

          {/* Violations by Category Bar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card padding={false}>
              <div className="px-5 py-4 border-b border-[#DCE3DA] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#252B27]">Violations by Category</h3>
                  <p className="text-xs text-[#737B75] mt-0.5">Frequency distribution of caught issues</p>
                </div>
                <span className="text-xs font-semibold text-[#244C3A] bg-[#EBF2ED] px-2.5 py-1 rounded-full border border-[#CBD4C8]">
                  Automated Catch
                </span>
              </div>
              <div className="p-5">
                <ResponsiveContainer width="100%" height={230}>
                  <BarChart data={data.issues_by_category} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#DCE3DA" vertical={false} />
                    <XAxis dataKey="type" tick={{ fill: '#737B75', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#737B75', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        background: '#FFFFFF',
                        border: '1px solid #DCE3DA',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(37,43,39,0.08)',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="count" fill="#244C3A" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Most Common Violations */}
            <Card padding={false}>
              <div className="px-5 py-4 border-b border-[#DCE3DA]">
                <h3 className="text-sm font-bold text-[#252B27]">Top Brand Violations</h3>
                <p className="text-xs text-[#737B75] mt-0.5">Most recurrent banned terms and superlative claims</p>
              </div>
              <div className="divide-y divide-[#DCE3DA]">
                {data.common_violations.map((v, i) => (
                  <div key={i} className="px-5 py-3.5 flex items-center justify-between hover:bg-[#F7F8F4] transition-colors">
                    <span className="text-xs font-semibold text-[#252B27] font-mono">{v.text}</span>
                    <span className="text-xs font-bold text-[#244C3A] bg-[#EBF2ED] px-2.5 py-0.5 rounded-full border border-[#CBD4C8]">
                      {v.count} occurrences
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
