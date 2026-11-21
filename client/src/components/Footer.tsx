import React from 'react';
import { Globe, Shield, Code, Sparkles, MapPin, CheckCircle2, Clock } from 'lucide-react';

interface Props {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<Props> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-xs border-t border-slate-200 dark:border-slate-800/80 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white font-bold shadow-sm">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                CivicPulse
              </span>
              <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                GOV-AI PLATFORM
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-md text-xs">
              Next-generation civic engagement and municipal issue resolution infrastructure. Empowering citizen reporting with automated AI triage, geospatial duplicate detection, and transparent verification evidence.
            </p>
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1 shadow-xs">
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-300 font-bold">
                <span className="text-amber-500">⭐ Vision:</span>
                <span className="italic text-slate-700 dark:text-slate-200">"Report problems. Track progress. Build better communities."</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Turning fragmented civic complaints into verifiable, data-backed municipal action.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-slate-900 dark:text-slate-200 font-bold text-xs uppercase tracking-wider font-mono">
              Core Modules
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('map')} className="text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-left flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Live Geospatial Heatmap</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('citizen')} className="text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-left flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Citizen Hub & Karma Badges</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('officer')} className="text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-left flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Officer SLA Dispatch Queue</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-left flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>Executive Municipal KPIs</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Author Accreditation */}
          <div className="space-y-3">
            <h4 className="text-slate-900 dark:text-slate-200 font-bold text-xs uppercase tracking-wider font-mono">
              Engineering Profile
            </h4>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-sm">
                <Code className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span>Vandhana Vijayakumar</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Full-Stack Developer | AI Enthusiast
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold pt-1 border-t border-slate-100 dark:border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>System Operational • Node.js + React</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 CivicPulse Platform. Engineered by <span className="text-slate-800 dark:text-slate-300 font-bold">Vandhana Vijayakumar</span>.
          </div>
          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 font-mono text-[10px]">
            <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
              <Sparkles className="w-3 h-3" />
              AI Powered Triage
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <Shield className="w-3 h-3" />
              SLA Enforcement
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
