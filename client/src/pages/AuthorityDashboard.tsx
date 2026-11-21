import React, { useState } from 'react';
import { useIssues } from '../context/IssuesContext';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { CategoryIcon } from '../components/CategoryIcon';
import { SlaCountdown } from '../components/SlaCountdown';
import {
  Briefcase,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Hammer,
  ShieldCheck,
  Search,
  Filter,
  UserCheck,
  Calendar,
  ExternalLink,
  ShieldAlert,
  Zap,
} from 'lucide-react';

interface Props {
  onNavigate: (tab: string, param?: any) => void;
}

export const AuthorityDashboard: React.FC<Props> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { issues, updateStatus } = useIssues();
  const [filterMode, setFilterMode] = useState<'assigned' | 'urgent' | 'slaBreached' | 'all'>('assigned');
  const [search, setSearch] = useState('');

  const myAssigned = issues.filter(
    (r) => r.assignedOfficerId === user?.id || r.assignedOfficerName === user?.name
  );
  const urgentIssues = issues.filter((r) => r.priority === 'Urgent' && r.status !== 'Closed');
  const slaBreached = issues.filter((r) => r.isSlaBreached && r.status !== 'Closed');

  const getQueue = () => {
    let list =
      filterMode === 'assigned'
        ? myAssigned
        : filterMode === 'urgent'
        ? urgentIssues
        : filterMode === 'slaBreached'
        ? slaBreached
        : issues;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.location.address.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
      );
    }
    return list;
  };

  const currentQueue = getQueue();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Officer Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-500 shadow-md ring-4 ring-orange-500/10 dark:ring-orange-500/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">{user?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/70 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                Field Officer
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-mono">
              {user?.departmentName || 'Public Works & Roads Infrastructure'} • Ward 82 Central
            </p>
          </div>
        </div>

        {/* Workload Badges */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-4 bg-stone-50 dark:bg-stone-950 px-4 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-800 text-xs">
            <div>
              <span className="block text-stone-500 dark:text-stone-400 text-[10px] uppercase font-bold font-mono">My Queue</span>
              <span className="text-lg font-black text-stone-900 dark:text-white font-mono">{myAssigned.length}</span>
            </div>
            <div className="w-px h-6 bg-stone-200 dark:bg-stone-800" />
            <div>
              <span className="block text-stone-500 dark:text-stone-400 text-[10px] uppercase font-bold font-mono">Urgent</span>
              <span className="text-lg font-black text-red-600 dark:text-red-400 font-mono">{urgentIssues.length}</span>
            </div>
            <div className="w-px h-6 bg-stone-200 dark:bg-stone-800" />
            <div>
              <span className="block text-stone-500 dark:text-stone-400 text-[10px] uppercase font-bold font-mono">SLA Breached</span>
              <span className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono">{slaBreached.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Queue Filter Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilterMode('assigned')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                filterMode === 'assigned'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Assigned to Me ({myAssigned.length})</span>
            </button>

            <button
              onClick={() => setFilterMode('urgent')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                filterMode === 'urgent'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Urgent Hazards ({urgentIssues.length})</span>
            </button>

            <button
              onClick={() => setFilterMode('slaBreached')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                filterMode === 'slaBreached'
                  ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-500/50 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              <span>SLA Breaches ({slaBreached.length})</span>
            </button>

            <button
              onClick={() => setFilterMode('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                filterMode === 'all'
                  ? 'bg-stone-900 text-white dark:bg-stone-800 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>All Reports ({issues.length})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by ID, keyword, address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 placeholder-stone-400"
            />
          </div>
        </div>

        {/* Work Orders List / Table */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 font-mono font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Issue ID & SLA</th>
                  <th className="py-3.5 px-4">Title & Details</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Impact Multiplier</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800/80">
                {currentQueue.map((rep) => {
                  const isClosed = rep.status === 'Resolved' || rep.status === 'Verified' || rep.status === 'Closed';
                  return (
                    <tr key={rep.id} className="hover:bg-stone-50/80 dark:hover:bg-stone-850 transition-colors">
                      {/* ID & SLA */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1.5">
                          <span className="font-mono font-bold text-stone-900 dark:text-white text-xs">#{rep.id}</span>
                          <PriorityBadge priority={rep.priority} size="sm" />
                          <SlaCountdown
                            deadline={rep.slaDeadline}
                            slaHours={rep.slaHours}
                            isResolved={isClosed}
                          />
                        </div>
                      </td>

                      {/* Title & Category */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-bold text-[11px] font-mono">
                            <CategoryIcon category={rep.category} className="w-3.5 h-3.5" />
                            <span>{rep.category}</span>
                          </div>
                          <p className="font-bold text-stone-900 dark:text-white text-xs line-clamp-1">{rep.title}</p>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1 font-normal">{rep.description}</p>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-4 max-w-[200px]">
                        <p className="text-stone-700 dark:text-stone-300 font-medium truncate text-xs">📍 {rep.location.address}</p>
                        <span className="text-[10px] text-stone-400 dark:text-stone-500 font-mono">{rep.location.city}</span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <StatusBadge status={rep.status} size="sm" />
                      </td>

                      {/* Impact Multiplier */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-500/30 px-2 py-0.5 rounded-lg">
                          <Zap className="w-3 h-3 fill-orange-500 text-orange-500 dark:fill-orange-300" />
                          <span>{rep.impactMultiplier || 1.0}x</span>
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          {!isClosed && (
                            <button
                              onClick={() => updateStatus(rep.id, 'In Progress', 'Crew dispatched on site')}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300 font-bold text-[11px] border border-amber-300 dark:border-amber-500/40 transition-colors"
                              title="Set In Progress"
                            >
                              Dispatch
                            </button>
                          )}
                          <button
                            onClick={() => onNavigate('details', rep.id)}
                            className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-[11px] shadow-xs flex items-center gap-1 transition-all"
                          >
                            <span>Inspect</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
