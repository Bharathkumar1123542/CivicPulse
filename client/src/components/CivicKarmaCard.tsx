import React from 'react';
import { CitizenKarma } from '../types';
import { Award, Sparkles, Star, Zap } from 'lucide-react';

interface Props {
  karma?: CitizenKarma;
}

export const CivicKarmaCard: React.FC<Props> = ({
  karma = {
    points: 420,
    tier: 'Gold Civic Hero',
    badges: ['Eagle Eye', 'Community Guardian', 'Quick Responder', 'Verified Inspector'],
  },
}) => {
  const nextTierPoints = 500;
  const progressPercent = Math.min(100, Math.round((karma.points / nextTierPoints) * 100));

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 text-stone-900 dark:text-white border border-stone-200 dark:border-stone-800 shadow-sm space-y-4 relative overflow-hidden group">
      {/* Decorative ambient background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-orange-400/10 dark:bg-orange-500/10 rounded-full blur-3xl -z-0 pointer-events-none group-hover:scale-110 transition-transform" />

      {/* Top Header */}
      <div className="flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-500/20 border border-orange-300 dark:border-orange-500/40 flex items-center justify-center text-orange-600 dark:text-orange-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 font-mono">
              Civic Duty Karma & Impact
            </h3>
            <span className="text-base font-black text-stone-900 dark:text-white">{karma.tier}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-black text-orange-600 dark:text-orange-400 font-mono flex items-center gap-1 justify-end">
            <Zap className="w-5 h-5 fill-orange-500 text-orange-500 dark:fill-orange-400 dark:text-orange-400" />
            <span>{karma.points}</span>
          </div>
          <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">Karma Points</span>
        </div>
      </div>

      {/* Progress to next tier */}
      <div className="space-y-1.5 z-10 relative">
        <div className="flex items-center justify-between text-[11px] font-medium text-stone-500 dark:text-stone-400">
          <span>Tier Progress</span>
          <span className="font-mono text-stone-700 dark:text-stone-300">
            {karma.points} / {nextTierPoints} to Platinum
          </span>
        </div>
        <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden p-0.5 border border-stone-200 dark:border-stone-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Earned Badges */}
      <div className="space-y-2 z-10 relative">
        <span className="text-[10px] font-mono font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
          Earned Merit Badges
        </span>
        <div className="flex flex-wrap gap-1.5">
          {karma.badges.map((badge, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-50/80 dark:bg-stone-800/90 border border-orange-200 dark:border-stone-700/80 text-[11px] font-semibold text-orange-900 dark:text-stone-200"
            >
              <Star className="w-3 h-3 text-orange-500 fill-orange-400" />
              <span>{badge}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Karma guide footer */}
      <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-[10px] text-stone-500 dark:text-stone-400 z-10 relative font-mono">
        <span className="flex items-center gap-1 text-stone-500 dark:text-stone-400">
          <Sparkles className="w-3 h-3 text-orange-500" />
          <span>+50 Report • +30 Verification • +10 Endorsement</span>
        </span>
      </div>
    </div>
  );
};
