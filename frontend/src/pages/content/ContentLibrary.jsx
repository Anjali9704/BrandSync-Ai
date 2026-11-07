import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Scan } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Table from '../../components/common/Table.jsx';
import Badge from '../../components/common/Badge.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';
import Card from '../../components/common/Card.jsx';
import { listContent } from '../../services/contentService.js';
import { CONTENT_TYPES } from '../../utils/constants.js';
import { formatDate } from '../../utils/formatDate.js';
import toast from 'react-hot-toast';

export default function ContentLibrary() {
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    listContent({ search, type: typeFilter })
      .then((res) => setContent(res.items || []))
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load content library');
      })
      .finally(() => setLoading(false));
  }, [search, typeFilter]);

  const columns = [
    {
      key: 'title',
      label: 'Title & Excerpt',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-[#252B27] block hover:text-[#244C3A] cursor-pointer">
            {val}
          </span>
          <span className="text-xs text-[#737B75] truncate max-w-sm block mt-0.5">
            {row.body}
          </span>
        </div>
      ),
    },
    {
      key: 'content_type',
      label: 'Format',
      render: (val) => (
        <span className="capitalize text-xs font-medium text-[#737B75]">
          {val?.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'platform',
      label: 'Channel',
      render: (val) => (
        <span className="capitalize text-xs font-medium text-[#252B27]">
          {val || '—'}
        </span>
      ),
    },
    {
      key: 'compliance_score',
      label: 'Score',
      render: (val) =>
        val !== null && val !== undefined ? (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full border ${val >= 80
              ? 'bg-[#EBF2ED] text-[#1E3F30] border-[#CBD4C8]'
              : val >= 60
                ? 'bg-[#FCF6EC] text-[#8A5D19] border-[#F1DFBF]'
                : 'bg-[#FDF2F2] text-[#962317] border-[#F6D0D0]'
              }`}
          >
            {val}%
          </span>
        ) : (
          <span className="text-xs text-[#9CA39E] font-mono">Unchecked</span>
        ),
    },
    {
      key: 'status',
      label: 'Governance Status',
      render: (val) => (
        <Badge variant={val} size="xs">
          {val?.replace(/_/g, ' ')}
        </Badge>
      ),
    },
    {
      key: 'updated_at',
      label: 'Updated',
      render: (val, row) => (
        <span className="text-xs text-[#737B75]">
          {formatDate(val || row.updatedAt)}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <Button
          variant="secondary"
          size="xs"
          icon={<Scan size={12} />}
          onClick={() => navigate('/analysis')}
        >
          Analyse
        </Button>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <PageHeader
        title="Content Repository"
        description="Unified corporate library of all drafts, campaigns, and approved public communications."
        action={
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => navigate('/analysis')}
          >
            New Submission
          </Button>
        }
      />

      {/* Filter Toolbar */}
      <div className="flex flex-wrap gap-3 items-center bg-white p-3 border border-[#DCE3DA] rounded-lg shadow-sm">
        <Input
          placeholder="Search by title or text body…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search size={14} />}
          className="w-64 bg-white"
        />
        <Select
          placeholder="All Content Formats"
          options={CONTENT_TYPES}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-48 bg-white"
        />
      </div>

      {/* Table Data */}
      <Card padding={false}>
        <Table columns={columns} data={content} loading={loading} />
      </Card>
    </div>
  );
}
