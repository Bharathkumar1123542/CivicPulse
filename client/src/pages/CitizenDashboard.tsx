import React, { useState } from 'react';
import { useIssues } from '../context/IssuesContext';
import { useAuth } from '../context/AuthContext';
import { IssueCard } from '../components/IssueCard';
import { CivicKarmaCard } from '../components/CivicKarmaCard';
import { CategoryIcon } from '../components/CategoryIcon';
import {
  PlusCircle,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Sliders,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface Props {
  onNavigate: (tab: string, param?: any) => void;
}

export const CitizenDashboard: React.FC<Props> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { issues, categories, activeFilterCategory, setActiveFilterCategory } = useIssues();
  const [activeTab, setActiveTab] = useState<'my' | 'nearby' | 'verify'>('my');
  const [search, setSearch] = useState('');
  const [radiusKm, setRadiusKm] = useState<number>(5);

  const myReports = issues.filter((r) => r.citizenId === user?.id || r.citizenEmail === user?.email);
  const verifyReports = issues.filter(
    (r) => r.status === 'Resolved' && (!r.resolution?.citizenVerified)
  );

  const nearbyReports = issues.filter((r) => {
    const userLat = 12.9716;
    const userLng = 77.5946;
    const dist =
      Math.sqrt(
        Math.pow(r.location.latitude - userLat, 2) +
          Math.pow(r.location.longitude - userLng, 2)
      ) * 111;
    (r as any).distanceMeters = Math.round(dist * 1000);
    return dist <= radiusKm;
  });

  const getDisplayedReports = () => {
    let list = activeTab === 'my' ? myReports : activeTab === 'verify' ? verifyReports : nearbyReports;

    if (activeFilterCategory !== 'all') {
      list = list.filter((r) => r.category === activeFilterCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.location.address.toLowerCase().includes(q)
      );
    }

    return list;
  };

  const displayedReports = getDisplayedReports();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner: Profile & Karma Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Profile Card */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                alt={user?.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-500 shadow-md ring-4 ring-orange-500/10 dark:ring-orange-500/20"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">{user?.name}</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/70 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800 text-[10px] font-mono font-bold uppercase">
                    Verified Citizen
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-mono">
                  {user?.email} • Ward 82 (East Indiranagar)
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('report')}
              className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs shadow-md shadow-orange-500/25 flex items-center gap-2 transition-all hover:scale-102"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Issue</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-stone-100 dark:border-stone-800/80">
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800">
              <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400 uppercase font-bold block">
                Lodged Reports
              </span>
              <span className="text-xl font-black text-stone-900 dark:text-white font-mono">{myReports.length}</span>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800">
              <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400 uppercase font-bold block">
                Remediated Fixes
              </span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {myReports.filter((r) => r.status === 'Resolved' || r.status === 'Verified').length}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800">
              <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400 uppercase font-bold block">
                Impact Multiplier
              </span>
              <span className="text-xl font-black text-orange-600 dark:text-orange-400 font-mono">3.8x</span>
            </div>
          </div>
        </div>

        {/* Civic Duty Karma Card */}
        <div className="lg:col-span-5">
          <CivicKarmaCard karma={user?.karma} />
        </div>
      </div>

      {/* Main Tabs & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('my')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'my'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>My Reports ({myReports.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('nearby')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'nearby'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Nearby Incidents ({nearbyReports.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('verify')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'verify'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sign Off Resolutions ({verifyReports.length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by issue, street, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium placeholder-stone-400"
            />
          </div>
        </div>

        {/* Nearby Radius Slider if in nearby tab */}
        {activeTab === 'nearby' && (
          <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300 font-semibold font-mono">
              <Sliders className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span>Proximity Search Radius:</span>
              <span className="text-orange-600 dark:text-orange-400 font-bold">{radiusKm} km</span>
            </div>
            <div className="flex items-center gap-2">
              {[1, 3, 5, 10].map((km) => (
                <button
                  key={km}
                  onClick={() => setRadiusKm(km)}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                    radiusKm === km
                      ? 'bg-orange-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  {km} km
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveFilterCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeFilterCategory === 'all'
                ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-950 shadow-xs'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilterCategory(cat.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeFilterCategory === cat.name
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800'
              }`}
            >
              <CategoryIcon category={cat.name} className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      {displayedReports.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-stone-900/60 rounded-3xl border border-dashed border-stone-200 dark:border-stone-800 p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto text-xl border border-orange-200 dark:border-orange-900">
            📋
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-stone-900 dark:text-white text-base">No matching complaints</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              There are no reports recorded in this view. Submit a new issue to alert municipal crews.
            </p>
          </div>
          <button
            onClick={() => onNavigate('report')}
            className="px-5 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 transition-colors shadow-sm shadow-orange-500/25"
          >
            Submit a New Report
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedReports.map((report) => (
            <IssueCard
              key={report.id}
              report={report}
              onSelect={(r) => onNavigate('details', r.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
