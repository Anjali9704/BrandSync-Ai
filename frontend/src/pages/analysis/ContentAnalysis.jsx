import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  CheckCircle2, AlertTriangle, ChevronDown, ChevronUp,
  Send, RotateCcw, Copy, Check, Sparkles, ShieldAlert
} from 'lucide-react';
import { submitContent, analyzeContent, updateIssueStatus } from '../../services/analysisService.js';
import { submitReview } from '../../services/reviewService.js';
import ContentForm from '../../components/analysis/ContentForm.jsx';
import IssueCard from '../../components/analysis/IssueCard.jsx';
import ComplianceScore from '../../components/analysis/ComplianceScore.jsx';
import HighlightedText from '../../components/analysis/HighlightedText.jsx';
import CorrectionComparison from '../../components/analysis/CorrectionComparison.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';
import Textarea from '../../components/common/Textarea.jsx';

const STEP = { FORM: 'form', ANALYZING: 'analyzing', RESULTS: 'results' };

export default function ContentAnalysis() {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEP.FORM);
  const [currentContent, setCurrentContent] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [activeIssueId, setActiveIssueId] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [copied, setCopied] = useState(false);

  // Review modal
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleSubmit = useCallback(async (formData) => {
    try {
      setStep(STEP.ANALYZING);
      const content = await submitContent(formData);
      setCurrentContent({ ...content, body: formData.body });

      const result = await analyzeContent(content.id || content._id, formData.body);
      setAnalysis(result);
      setStep(STEP.RESULTS);

      if (result.issues.length === 0) {
        toast.success('Clean submission! Zero brand compliance violations found.');
      } else {
        toast(`Identified ${result.issues.length} compliance violation${result.issues.length > 1 ? 's' : ''}.`, { icon: '⚠️' });
      }
    } catch (err) {
      toast.error(err.message || 'Analysis failed. Please verify backend connectivity.');
      setStep(STEP.FORM);
    }
  }, []);

  const handleApplySingle = useCallback(async (issue) => {
    try {
      const contentId = currentContent?.id || currentContent?._id;
      const issueId = issue.id || issue._id;
      await updateIssueStatus(contentId, issueId, 'accepted');

      let replacement = issue.original_text;
      const quoted = issue.suggestion?.match(/"([^"]+)"/);
      if (quoted) {
        replacement = quoted[1];
      }

      let newBody = currentContent.body;
      if (newBody.includes(issue.original_text)) {
        newBody = newBody.replace(issue.original_text, replacement);
      }

      setCurrentContent((prev) => ({ ...prev, body: newBody }));

      setAnalysis((prev) => {
        const updatedIssues = prev.issues.map((i) =>
          (i.id === issueId || i._id === issueId) ? { ...i, status: 'accepted' } : i
        );
        const openRemaining = updatedIssues.filter((i) => i.status === 'open').length;
        const newScore = Math.min(100, prev.compliance_score + 12);
        return {
          ...prev,
          issues: updatedIssues,
          compliance_score: openRemaining === 0 ? 100 : newScore,
        };
      });

      toast.success(`Applied approved term for: "${issue.original_text}"`);
    } catch {
      toast.error('Failed to apply correction');
    }
  }, [currentContent]);

  const handleDismissSingle = useCallback(async (issueId) => {
    try {
      const contentId = currentContent?.id || currentContent?._id;
      await updateIssueStatus(contentId, issueId, 'rejected');
      setAnalysis((prev) => ({
        ...prev,
        issues: prev.issues.map((i) =>
          (i.id === issueId || i._id === issueId) ? { ...i, status: 'rejected' } : i
        ),
      }));
      toast('Violation dismissed', { icon: 'ℹ️' });
    } catch {
      toast.error('Failed to dismiss violation');
    }
  }, [currentContent]);

  const handleApplyAll = useCallback(async () => {
    if (!analysis?.corrected_text) return;

    setCurrentContent((prev) => ({ ...prev, body: analysis.corrected_text }));

    setAnalysis((prev) => ({
      ...prev,
      issues: prev.issues.map((i) => ({ ...i, status: 'accepted' })),
      compliance_score: 100,
      brand_consistency_score: 100,
      tone_score: 100,
      factual_accuracy_score: 100,
    }));

    toast.success('All AI corrections applied! Overall Compliance is 100%.');
  }, [analysis]);

  const handleCopyText = () => {
    const textToCopy = currentContent?.body || analysis?.corrected_text || '';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success('Draft copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmSendReview = async () => {
    setSubmittingReview(true);
    try {
      const contentId = currentContent?.id || currentContent?._id;
      await submitReview(contentId, {
        decision: 'pending',
        comment: reviewNotes || 'Submitted for brand governance review.',
        final_text: currentContent.body,
      });
      toast.success('Submitted into the human review pipeline!');
      setReviewModalOpen(false);
      navigate('/review');
    } catch {
      toast.error('Failed to submit for review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const openIssues = analysis?.issues?.filter((i) => i.status === 'open') || [];
  const resolvedCount = (analysis?.issues?.length || 0) - openIssues.length;

  // ── FORM STEP ──────────────────────────────────────────────────────────
  if (step === STEP.FORM) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <PageHeader
          title="Content Governance Analysis"
          description="Evaluate social copy, press releases, newsletters, and articles against official corporate brand guidelines."
        />
        <Card>
          <ContentForm onSubmit={handleSubmit} loading={false} />
        </Card>
      </div>
    );
  }

  // ── ANALYZING STEP ─────────────────────────────────────────────────────
  if (step === STEP.ANALYZING) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <Card>
          <div className="py-12 flex flex-col items-center gap-5 text-center">
            <div className="w-16 h-16 rounded-full bg-[#EBF2ED] border-2 border-[#CBD4C8] flex items-center justify-center text-[#244C3A]">
              <Sparkles size={28} className="animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#252B27]">Verifying Brand Compliance…</h2>
              <p className="text-xs text-[#737B75] max-w-md mt-1 leading-relaxed">
                Evaluating draft against terminology guidelines, superlative claims rules, voice and tone standards, and WCAG accessibility.
              </p>
            </div>
            <div className="flex flex-col gap-2 w-72 text-left mx-auto pt-2">
              {[
                'Cross-referencing restricted and banned terms',
                'Checking tone, readability, and inclusivity',
                'Validating superlative claims against factual records',
                'Checking WCAG 2.1 accessible anchor texts',
              ].map((stepDesc, idx) => (
                <div key={stepDesc} className="flex items-center gap-2 text-xs text-[#737B75]">
                  <div className={`w-1.5 h-1.5 rounded-full ${idx < 3 ? 'bg-[#244C3A]' : 'bg-[#DCE3DA]'}`} />
                  {stepDesc}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // ── RESULTS STEP ───────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <PageHeader
        title="Analysis Report"
        description={currentContent?.title}
        action={
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="secondary"
              size="sm"
              icon={copied ? <Check size={14} className="text-[#1E3F30]" /> : <Copy size={14} />}
              onClick={handleCopyText}
            >
              {copied ? 'Copied' : 'Copy Text'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<RotateCcw size={14} />}
              onClick={() => setStep(STEP.FORM)}
            >
              New Check
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Send size={14} />}
              onClick={() => setReviewModalOpen(true)}
            >
              Send for Review
            </Button>
          </div>
        }
      />

      {/* Score Overview Panel */}
      <Card>
        <div className="flex flex-wrap items-center gap-6 justify-around">
          <ComplianceScore score={analysis.compliance_score} label="Overall Compliance" size="lg" />
          <ComplianceScore score={analysis.brand_consistency_score} label="Brand Consistency" size="sm" />
          <ComplianceScore score={analysis.tone_score} label="Tone & Inclusivity" size="sm" />
          <ComplianceScore score={analysis.factual_accuracy_score} label="Factual Accuracy" size="sm" />

          <div className="flex-1 min-w-56 max-w-sm border-l border-[#DCE3DA] pl-6">
            <p className="text-[11px] font-bold text-[#737B75] uppercase tracking-wider mb-1">Audit Summary</p>
            <p className="text-xs text-[#252B27] leading-relaxed">{analysis.summary}</p>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1.5 text-xs text-[#962317] font-semibold">
                <AlertTriangle size={13} />
                <span>{openIssues.length} open issues</span>
              </div>
              {resolvedCount > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-[#1E3F30] font-semibold">
                  <CheckCircle2 size={13} />
                  <span>{resolvedCount} resolved</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Issues List */}
        <div className="xl:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#252B27] flex items-center gap-2">
              Detected Violations
              <Badge variant="default" size="xs">{analysis.issues.length}</Badge>
            </h2>
            {openIssues.length > 0 && (
              <Button
                variant="ghost"
                size="xs"
                icon={<Sparkles size={13} className="text-[#D5A45B]" />}
                onClick={handleApplyAll}
                className="text-[#244C3A] font-semibold hover:text-[#1B3B2D]"
              >
                Apply All AI Fixes
              </Button>
            )}
          </div>

          {analysis.issues.length === 0 ? (
            <Card>
              <div className="py-8 text-center">
                <CheckCircle2 size={28} className="text-[#244C3A] mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#252B27]">100% Brand Compliant</p>
                <p className="text-xs text-[#737B75] mt-1">This text satisfies all corporate communication policies.</p>
              </div>
            </Card>
          ) : (
            analysis.issues.map((issue) => (
              <IssueCard
                key={issue.id || issue._id}
                issue={issue}
                isActive={activeIssueId === (issue.id || issue._id)}
                onClick={() => setActiveIssueId((prev) => prev === (issue.id || issue._id) ? null : (issue.id || issue._id))}
                onAccept={() => handleApplySingle(issue)}
                onReject={() => handleDismissSingle(issue.id || issue._id)}
              />
            ))
          )}
        </div>

        {/* Content Preview & Inline Highlights */}
        <div className="xl:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#252B27]">
              Content Preview
              <span className="text-xs text-[#737B75] font-normal ml-2">(Click highlighted snippets to view citation)</span>
            </h2>
            {analysis.compliance_score === 100 && (
              <span className="text-xs font-semibold text-[#1E3F30] flex items-center gap-1 bg-[#EBF2ED] px-2.5 py-0.5 rounded-full border border-[#CBD4C8]">
                <CheckCircle2 size={13} /> Fully Compliant
              </span>
            )}
          </div>

          <HighlightedText
            text={currentContent?.body}
            issues={analysis.issues.filter((i) => i.status === 'open')}
            activeIssueId={activeIssueId}
            onIssueClick={(id) => setActiveIssueId((prev) => prev === id ? null : id)}
          />

          {/* Toggle comparison */}
          <button
            onClick={() => setShowComparison((p) => !p)}
            className="flex items-center gap-2 text-xs font-semibold text-[#244C3A] hover:text-[#1B3B2D] transition-colors cursor-pointer"
          >
            {showComparison ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {showComparison ? 'Hide Side-by-Side Diff' : 'Compare Original vs. AI-Corrected Revision'}
          </button>

          {showComparison && (
            <Card>
              <h3 className="text-xs font-bold text-[#737B75] uppercase tracking-wider mb-3">Diff Inspection</h3>
              <CorrectionComparison
                original={currentContent?.body}
                corrected={analysis.corrected_text}
              />
            </Card>
          )}
        </div>
      </div>

      {/* Review Workflow Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Forward to Review & Approval"
        size="md"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setReviewModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" loading={submittingReview} onClick={handleConfirmSendReview}>
              Confirm Submission
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-left">
          <p className="text-xs text-[#737B75] leading-relaxed">
            This submission will be routed directly to the designated Brand Reviewer and Brand Manager queue for final publishing authorization.
          </p>
          <div className="bg-[#F7F8F4] rounded-lg p-3.5 border border-[#DCE3DA] text-xs">
            <div className="font-semibold text-[#252B27]">{currentContent?.title}</div>
            <div className="text-[#737B75] mt-1 flex items-center gap-3">
              <span>Channel: <strong className="text-[#252B27] capitalize">{currentContent?.platform}</strong></span>
              <span>Compliance: <strong className="text-[#244C3A]">{analysis?.compliance_score}%</strong></span>
            </div>
          </div>
          <Textarea
            label="Reviewer Context & Internal Notes (Optional)"
            placeholder="Add context on publication deadlines or campaign objectives…"
            rows={3}
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
