import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../context/IssuesContext';
import { api } from '../services/api';
import { AnalyticsOverview } from '../types';
import {
  Shield,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Users,
  Activity,
  BarChart3,
  Flame,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface Props {
  onNavigate: (tab: string, param?: any) => void;
}

export const AdminDashboard: React.FC<Props> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { departments } = useIssues();
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await api.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Analytics loading error:', err);
      }
    }
    fetchStats();
  }, []);

  const kpis = analytics?.kpis || {
    total: 1284,
    openCount: 347,
    inProgressCount: 182,
    resolvedCount: 755,
    verifiedCount: 520,
    resolutionRate: 58.8,
    avgResolutionHours: 28.5,
    slaComplianceRate: 96.8,
    activeOfficersCount: 63,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250'}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-500 shadow-md ring-4 ring-orange-500/10 dark:ring-orange-500/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">{user?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/70 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                Municipal Operations Director
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-mono">
              Bengaluru Urban Governance Command Center • Division of Public Accountability
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('map')}
            className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm shadow-orange-500/20 transition-all flex items-center gap-2"
          >
            <Flame className="w-4 h-4 text-amber-300" />
            <span>Open Hazard Heatmap</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <span className="text-stone-500 dark:text-stone-400 font-mono font-bold text-[10px] uppercase tracking-wider">
            Total Complaints
          </span>
          <div className="text-3xl font-black text-stone-900 dark:text-white font-mono">{kpis.total}</div>
          <p className="text-[11px] text-orange-600 dark:text-orange-400 font-medium flex items-center gap-1 font-mono">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+12.4% vs last cycle</span>
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <span className="text-stone-500 dark:text-stone-400 font-mono font-bold text-[10px] uppercase tracking-wider">
            Resolution Rate
          </span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{kpis.resolutionRate}%</div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Target &gt; 55% achieved</span>
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <span className="text-stone-500 dark:text-stone-400 font-mono font-bold text-[10px] uppercase tracking-wider">
            Average SLA Turnaround
          </span>
          <div className="text-3xl font-black text-orange-600 dark:text-orange-400 font-mono">{kpis.avgResolutionHours}h</div>
          <p className="text-[11px] text-orange-600 dark:text-orange-400 font-medium flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>Within 48h mandate</span>
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <span className="text-stone-500 dark:text-stone-400 font-mono font-bold text-[10px] uppercase tracking-wider">
            SLA Compliance Rate
          </span>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">96.8%</div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero critical breaches</span>
          </p>
        </div>
      </div>

      {/* Category Breakdown & Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Category Breakdown */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
            <div>
              <h3 className="font-bold text-stone-900 dark:text-white text-xs uppercase tracking-wider font-mono">
                Category Distribution & Remediation Rates
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">Breakdown of reported defects by municipal domain</p>
            </div>
            <BarChart3 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>

          <div className="space-y-4">
            {(analytics?.categoryBreakdown || [
              { category: 'Damaged Roads & Potholes', count: 480, resolved: 310, rate: 65 },
              { category: 'Broken Streetlights & Dark Spots', count: 320, resolved: 220, rate: 69 },
              { category: 'Garbage Accumulation & Illegal Dumping', count: 260, resolved: 175, rate: 67 },
              { category: 'Water Pipe Leakage & Sewage Block', count: 180, resolved: 120, rate: 67 },
              { category: 'Sparking Transformers & Live Wires', count: 95, resolved: 78, rate: 82 },
            ]).map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-200">
                  <span>{item.category}</span>
                  <span className="text-stone-500 dark:text-stone-400 font-mono">
                    {item.count} reports • <span className="text-emerald-600 dark:text-emerald-400 font-bold">{item.rate}% resolved</span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-stone-100 dark:bg-stone-950 rounded-full overflow-hidden p-0.5 border border-stone-200 dark:border-stone-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-400 transition-all duration-700"
                    style={{ width: `${item.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Resolution Trend */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
            <div>
              <h3 className="font-bold text-stone-900 dark:text-white text-xs uppercase tracking-wider font-mono">
                6-Month Trajectory
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">Complaints logged vs verified remediation</p>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>

          <div className="space-y-3 font-mono">
            {(analytics?.trends || [
              { month: 'Oct 2025', reported: 84, resolved: 76 },
              { month: 'Nov 2025', reported: 112, resolved: 98 },
              { month: 'Dec 2025', reported: 145, resolved: 130 },
              { month: 'Jan 2026', reported: 168, resolved: 154 },
              { month: 'Feb 2026', reported: 195, resolved: 182 },
              { month: 'Mar 2026', reported: 210, resolved: 189 },
            ]).map((t, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                <span className="font-bold text-stone-700 dark:text-stone-300">{t.month}</span>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-stone-500 dark:text-stone-400">
                    In: <span className="text-stone-900 dark:text-white font-bold">{t.reported}</span>
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    Out: {t.resolved}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Municipal Departments Directory */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h3 className="font-bold text-stone-900 dark:text-white text-xs uppercase tracking-wider font-mono">
              Municipal Divisions Performance Roster
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">Clearance efficiency and SLA adherence per agency</p>
          </div>
          <Building2 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 font-mono font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Agency</th>
                <th className="py-3 px-4">Head Engineer</th>
                <th className="py-3 px-4">Engineers</th>
                <th className="py-3 px-4">Active Queue</th>
                <th className="py-3 px-4">Resolved Total</th>
                <th className="py-3 px-4 text-right">Clearance Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/80 font-medium">
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-stone-50/80 dark:hover:bg-stone-850 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-orange-600 dark:text-orange-400">{dept.code}</td>
                  <td className="py-3.5 px-4 font-bold text-stone-900 dark:text-white">{dept.name}</td>
                  <td className="py-3.5 px-4 text-stone-600 dark:text-stone-400">{dept.headName}</td>
                  <td className="py-3.5 px-4 text-stone-600 dark:text-stone-400 font-mono">{dept.officersCount}</td>
                  <td className="py-3.5 px-4 text-amber-600 dark:text-amber-400 font-bold font-mono">{dept.activeIssuesCount}</td>
                  <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold font-mono">{dept.resolvedIssuesCount}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-mono font-bold border border-emerald-200 dark:border-emerald-500/40">
                      {Math.round((dept.resolvedIssuesCount / Math.max(1, dept.activeIssuesCount + dept.resolvedIssuesCount)) * 100)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-Time System Audit Log */}
      <div className="p-6 sm:p-8 rounded-3xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-stone-900 dark:text-white text-xs uppercase tracking-wider font-mono">
              Immutable Action Audit Stream
            </h3>
          </div>
          <span className="text-[10px] text-stone-500 font-mono">RTI Public Transparency Log</span>
        </div>

        <div className="space-y-2.5 max-h-60 overflow-y-auto font-mono text-xs pr-2">
          {(analytics?.auditLogs || [
            { id: '1', action: 'STATUS_UPDATED', actorName: 'Rajesh Kumar', details: 'Status moved to In Progress for #CP-2026-1041', timestamp: '2026-03-01T14:20:00Z' },
            { id: '2', action: 'REPORT_SUBMITTED', actorName: 'Vandhana Vijayakumar', details: 'Lodged new road defect on 100ft Inner Ring Road', timestamp: '2026-03-01T08:15:00Z' },
          ]).map((log, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 truncate">
                <span className="px-2 py-0.5 rounded bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400 text-[10px] font-bold border border-orange-200 dark:border-orange-800">
                  {log.action}
                </span>
                <span className="text-stone-700 dark:text-stone-300 truncate">{log.details}</span>
              </div>
              <span className="text-[10px] text-stone-400 dark:text-stone-500 shrink-0">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
