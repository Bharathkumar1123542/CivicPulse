import React, { useState, useEffect, useRef } from 'react';
import { useIssues } from '../context/IssuesContext';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  MapPin,
  PlusCircle,
  Briefcase,
  Shield,
  User,
  ExternalLink,
  Sparkles,
  Command,
  ArrowRight,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, param?: any) => void;
}

export const CommandPalette: React.FC<Props> = ({ isOpen, onClose, onNavigate }) => {
  const { issues } = useIssues();
  const { switchRole } = useAuth();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const matchedIssues = issues
    .filter(
      (r) =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.id.toLowerCase().includes(query.toLowerCase()) ||
        r.location.address.toLowerCase().includes(query.toLowerCase()) ||
        r.category.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100">
        {/* Search Input Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, search reports, or jump to page..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none font-medium"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-500 dark:text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Quick Actions */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2">
              Quick Navigation
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  onNavigate('report');
                  onClose();
                }}
                className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 dark:hover:bg-orange-900/50 text-orange-800 dark:text-orange-300 font-semibold flex items-center gap-2 border border-orange-200 dark:border-orange-800/40 transition-colors text-left"
              >
                <PlusCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span>+ Report Issue</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('map');
                  onClose();
                }}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-2 border border-slate-200 dark:border-slate-700/60 transition-colors text-left"
              >
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Explore Live Map</span>
              </button>
            </div>
          </div>

          {/* Role Switching */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2">
              1-Click Demo Role Switch
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => {
                  switchRole('citizen');
                  onNavigate('citizen');
                  onClose();
                }}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5 border border-slate-200 dark:border-slate-700/60"
              >
                <User className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                <span>Citizen</span>
              </button>
              <button
                onClick={() => {
                  switchRole('officer');
                  onNavigate('officer');
                  onClose();
                }}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5 border border-slate-200 dark:border-slate-700/60"
              >
                <Briefcase className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Officer</span>
              </button>
              <button
                onClick={() => {
                  switchRole('admin');
                  onNavigate('admin');
                  onClose();
                }}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5 border border-slate-200 dark:border-slate-700/60"
              >
                <Shield className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Matched Reports */}
          {matchedIssues.length > 0 && (
            <div className="space-y-1 pt-1 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2">
                Matching Civic Reports
              </span>
              <div className="space-y-1">
                {matchedIssues.map((rep) => (
                  <div
                    key={rep.id}
                    onClick={() => {
                      onNavigate('details', rep.id);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer flex items-center justify-between gap-3 text-slate-800 dark:text-slate-200 transition-colors"
                  >
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-orange-600 dark:text-orange-400 font-bold">#{rep.id}</span>
                        <span className="font-bold text-xs truncate text-slate-900 dark:text-white">{rep.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block mt-0.5">
                        📍 {rep.location.address}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
