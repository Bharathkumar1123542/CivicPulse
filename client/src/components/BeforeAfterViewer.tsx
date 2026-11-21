import React, { useState } from 'react';
import { ResolutionData } from '../types';
import { CheckCircle2, Star, ShieldCheck, Calendar, UserCheck } from 'lucide-react';

interface Props {
  initialImage: string;
  resolution?: ResolutionData;
}

export const BeforeAfterViewer: React.FC<Props> = ({ initialImage, resolution }) => {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'slider'>('side-by-side');
  const [sliderPosition, setSliderPosition] = useState(50);

  if (!resolution || !resolution.evidenceImages || resolution.evidenceImages.length === 0) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-sm">
        <img
          src={initialImage}
          alt="Reported Issue Evidence"
          className="w-full h-72 sm:h-96 object-cover"
        />
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          Original Reported Condition
        </div>
      </div>
    );
  }

  const afterImage = resolution.evidenceImages[0];

  return (
    <div className="space-y-4">
      {/* Mode Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Resolution Evidence Verification
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Remediated
          </span>
        </div>

        <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 text-xs font-semibold border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`px-3 py-1 rounded-lg transition-all ${
              viewMode === 'side-by-side'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setViewMode('slider')}
            className={`px-3 py-1 rounded-lg transition-all ${
              viewMode === 'slider'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Interactive Slider
          </button>
        </div>
      </div>

      {viewMode === 'side-by-side' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Before */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-sm group">
            <img
              src={initialImage}
              alt="Before Remediation"
              className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 bg-red-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              BEFORE (Reported Defect)
            </div>
          </div>

          {/* After */}
          <div className="relative rounded-2xl overflow-hidden border border-emerald-400 dark:border-emerald-500/40 bg-slate-900 shadow-sm group ring-2 ring-emerald-500/20">
            <img
              src={afterImage}
              alt="After Remediation"
              className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 bg-emerald-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              AFTER (Officer Resolution)
            </div>
          </div>
        </div>
      ) : (
        /* Interactive Before/After Split Slider */
        <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96 border border-slate-200 dark:border-slate-800 shadow-sm select-none">
          <img
            src={afterImage}
            alt="After"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={initialImage}
              alt="Before"
              className="absolute inset-0 w-full h-full object-cover max-w-none"
              style={{ width: '100%', minWidth: '100%' }}
            />
          </div>

          {/* Slider divider line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl flex items-center justify-center cursor-ew-resize"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="w-8 h-8 rounded-full bg-white shadow-lg border border-slate-300 flex items-center justify-center text-slate-700 text-xs font-bold">
              ⇄
            </div>
          </div>

          {/* Interactive Range Input overlay */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
          />

          <div className="absolute top-3 left-3 bg-red-600/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-full pointer-events-none">
            BEFORE
          </div>
          <div className="absolute top-3 right-3 bg-emerald-600/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-full pointer-events-none">
            AFTER
          </div>
        </div>
      )}

      {/* Resolution Notes card */}
      <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-900 dark:text-emerald-300">
          <div className="flex items-center gap-1.5 font-semibold">
            <UserCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span>Field Officer: {resolution.resolvedBy || 'Municipal Authority'}</span>
          </div>
          {resolution.resolvedAt && (
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>Resolved on {new Date(resolution.resolvedAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          "{resolution.resolutionNotes}"
        </p>

        {/* Citizen Verification review if available */}
        {resolution.citizenVerified && (
          <div className="mt-3 pt-3 border-t border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-teal-800 dark:text-teal-300 font-bold">
              <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Citizen Verified Satisfaction</span>
            </div>
            {resolution.citizenRating && (
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < (resolution.citizenRating || 0)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
