import React, { useEffect, useState } from 'react';
import { useIssues } from '../context/IssuesContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AnalyticsOverview } from '../types';
import { IssueCard } from '../components/IssueCard';
import {
  Globe,
  ArrowRight,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Users,
  Building,
  TrendingUp,
  ChevronRight,
  Flame,
  Clock,
  Zap,
} from 'lucide-react';

interface Props {
  onNavigate: (tab: string, param?: any) => void;
}

export const LandingPage: React.FC<Props> = ({ onNavigate }) => {
  const { issues } = useIssues();
  const { switchRole } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.warn('Analytics loading error:', err);
      }
    }
    loadStats();
  }, []);

  const totalReports = analytics?.kpis.total || issues.length || 1284;
  const resolutionRate = analytics?.kpis.resolutionRate || 58.8;
  const avgResolutionHours = analytics?.kpis.avgResolutionHours || 28.5;
  const openIssues = analytics?.kpis.openCount || 347;

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Warm ambient backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-orange-500/10 via-amber-500/8 to-orange-400/5 blur-[120px] rounded-full pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 dark:bg-stone-900 text-orange-700 dark:text-orange-400 text-xs font-mono font-bold border border-orange-200 dark:border-orange-500/30 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                <span>GOV-TECH 2.0 • CIVIC RESOLUTION INFRASTRUCTURE</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 dark:text-white tracking-tight leading-[1.08]">
                Turning complaints into{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500">
                  data-driven civic action.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                CivicPulse enables citizens to report, track, and verify community issues while empowering municipal authorities with automated triage, SLA breach escalation, and transparent photographic resolution proof.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => onNavigate('report')}
                  className="px-6 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm shadow-md shadow-orange-500/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Report a Civic Issue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('map')}
                  className="px-6 py-3.5 rounded-2xl bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-sm border border-stone-200 dark:border-stone-700 shadow-xs flex items-center gap-2 transition-all hover:border-orange-500 hover:text-orange-600"
                >
                  <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span>Explore Live Map</span>
                </button>

                <button
                  onClick={() => onNavigate('citizen')}
                  className="px-5 py-3.5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-sm transition-all border border-stone-200 dark:border-stone-700"
                >
                  Citizen Hub →
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-stone-500 dark:text-stone-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Two-Party Closure Attestation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-orange-600" />
                  <span>Automated SLA Accountability</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Zero Redundant Work Orders</span>
                </div>
              </div>
            </div>

            {/* Right Column: High-Tech Telemetry HUD */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                      Live City Operations Telemetry
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400">Bengaluru Command</span>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800">
                    <span className="text-[10px] font-mono font-bold text-stone-500 dark:text-stone-400 uppercase">Complaints Logged</span>
                    <div className="text-3xl font-black text-stone-900 dark:text-white mt-1 font-mono">{totalReports}</div>
                    <span className="text-[11px] text-orange-600 dark:text-orange-400 font-medium">Auto-triaged by AI</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800">
                    <span className="text-[10px] font-mono font-bold text-stone-500 dark:text-stone-400 uppercase">Resolution Rate</span>
                    <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">{resolutionRate}%</div>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Citizen-verified closures</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800">
                    <span className="text-[10px] font-mono font-bold text-stone-500 dark:text-stone-400 uppercase">Active Field Queue</span>
                    <div className="text-3xl font-black text-orange-600 dark:text-orange-400 mt-1 font-mono">{openIssues}</div>
                    <span className="text-[11px] text-orange-600 dark:text-orange-400 font-medium">Under active remediation</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800">
                    <span className="text-[10px] font-mono font-bold text-stone-500 dark:text-stone-400 uppercase">Avg SLA Turnaround</span>
                    <div className="text-3xl font-black text-stone-900 dark:text-white mt-1 font-mono">{avgResolutionHours}h</div>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">96.8% SLA on-time rate</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-orange-50/50 dark:bg-stone-950 border border-orange-200/80 dark:border-stone-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-orange-700 dark:text-orange-400 font-mono">
                      <ShieldCheck className="w-4 h-4" />
                      Two-Party Attestation Protocol
                    </span>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 font-mono">Zero Fake Closures</span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-normal">
                    Authorities must supply before/after GPS photos. The citizen reporter holds sole authorization to sign off on closure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Step Closed-Loop Governance Lifecycle */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
            Closed-Loop Governance Pipeline
          </span>
          <h2 className="text-3xl font-extrabold text-stone-900 dark:text-white">
            From Street Incident to Digital Resolution Stamp
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
            Every complaint proceeds through a traceable, tamper-proof municipal workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: 'Citizen Reports',
              desc: 'Geo-tagged camera evidence & issue description.',
              icon: '📸',
            },
            {
              step: '02',
              title: 'AI Auto-Triage',
              desc: 'Category inference, SLA allocation & 300m duplicate scan.',
              icon: '🤖',
            },
            {
              step: '03',
              title: 'Ward Dispatch',
              desc: 'Routed directly to the responsible division engineer.',
              icon: '🏢',
            },
            {
              step: '04',
              title: 'Remediation Proof',
              desc: 'Field crew uploads after-work photographic proof.',
              icon: '🛠️',
            },
            {
              step: '05',
              title: 'Citizen Sign-Off',
              desc: 'Citizen grades fix with 1-5 stars & generates certificate.',
              icon: '⭐',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3 flex flex-col justify-between hover:-translate-y-1 hover:border-orange-300 dark:hover:border-orange-500/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono font-bold text-orange-600 dark:text-orange-400">
                  <span>PHASE {item.step}</span>
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="font-bold text-stone-900 dark:text-white text-sm mt-3">{item.title}</h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">{item.desc}</p>
              </div>
              <div className="w-full h-1 bg-stone-100 dark:bg-stone-800 rounded-full mt-2" />
            </div>
          ))}
        </div>
      </section>

      {/* Featured Civic Issues */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
              Real-Time Incident Stream
            </span>
            <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">
              Live Issues Under Municipal Remediation
            </h2>
          </div>
          <button
            onClick={() => onNavigate('map')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 transition-colors"
          >
            <span>View All on Geospatial Map</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.slice(0, 3).map((report) => (
            <IssueCard
              key={report.id}
              report={report}
              onSelect={(r) => onNavigate('details', r.id)}
            />
          ))}
        </div>
      </section>

      {/* Professional Persona Comparison */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
              Enterprise Role Security
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
              Built for Every Civic Stakeholder
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-stone-50/70 dark:bg-stone-950/70 border border-stone-200 dark:border-stone-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30 flex items-center justify-center font-bold text-lg">
                  👤
                </div>
                <h3 className="font-extrabold text-base text-stone-900 dark:text-white">Citizen Advocate</h3>
                <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-2 font-normal">
                  <li>• Instant reporting with GPS pin placement & camera evidence</li>
                  <li>• AI duplicate detection to prevent redundant complaints</li>
                  <li>• Live SLA countdown clock tracking ward accountability</li>
                  <li>• Earn Civic Karma badges & impact multipliers</li>
                </ul>
              </div>
              <button
                onClick={() => {
                  switchRole('citizen');
                  onNavigate('citizen');
                }}
                className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-colors shadow-xs"
              >
                Open Citizen Hub →
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-stone-50/70 dark:bg-stone-950/70 border border-stone-200 dark:border-stone-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center font-bold text-lg">
                  🏢
                </div>
                <h3 className="font-extrabold text-base text-stone-900 dark:text-white">Field Engineer / Officer</h3>
                <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-2 font-normal">
                  <li>• Triage work orders filtered by ward zone and priority</li>
                  <li>• Automated AI summaries for immediate field action</li>
                  <li>• Submit before/after resolution proof images</li>
                  <li>• SLA breach alerts with auto-escalation prevention</li>
                </ul>
              </div>
              <button
                onClick={() => {
                  switchRole('officer');
                  onNavigate('officer');
                }}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-xs"
              >
                Open Officer Queue →
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-stone-50/70 dark:bg-stone-950/70 border border-stone-200 dark:border-stone-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-300 border border-stone-300 dark:border-stone-700 flex items-center justify-center font-bold text-lg">
                  🛡️
                </div>
                <h3 className="font-extrabold text-base text-stone-900 dark:text-white">Municipal Director</h3>
                <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-2 font-normal">
                  <li>• City-wide KPIs & turnaround compliance monitoring</li>
                  <li>• Hotspot heatmaps identifying infrastructure failure zones</li>
                  <li>• Department performance roster & efficiency metrics</li>
                  <li>• Immutable audit log for public RTI accountability</li>
                </ul>
              </div>
              <button
                onClick={() => {
                  switchRole('admin');
                  onNavigate('admin');
                }}
                className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors shadow-xs"
              >
                Open Executive Analytics →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
