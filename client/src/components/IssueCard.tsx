import React from 'react';
import { Report } from '../types';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { CategoryIcon } from './CategoryIcon';
import { SlaCountdown } from './SlaCountdown';
import { MapPin, ThumbsUp, Zap } from 'lucide-react';
import { useIssues } from '../context/IssuesContext';

interface Props {
  report: Report;
  onSelect: (report: Report) => void;
}

export const IssueCard: React.FC<Props> = ({ report, onSelect }) => {
  const { toggleUpvote } = useIssues();

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleUpvote(report.id);
  };

  const statusStepMap: Record<string, number> = {
    Reported: 15,
    'Under Review': 30,
    Assigned: 50,
    'In Progress': 70,
    Resolved: 90,
    Verified: 100,
    Closed: 100,
  };
  const progressPercent = statusStepMap[report.status] || 15;
  const isResolved = report.status === 'Resolved' || report.status === 'Verified' || report.status === 'Closed';

  return (
    <div
      onClick={() => onSelect(report)}
      className="group relative bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs hover:shadow-xl dark:hover:shadow-2xl hover:border-orange-500/80 dark:hover:border-orange-500/60 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col hover:-translate-y-1"
    >
      {/* Photo Header */}
      <div className="relative h-44 sm:h-48 w-full bg-stone-100 dark:bg-stone-950 overflow-hidden">
        <img
          src={report.images[0] || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800'}
          alt={report.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <PriorityBadge priority={report.priority} size="sm" />
          <StatusBadge status={report.status} size="sm" />
        </div>

        {/* Impact Multiplier & SLA indicator overlay */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[10px] font-mono">
          <span className="flex items-center gap-1 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/20 font-bold text-amber-300">
            <Zap className="w-3 h-3 fill-amber-300" />
            <span>{report.impactMultiplier || 1.0}x Impact</span>
          </span>

          <span className="text-stone-200 font-mono bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/20">
            #{report.id}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div>
          {/* Category */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 mb-1">
            <CategoryIcon category={report.category} className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
            <span className="truncate">{report.category}</span>
          </div>

          {/* Title */}
          <h3 className="font-extrabold text-stone-900 dark:text-stone-100 text-sm group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-1">
            {report.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 mt-1 leading-relaxed">
            {report.description}
          </p>
        </div>

        {/* SLA Status Widget */}
        <div className="pt-0.5">
          <SlaCountdown
            deadline={report.slaDeadline}
            slaHours={report.slaHours}
            isResolved={isResolved}
          />
        </div>

        {/* Location snippet */}
        <div className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400">
          <MapPin className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 shrink-0" />
          <span className="truncate text-[11px]">{report.location.address}</span>
          {report.distanceMeters !== undefined && (
            <span className="ml-auto text-[10px] font-mono font-bold text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/80 px-1.5 py-0.5 rounded border border-orange-200 dark:border-orange-800/60 shrink-0">
              {(report.distanceMeters / 1000).toFixed(1)} km
            </span>
          )}
        </div>

        {/* Lifecycle progress bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-stone-400">
            <span>Workflow: {report.status}</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isResolved
                  ? 'bg-emerald-500'
                  : report.status === 'In Progress'
                  ? 'bg-amber-500'
                  : 'bg-orange-600'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs">
          <span className="text-[11px] text-stone-500 dark:text-stone-400 truncate max-w-[140px]">
            By {report.citizenName.split(' ')[0]}
          </span>

          <button
            onClick={handleUpvote}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              report.upvotedBy?.includes('user-citizen-1')
                ? 'bg-orange-50 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-600/50'
                : 'bg-stone-50 dark:bg-stone-800 hover:bg-orange-50/50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
            }`}
            title="Endorse & amplify issue priority"
          >
            <ThumbsUp className="w-3 h-3 text-orange-600 dark:text-orange-400" />
            <span className="font-mono">{report.upvotes || 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
