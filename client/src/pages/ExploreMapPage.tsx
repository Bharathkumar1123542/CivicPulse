import React, { useState } from 'react';
import { useIssues } from '../context/IssuesContext';
import { MapView } from '../components/MapView';
import { HeatmapView } from '../components/HeatmapView';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { CategoryIcon } from '../components/CategoryIcon';
import { SlaCountdown } from '../components/SlaCountdown';
import {
  MapPin,
  Flame,
  Layers,
  Filter,
  Search,
  Sliders,
  ChevronRight,
  List,
  Zap,
} from 'lucide-react';

interface Props {
  onNavigate: (tab: string, param?: any) => void;
}

export const ExploreMapPage: React.FC<Props> = ({ onNavigate }) => {
  const {
    issues,
    categories,
    activeFilterCategory,
    setActiveFilterCategory,
    activeFilterStatus,
    setActiveFilterStatus,
    activeFilterPriority,
    setActiveFilterPriority,
  } = useIssues();

  const [viewType, setViewType] = useState<'pins' | 'heatmap'>('pins');
  const [showSidePanel, setShowSidePanel] = useState<boolean>(true);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const filteredIssues = issues.filter((r) => {
    if (activeFilterCategory !== 'all' && r.category !== activeFilterCategory) return false;
    if (activeFilterStatus !== 'all' && r.status !== activeFilterStatus) return false;
    if (activeFilterPriority !== 'all' && r.priority !== activeFilterPriority) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
              Geospatial Operations Center
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Civic Incident GIS & Hotspot Heatmap
          </h1>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setViewType('pins')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewType === 'pins'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Interactive Pins</span>
          </button>
          <button
            onClick={() => setViewType('heatmap')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewType === 'heatmap'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Hazard Density Heatmap</span>
          </button>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400 font-mono font-bold text-[10px] uppercase tracking-wider">
            Category:
          </span>
          <select
            value={activeFilterCategory}
            onChange={(e) => setActiveFilterCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white text-xs font-mono"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <span className="text-slate-500 dark:text-slate-400 font-mono font-bold text-[10px] uppercase tracking-wider ml-2">
            Priority:
          </span>
          <select
            value={activeFilterPriority}
            onChange={(e) => setActiveFilterPriority(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white text-xs font-mono"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent Hazards</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <span className="text-slate-500 dark:text-slate-400 font-mono font-bold text-[10px] uppercase tracking-wider ml-2">
            Status:
          </span>
          <select
            value={activeFilterStatus}
            onChange={(e) => setActiveFilterStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white text-xs font-mono"
          >
            <option value="all">All Statuses</option>
            <option value="Reported">Reported</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Verified">Verified</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/80 px-2.5 py-1 rounded-full border border-orange-200 dark:border-orange-800">
            {filteredIssues.length} incidents in viewport
          </span>
          <button
            onClick={() => setShowSidePanel(!showSidePanel)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
          >
            <List className="w-3.5 h-3.5" />
            <span>{showSidePanel ? 'Hide Queue' : 'Show Queue'}</span>
          </button>
        </div>
      </div>

      {/* Main Map + Side Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Container */}
        <div className={`${showSidePanel ? 'lg:col-span-8' : 'lg:col-span-12'} transition-all duration-300`}>
          {viewType === 'pins' ? (
            <MapView
              reports={filteredIssues}
              onSelectReport={(r) => onNavigate('details', r.id)}
              className="w-full h-[600px] border-slate-200 dark:border-slate-800"
            />
          ) : (
            <HeatmapView
              reports={filteredIssues}
              className="w-full h-[600px] border-slate-200 dark:border-slate-800"
            />
          )}
        </div>

        {/* Side Panel: Issues List */}
        {showSidePanel && (
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs font-mono uppercase tracking-wider">
                Geospatial Incident Queue
              </h3>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Real-time sync</span>
            </div>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {filteredIssues.map((rep) => (
                <div
                  key={rep.id}
                  onClick={() => onNavigate('details', rep.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                    selectedReportId === rep.id
                      ? 'bg-orange-50 dark:bg-orange-950/70 border-orange-500 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-orange-400 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <PriorityBadge priority={rep.priority} size="sm" />
                    <StatusBadge status={rep.status} size="sm" />
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-xs leading-snug line-clamp-1">
                    {rep.title}
                  </h4>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-1 font-normal">
                    📍 {rep.location.address}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400 dark:text-slate-500">#{rep.id}</span>
                    <span className="text-orange-600 dark:text-orange-400 font-bold flex items-center gap-0.5">
                      Inspect incident →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
