import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, BookOpen, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getGuidelines, createGuideline, updateGuideline, deleteGuideline, getAssets,
} from '../../services/guidelineService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROLES, GUIDELINE_SECTIONS } from '../../utils/constants.js';
import PageHeader from '../../components/layout/PageHeader.jsx';
import GuidelineCard from '../../components/guidelines/GuidelineCard.jsx';
import GuidelineForm from '../../components/guidelines/GuidelineForm.jsx';
import AssetUploader from '../../components/guidelines/AssetUploader.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Tabs from '../../components/common/Tabs.jsx';
import Card from '../../components/common/Card.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Loader from '../../components/common/Loader.jsx';
import { useDebounce } from '../../hooks/useDebounce.js';

const EDITOR_ROLES = [ROLES.ADMIN, ROLES.BRAND_MANAGER];

const sectionTabs = [
  { value: 'all', label: 'All Standards' },
  ...GUIDELINE_SECTIONS.map((s) => ({ value: s.value, label: s.label })),
  { value: 'assets', label: 'Collateral Assets' },
];

export default function BrandGuidelines() {
  const { user } = useAuth();
  const canEdit = EDITOR_ROLES.includes(user?.role);

  const [guidelines, setGuidelines] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const [formOpen, setFormOpen] = useState(false);
  const [editingGuideline, setEditingGuideline] = useState(null);
  const [savingGuideline, setSavingGuideline] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchGuidelines = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeSection !== 'all' && activeSection !== 'assets') params.section = activeSection;
      if (debouncedSearch) params.search = debouncedSearch;
      const data = await getGuidelines(params);
      setGuidelines(data);

      if (activeSection === 'assets') {
        const aData = await getAssets();
        setAssets(aData);
      }
    } catch {
      toast.error('Failed to load brand guidelines');
    } finally {
      setLoading(false);
    }
  }, [activeSection, debouncedSearch]);

  useEffect(() => {
    fetchGuidelines();
  }, [fetchGuidelines]);

  const handleSave = async (data) => {
    setSavingGuideline(true);
    try {
      if (editingGuideline) {
        const editId = editingGuideline.id || editingGuideline._id;
        const updated = await updateGuideline(editId, data);
        setGuidelines((prev) =>
          prev.map((g) => ((g.id || g._id) === editId ? updated : g))
        );
        toast.success('Guideline updated successfully');
      } else {
        const created = await createGuideline(data);
        setGuidelines((prev) => [...prev, created]);
        toast.success('New guideline rule established');
      }
      setFormOpen(false);
      setEditingGuideline(null);
    } catch (err) {
      toast.error(err.message || 'Failed to save guideline');
    } finally {
      setSavingGuideline(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const targetId = deleteTarget.id || deleteTarget._id;
      await deleteGuideline(targetId);
      setGuidelines((prev) => prev.filter((g) => (g.id || g._id) !== targetId));
      toast.success('Guideline deleted');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete guideline');
    } finally {
      setDeleting(false);
    }
  };

  const openEdit = (guideline) => {
    setEditingGuideline({
      ...guideline,
      items: (guideline.items || []).map((v) => (typeof v === 'string' ? { value: v } : v)),
    });
    setFormOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <PageHeader
        title="Brand Guidelines & Standards"
        description={
          canEdit
            ? 'Central source of truth governing corporate terminology, voice, and visual assets.'
            : 'Official brand guidelines. Read-only view for content creators and agency partners.'
        }
        action={
          canEdit && (
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={14} />}
              onClick={() => {
                setEditingGuideline(null);
                setFormOpen(true);
              }}
            >
              Add Standard Rule
            </Button>
          )
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-3">
        <Input
          placeholder="Filter guidelines by title, rule item or keyword…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search size={14} />}
          className="max-w-md bg-white"
        />
      </div>

      {/* Section Tabs */}
      <Tabs
        tabs={sectionTabs.map((t) => ({
          ...t,
          count:
            t.value !== 'all' && t.value !== 'assets'
              ? guidelines.filter((g) => g.section === t.value).length || undefined
              : undefined,
        }))}
        defaultTab="all"
        onChange={setActiveSection}
        className="mb-4"
      />

      {/* Content Stream */}
      {loading ? (
        <Loader text="Loading brand governance guidelines…" />
      ) : activeSection === 'assets' ? (
        <Card>
          <div className="mb-4 border-b border-[#DCE3DA] pb-3">
            <h2 className="text-sm font-bold text-[#252B27]">Brand Collateral & Assets</h2>
            <p className="text-xs text-[#737B75] mt-0.5">Approved logo marks, official hexadecimal palettes, and typographic assets.</p>
          </div>
          <AssetUploader assets={assets} onAssetsChange={setAssets} />
        </Card>
      ) : guidelines.length === 0 ? (
        <EmptyState
          icon={<BookOpen size={24} />}
          title="No guidelines in this category"
          description={
            search
              ? 'No rules match your search query. Try broadening your keywords.'
              : 'There are currently no active rules registered for this section.'
          }
          action={
            canEdit && (
              <Button size="sm" icon={<Plus size={14} />} onClick={() => setFormOpen(true)}>
                Establish Rule
              </Button>
            )
          }
        />
      ) : (
        <div className="space-y-3">
          {guidelines.map((guideline) => (
            <GuidelineCard
              key={guideline.id || guideline._id}
              guideline={guideline}
              canEdit={canEdit}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Guideline Add/Edit Modal */}
      <GuidelineForm
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingGuideline(null);
        }}
        onSave={handleSave}
        initialData={editingGuideline}
        loading={savingGuideline}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Guideline Rule?"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? AI checks will no longer enforce this rule.`}
        confirmLabel="Confirm Delete"
        loading={deleting}
      />
    </div>
  );
}
