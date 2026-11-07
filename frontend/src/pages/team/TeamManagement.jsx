import { useState, useEffect } from 'react';
import { UserPlus, Trash2, Mail } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Table from '../../components/common/Table.jsx';
import Badge from '../../components/common/Badge.jsx';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import { getTeam, inviteTeamMember, deleteTeamMember } from '../../services/teamService.js';
import { MEMBER_ROLES } from '../../utils/constants.js';
import { formatDate } from '../../utils/formatDate.js';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function TeamManagement() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { role: 'reviewer' },
  });

  useEffect(() => {
    getTeam()
      .then((members) => setTeam(members || []))
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load team roster');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleInvite = async (data) => {
    setSubmitting(true);
    try {
      const member = await inviteTeamMember(data);
      setTeam((prev) => [...prev, member]);
      toast.success('Team member invited successfully');
      setModalOpen(false);
      reset();
    } catch (err) {
      toast.error(err.message || 'Failed to invite team member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const memberId = deleteTarget.id || deleteTarget._id;
      await deleteTeamMember(memberId);
      setTeam((prev) => prev.filter((m) => (m.id || m._id) !== memberId));
      toast.success('Member removed');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to remove member');
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Member',
      render: (val, row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#EBF2ED] border border-[#CBD4C8] flex items-center justify-center text-xs font-bold text-[#244C3A]">
            {val ? val[0].toUpperCase() : 'U'}
          </div>
          <div>
            <span className="font-semibold text-[#252B27] block leading-none">{val}</span>
            <span className="text-xs text-[#737B75] mt-1 block">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (val) => (
        <span className="capitalize text-xs font-medium text-[#244C3A] bg-[#EBF2ED] px-2.5 py-0.5 rounded-full border border-[#CBD4C8]">
          {val?.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <Badge variant={val} size="xs">{val}</Badge>,
    },
    {
      key: 'joined_at',
      label: 'Date Added',
      render: (val, row) => <span className="text-xs text-[#737B75]">{formatDate(val || row.createdAt)}</span>,
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <Button
          variant="ghost"
          size="xs"
          onClick={() => setDeleteTarget(row)}
          className="hover:text-[#962317] hover:bg-[#FDF2F2]"
          aria-label="Remove member"
        >
          <Trash2 size={13} />
        </Button>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <PageHeader
        title="Organization Team Management"
        description="Provision accounts, assign governance reviewer roles, and manage agency partner access."
        action={
          <Button variant="primary" size="sm" icon={<UserPlus size={14} />} onClick={() => setModalOpen(true)}>
            Invite Member
          </Button>
        }
      />

      <Card padding={false}>
        <Table columns={columns} data={team} loading={loading} />
      </Card>

      {/* Invite Member Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Invite Organization Collaborator"
        size="md"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" loading={submitting} onClick={handleSubmit(handleInvite)}>
              Send Invitation
            </Button>
          </>
        }
      >
        <form className="space-y-4 text-left">
          <Input
            label="Full Name"
            placeholder="e.g. Vikram Mehta"
            error={errors.name?.message}
            {...register('name', { required: 'Name is required' })}
          />
          <Input
            label="Corporate Email Address"
            type="email"
            placeholder="vikram@brandsync.ai"
            error={errors.email?.message}
            {...register('email', { required: 'Email is required' })}
          />
          <Select
            label="Role & Authorization Level"
            options={MEMBER_ROLES}
            error={errors.role?.message}
            {...register('role', { required: 'Role is required' })}
          />
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Revoke Member Access?"
        message={`Are you sure you want to remove ${deleteTarget?.name}? They will immediately lose access to internal guidelines and analysis queues.`}
        confirmLabel="Revoke Access"
      />
    </div>
  );
}
