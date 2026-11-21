import React from 'react';
import { IssuePriority } from '../types';
import { AlertOctagon, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';

interface Props {
  priority: IssuePriority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<Props> = ({ priority, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs font-bold px-2.5 py-1';

  switch (priority) {
    case 'Urgent':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-lg bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-500/50 font-mono font-extrabold tracking-wide uppercase shadow-xs ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-400 animate-ping"></span>
          <AlertOctagon className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
          Urgent
        </span>
      );
    case 'High':
      return (
        <span className={`inline-flex items-center gap-1 rounded-lg bg-orange-50 dark:bg-orange-950/70 text-orange-700 dark:text-orange-400 border border-orange-300 dark:border-orange-500/40 font-mono ${sizeClasses}`}>
          <AlertTriangle className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
          High
        </span>
      );
    case 'Medium':
      return (
        <span className={`inline-flex items-center gap-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30 font-mono ${sizeClasses}`}>
          <ArrowUp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          Medium
        </span>
      );
    case 'Low':
      return (
        <span className={`inline-flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-400 border border-slate-300 dark:border-slate-700 font-mono ${sizeClasses}`}>
          <ArrowDown className="w-3.5 h-3.5 text-slate-500" />
          Low
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 ${sizeClasses}`}>
          {priority}
        </span>
      );
  }
};
