import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface Props {
  deadline: string;
  slaHours: number;
  isResolved?: boolean;
}

export const SlaCountdown: React.FC<Props> = ({ deadline, slaHours, isResolved = false }) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    isOverdue: boolean;
  }>({ hours: 0, minutes: 0, seconds: 0, isOverdue: false });

  useEffect(() => {
    if (isResolved) return;

    const calculate = () => {
      const now = Date.now();
      const target = new Date(deadline).getTime();
      const diff = target - now;

      if (diff <= 0) {
        const overdueMs = Math.abs(diff);
        const hours = Math.floor(overdueMs / (1000 * 60 * 60));
        const minutes = Math.floor((overdueMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((overdueMs % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds, isOverdue: true });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds, isOverdue: false });
      }
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [deadline, isResolved]);

  if (isResolved) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 text-xs font-mono font-bold">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>SLA Met Successfully</span>
      </span>
    );
  }

  if (timeLeft.isOverdue) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/70 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-500/40 text-xs font-mono font-bold shadow-xs animate-pulse">
        <ShieldAlert className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
        <span>
          SLA Breached +{timeLeft.hours}h {timeLeft.minutes}m (Escalated)
        </span>
      </div>
    );
  }

  const isUrgentWarning = timeLeft.hours < 4;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-colors ${
        isUrgentWarning
          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/40'
          : 'bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60'
      }`}
      title={`Target SLA: ${slaHours} hours from report`}
    >
      <Clock className={`w-3.5 h-3.5 ${isUrgentWarning ? 'text-amber-600 dark:text-amber-400 animate-spin' : 'text-orange-600 dark:text-orange-400'}`} style={{ animationDuration: '8s' }} />
      <span>
        SLA Target: {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </span>
    </div>
  );
};
