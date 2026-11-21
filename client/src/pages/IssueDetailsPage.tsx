import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../context/IssuesContext';
import { api } from '../services/api';
import { Report, Comment, IssueStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { CategoryIcon } from '../components/CategoryIcon';
import { BeforeAfterViewer } from '../components/BeforeAfterViewer';
import { SlaCountdown } from '../components/SlaCountdown';
import { WorkOrderReceiptModal } from '../components/WorkOrderReceiptModal';
import { MapView } from '../components/MapView';
import {
  Calendar,
  MapPin,
  Sparkles,
  UserCheck,
  CheckCircle2,
  Clock,
  Send,
  ThumbsUp,
  Star,
  ShieldAlert,
  ArrowLeft,
  Hammer,
  AlertCircle,
  Building2,
  FileText,
  Printer,
  Zap,
} from 'lucide-react';

interface Props {
  reportId: string;
  onNavigate: (tab: string, param?: any) => void;
}

const LIFECYCLE_STEPS: IssueStatus[] = [
  'Reported',
  'Under Review',
  'Assigned',
  'In Progress',
  'Resolved',
  'Verified',
  'Closed',
];

export const IssueDetailsPage: React.FC<Props> = ({ reportId, onNavigate }) => {
  const { user, role } = useAuth();
  const { updateStatus, assignIssue, resolveIssue, verifyIssue, toggleUpvote, departments } = useIssues();

  const [report, setReport] = useState<Report | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newComment, setNewComment] = useState('');

  // Modals
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolutionImage, setResolutionImage] = useState(
    'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&q=80&w=800'
  );

  // Citizen confirmation rating state
  const [citizenRating, setCitizenRating] = useState<number>(5);
  const [citizenFeedback, setCitizenFeedback] = useState('Issue has been resolved to satisfaction. Thank you!');

  const loadReport = async () => {
    try {
      const res = await api.getIssueById(reportId);
      setReport(res.report);
      setComments(res.comments);
    } catch (err) {
      console.error('Error fetching issue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [reportId]);

  if (loading || !report) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-stone-500 dark:text-stone-400 font-mono font-bold">Loading civic incident file #{reportId}...</p>
      </div>
    );
  }

  const currentStepIndex = LIFECYCLE_STEPS.indexOf(report.status);
  const isResolved = report.status === 'Resolved' || report.status === 'Verified' || report.status === 'Closed';

  const handleConfirmResolution = async (confirmed: boolean) => {
    try {
      const updated = await verifyIssue(report.id, {
        confirmed,
        rating: citizenRating,
        feedback: citizenFeedback,
      });
      setReport(updated);
      if (confirmed) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err: any) {
      alert(err.message || 'Verification update failed');
    }
  };

  const handleOfficerResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolutionNotes.trim()) {
      alert('Please provide resolution notes describing actions taken.');
      return;
    }
    try {
      const updated = await resolveIssue(report.id, {
        resolutionNotes,
        evidenceImages: [resolutionImage],
      });
      setReport(updated);
      setShowResolveModal(false);
    } catch (err: any) {
      alert(err.message || 'Failed to submit resolution');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    try {
      const res = await api.addComment(report.id, {
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        userAvatar: user.avatar,
        message: newComment,
      });
      setComments((prev) => [...prev, res.comment]);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top back & actions bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('citizen')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-orange-600 bg-white dark:bg-stone-900 px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Certificate Download button if resolved */}
          {isResolved && (
            <button
              onClick={() => setShowReceiptModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/40 text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition-all shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Official Work Order Certificate</span>
            </button>
          )}

          <button
            onClick={() => {
              toggleUpvote(report.id);
              loadReport();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-bold text-orange-600 dark:text-orange-400 hover:bg-orange-50/50 shadow-xs transition-all"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span className="font-mono">{report.upvotes} Citizens Endorsed</span>
          </button>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-black text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-950 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-800">
              #{report.id}
            </span>
            <PriorityBadge priority={report.priority} />
            <StatusBadge status={report.status} />
            <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-orange-800 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/70 border border-orange-200 dark:border-orange-500/30 px-2 py-0.5 rounded-lg">
              <Zap className="w-3 h-3 fill-orange-500 text-orange-500 dark:fill-orange-300" />
              <span>{report.impactMultiplier || 1.0}x Impact Multiplier</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <SlaCountdown
              deadline={report.slaDeadline}
              slaHours={report.slaHours}
              isResolved={isResolved}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-orange-600 dark:text-orange-400 font-mono">
            <CategoryIcon category={report.category} className="w-4 h-4" />
            <span>{report.category}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white leading-snug">
            {report.title}
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
            {report.description}
          </p>
        </div>

        {/* 7-Step Lifecycle Timeline Bar */}
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-3">
          <span className="text-[10px] font-mono font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
            Closed-Loop Workflow Pipeline
          </span>
          <div className="overflow-x-auto pb-2">
            <div className="flex items-center min-w-[620px] justify-between relative">
              <div className="absolute top-4 left-6 right-6 h-1 bg-stone-200 dark:bg-stone-800 -z-0" />
              <div
                className="absolute top-4 left-6 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 transition-all duration-500 -z-0"
                style={{
                  width: `${(Math.max(0, currentStepIndex) / (LIFECYCLE_STEPS.length - 1)) * 92}%`,
                }}
              />

              {LIFECYCLE_STEPS.map((st, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;
                return (
                  <div key={st} className="flex flex-col items-center space-y-1.5 z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                        isCurrent
                          ? 'bg-orange-600 text-white ring-4 ring-orange-500/20 shadow-xs scale-110'
                          : isPassed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 text-stone-400 dark:text-stone-500'
                      }`}
                    >
                      {isPassed ? '✓' : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold text-center ${
                        isCurrent
                          ? 'text-orange-600 dark:text-orange-400'
                          : isPassed
                          ? 'text-stone-700 dark:text-stone-300'
                          : 'text-stone-400 dark:text-stone-500'
                      }`}
                    >
                      {st}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Citizen Resolution Confirmation Banner (When status is Resolved) */}
      {report.status === 'Resolved' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50/90 dark:bg-emerald-950/40 border-2 border-emerald-400 dark:border-emerald-500/50 shadow-md space-y-4 animate-in slide-in-from-top-4 duration-300">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Remediation Finished • Citizen Sign-Off Required</span>
            </div>
            <h3 className="text-lg font-black text-stone-900 dark:text-white">
              Has this civic defect been properly remediated to your satisfaction?
            </h3>
            <p className="text-xs text-stone-700 dark:text-stone-300 max-w-2xl font-normal">
              Inspect the officer's resolution photograph and notes below. Confirming awards +30 Civic Karma and issues the official municipal closure certificate.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300 font-mono">Satisfaction Rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setCitizenRating(star)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= citizenRating
                          ? 'text-amber-500 fill-amber-400'
                          : 'text-stone-300 dark:text-stone-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              placeholder="Add your verification comment or remarks..."
              value={citizenFeedback}
              onChange={(e) => setCitizenFeedback(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-stone-950 border border-emerald-300 dark:border-emerald-500/40 text-xs font-medium text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => handleConfirmResolution(true)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all hover:scale-102"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Resolution (+30 Karma)</span>
              </button>

              <button
                type="button"
                onClick={() => handleConfirmResolution(false)}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-stone-900 hover:bg-red-50 dark:hover:bg-red-950/70 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-500/40 font-bold text-xs transition-colors"
              >
                <span>Report Ongoing Defect / Reopen</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Left Column (Before/After & Map) | Right Column (Officer Action, AI & Comments) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Resolution Before/After Evidence Viewer */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <h3 className="text-xs font-mono font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
              Photographic Inspection Evidence
            </h3>
            <BeforeAfterViewer
              initialImage={report.images[0]}
              resolution={report.resolution}
            />
          </div>

          {/* Location on Map */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span>Geospatial Ward Location</span>
              </h3>
              <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
                {report.location.city}
              </span>
            </div>
            <p className="text-xs text-stone-700 dark:text-stone-300 font-medium">
              📍 {report.location.address} {report.location.landmark ? `(${report.location.landmark})` : ''}
            </p>
            <MapView
              reports={[report]}
              className="w-full h-64"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Officer & Authority Action Panel (if officer or admin) */}
          {(role === 'officer' || role === 'admin') && (
            <div className="p-6 rounded-3xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/40 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-amber-200 dark:border-amber-500/20">
                <div className="flex items-center gap-2">
                  <Hammer className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                    Officer Dispatch Controls
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 px-2 py-0.5 rounded font-bold">
                  {role.toUpperCase()}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-stone-600 dark:text-stone-400 uppercase mb-1">
                    Update Workflow Status:
                  </label>
                  <select
                    value={report.status}
                    onChange={(e) => updateStatus(report.id, e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 text-xs font-bold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                  >
                    <option value="Reported">Reported</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Verified">Verified</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setShowResolveModal(true)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Upload Resolution Evidence</span>
                </button>
              </div>
            </div>
          )}

          {/* AI Intelligence Briefing */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-700 dark:text-orange-400">
                  AI Triage Telemetry
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                {Math.round(report.aiAnalysis?.confidence ? report.aiAnalysis.confidence * 100 : 94)}% Match
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-[10px] font-mono font-bold text-stone-500 uppercase">Assigned Division</span>
                <p className="font-bold text-stone-900 dark:text-white text-xs mt-0.5">
                  {report.departmentName || 'Public Works & Roads'}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-stone-500 uppercase">Safety Risk Assessment</span>
                <p className="text-stone-600 dark:text-stone-300 leading-relaxed mt-0.5 font-normal">
                  {report.aiAnalysis?.priorityReason || 'High priority allocated based on commuter accident risk.'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-1">
                <span className="text-[10px] font-mono font-bold text-stone-500 uppercase">Action Summary</span>
                <p className="text-stone-700 dark:text-stone-300 italic leading-relaxed text-[11px]">
                  "{report.aiAnalysis?.summary || report.title}"
                </p>
              </div>
            </div>
          </div>

          {/* Community Discussion & Officer Log */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <h3 className="text-xs font-mono font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
              Discussion & Audit Log ({comments.length})
            </h3>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-stone-100 dark:divide-stone-800">
              {comments.map((comm) => (
                <div key={comm.id} className="pt-2.5 first:pt-0 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                      <span>{comm.userName}</span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                          comm.userRole === 'officer'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                            : comm.userRole === 'admin'
                            ? 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700'
                            : 'bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800'
                        }`}
                      >
                        {comm.userRole}
                      </span>
                    </span>
                    <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500">
                      {new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-stone-600 dark:text-stone-300 leading-relaxed font-normal">{comm.message}</p>
                </div>
              ))}
            </div>

            {/* Comment form */}
            <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
              <input
                type="text"
                placeholder="Write a message or status update..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 placeholder-stone-400"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white transition-colors"
                title="Send comment"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Resolution Submission Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <form
            onSubmit={handleOfficerResolve}
            className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-700 space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold font-mono text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Submit Field Resolution Proof</span>
              </div>
              <button
                type="button"
                onClick={() => setShowResolveModal(false)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-stone-700 dark:text-stone-300 uppercase mb-1">
                  Resolution Notes & Technical Action *
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail work performed on site, materials used, crew dispatched, and tests performed..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-xs font-medium text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-stone-700 dark:text-stone-300 uppercase mb-1">
                  Resolution "After" Photographic Evidence URL
                </label>
                <input
                  type="url"
                  value={resolutionImage}
                  onChange={(e) => setResolutionImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-xs font-medium text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="rounded-xl overflow-hidden h-36 border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-black">
                <img
                  src={resolutionImage}
                  alt="Resolution Evidence Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResolveModal(false)}
                className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/25 transition-all"
              >
                Submit Resolution for Citizen Review
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Official Certificate Receipt Modal */}
      {showReceiptModal && (
        <WorkOrderReceiptModal
          report={report}
          onClose={() => setShowReceiptModal(false)}
        />
      )}
    </div>
  );
};
