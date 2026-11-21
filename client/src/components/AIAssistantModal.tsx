import React from 'react';
import { AIAnalysis } from '../types';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Copy,
  Layers,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface Props {
  analysis: AIAnalysis | null;
  loading: boolean;
  onApply: (category: string, priority: string) => void;
  onClose: () => void;
}

export const AIAssistantModal: React.FC<Props> = ({
  analysis,
  loading,
  onApply,
  onClose,
}) => {
  if (!analysis && !loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">CivicPulse AI Co-Pilot</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Autonomous Issue Triage & Prioritization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Analyzing text semantics & geospatial proximity...</p>
            <p className="text-xs text-slate-400">Scanning duplicate reports within 300m radius</p>
          </div>
        ) : analysis ? (
          <div className="space-y-4">
            {/* Duplicate Detection Warning (if found) */}
            {analysis.isPotentialDuplicate && (
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-500/40 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
                  <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Potential Duplicate Detected ({analysis.duplicateSimilarity}% match)</span>
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed">
                  {analysis.duplicateReason}
                </p>
                <div className="text-[11px] text-amber-900/80 dark:text-amber-300/80 font-medium">
                  💡 Tip: You can upvote existing report <span className="font-mono font-bold">#{analysis.duplicateReportId}</span> to boost municipal priority instead of submitting duplicates!
                </div>
              </div>
            )}

            {/* AI Category Recommendation */}
            <div className="p-4 rounded-2xl bg-orange-50/80 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-orange-900 dark:text-orange-300 uppercase tracking-wider">
                  Recommended Category
                </span>
                <span className="px-2 py-0.5 rounded-full bg-orange-600 text-white text-[11px] font-bold">
                  {Math.round(analysis.confidence * 100)}% Confidence
                </span>
              </div>
              <div className="text-base font-bold text-slate-900 dark:text-white">
                {analysis.suggestedCategory}
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {analysis.detectedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300 text-[11px] font-medium"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Priority Recommendation */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Priority Recommendation
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    analysis.suggestedPriority === 'Urgent'
                      ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-500/30'
                      : analysis.suggestedPriority === 'High'
                      ? 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 border border-orange-300 dark:border-orange-500/30'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30'
                  }`}
                >
                  {analysis.suggestedPriority} Priority
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {analysis.priorityReason}
              </p>
            </div>

            {/* Executive Summary */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Municipal Action Brief
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                "{analysis.summary}"
              </p>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => {
                  onApply(analysis.suggestedCategory, analysis.suggestedPriority);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition-all"
              >
                <span>Apply AI Recommendations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
