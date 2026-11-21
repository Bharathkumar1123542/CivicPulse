import React from 'react';
import { IssueStatus } from '../types';
import {
  Clock,
  Search,
  UserCheck,
  Hammer,
  CheckCircle2,
  ShieldCheck,
  Archive,
} from 'lucide-react';

interface Props {
  status: IssueStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<Props> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2',
  }[size];

  switch (status) {
    case 'Reported':
      return (
        <span className={`inline-flex items-center rounded-lg bg-orange-50 dark:bg-orange-950/70 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 animate-pulse" />
          Reported
        </span>
      );
    case 'Under Review':
      return (
        <span className={`inline-flex items-center rounded-lg bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 ${sizeClasses}`}>
          <Search className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          Under Review
        </span>
      );
    case 'Assigned':
      return (
        <span className={`inline-flex items-center rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-300 border border-stone-200 dark:border-stone-700 ${sizeClasses}`}>
          <UserCheck className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
          Assigned
        </span>
      );
    case 'In Progress':
      return (
        <span className={`inline-flex items-center rounded-lg bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 shadow-xs ${sizeClasses}`}>
          <Hammer className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 animate-bounce" />
          In Progress
        </span>
      );
    case 'Resolved':
      return (
        <span className={`inline-flex items-center rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/40 ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          Resolved
        </span>
      );
    case 'Verified':
      return (
        <span className={`inline-flex items-center rounded-lg bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 border border-emerald-400 dark:border-emerald-500/60 font-bold ${sizeClasses}`}>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
          Verified
        </span>
      );
    case 'Closed':
      return (
        <span className={`inline-flex items-center rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 ${sizeClasses}`}>
          <Archive className="w-3.5 h-3.5 text-stone-500" />
          Closed
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center rounded-lg bg-stone-100 text-stone-700 ${sizeClasses}`}>
          {status}
        </span>
      );
  }
};
