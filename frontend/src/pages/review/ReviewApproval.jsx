import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, FileText } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Badge from '../../components/common/Badge.jsx';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import Textarea from '../../components/common/Textarea.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Loader from '../../components/common/Loader.jsx';
import { getReviewQueue, submitReview } from '../../services/reviewService.js';
import { formatDate } from '../../utils/formatDate.js';
import toast from 'react-hot-toast';

export default function ReviewApproval() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState(null);
  const [decision, setDecision] = useState('approved');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getReviewQueue()
      .then((items) => setQueue(items || []))
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load review queue');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleReview = async () => {
    if (!reviewModal) return;
    setSubmitting(true);
    try {
      const contentId = reviewModal.id || reviewModal._id;
      await submitReview(contentId, { decision, comment });
      setQueue((prev) => prev.filter((i) => (i.id || i._id) !== contentId));
      toast.success(`Submission marked as ${decision.replace(/_/g, ' ')}`);
      setReviewModal(null);
      setComment('');
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <PageHeader
        title="Review & Human Authorization"
        description="Gatekeeper verification pipeline for brand managers and designated reviewers prior to public distribution."
      />

      {loading ? (
        <Loader text="Loading pending queue…" />
      ) : queue.length === 0 ? (
        <EmptyState
          icon={<CheckCircle2 size={28} className="text-[#244C3A]" />}
          title="Review Queue Clear"
          description="There are currently no drafts awaiting your governance authorization."
        />
      ) : (
        <div className="space-y-3.5">
          {queue.map((item) => (
            <Card key={item.id || item._id} hover>
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <Badge variant={item.status} size="xs">
                      {item.status?.replace(/_/g, ' ')}
                    </Badge>
                    <span className="text-xs text-[#737B75]">
                      by <strong className="text-[#252B27]">{item.author?.name || 'Creator'}</strong> ·{' '}
                      {formatDate(item.created_at || item.createdAt)}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#252B27] mb-1.5">{item.title}</h3>
                  <div className="text-xs text-[#252B27] bg-[#F7F8F4] border border-[#DCE3DA] rounded-md p-3.5 font-mono leading-relaxed mb-3">
                    {item.body}
                  </div>
                  {item.compliance_score !== null && item.compliance_score !== undefined && (
                    <div className="text-xs text-[#737B75] flex items-center gap-1.5">
                      <span>Automated Score:</span>
                      <strong className={`font-bold ${item.compliance_score >= 80 ? 'text-[#1E3F30]' : 'text-[#8A5D19]'}`}>
                        {item.compliance_score}%
                      </strong>
                    </div>
                  )}
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#DCE3DA]">
                  <Button
                    variant="primary"
                    size="xs"
                    icon={<CheckCircle2 size={13} />}
                    onClick={() => {
                      setReviewModal(item);
                      setDecision('approved');
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="secondary"
                    size="xs"
                    icon={<AlertCircle size={13} className="text-[#8A5D19]" />}
                    onClick={() => {
                      setReviewModal(item);
                      setDecision('changes_requested');
                    }}
                  >
                    Request Changes
                  </Button>
                  <Button
                    variant="danger"
                    size="xs"
                    icon={<XCircle size={13} />}
                    onClick={() => {
                      setReviewModal(item);
                      setDecision('rejected');
                    }}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Decision Feedback Modal */}
      <Modal
        isOpen={Boolean(reviewModal)}
        onClose={() => setReviewModal(null)}
        title={`Sign-off: ${reviewModal?.title}`}
        size="md"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setReviewModal(null)}>
              Cancel
            </Button>
            <Button
              variant={decision === 'approved' ? 'primary' : decision === 'rejected' ? 'danger' : 'accent'}
              size="sm"
              loading={submitting}
              onClick={handleReview}
            >
              Confirm {decision.replace(/_/g, ' ')}
            </Button>
          </>
        }
      >
        <div className="space-y-3.5 text-left">
          <div className="flex items-center justify-between bg-[#F7F8F4] p-3 rounded border border-[#DCE3DA] text-xs">
            <span className="text-[#737B75]">Decision Outcome:</span>
            <Badge variant={decision} size="sm">
              {decision.replace(/_/g, ' ')}
            </Badge>
          </div>
          <Textarea
            label="Reviewer Notes & Feedback"
            placeholder="Document mandatory changes or comments for the author…"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
