import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useIssues } from '../context/IssuesContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { MapView } from '../components/MapView';
import { AIAssistantModal } from '../components/AIAssistantModal';
import { CategoryIcon } from '../components/CategoryIcon';
import { AIAnalysis, IssuePriority } from '../types';
import {
  Sparkles,
  MapPin,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface Props {
  onNavigate: (tab: string, param?: any) => void;
}

const SAMPLE_CIVIC_PHOTOS = [
  {
    label: 'Road Pothole',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800',
  },
  {
    label: 'Broken Streetlight',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800',
  },
  {
    label: 'Garbage Dump',
    url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&q=80&w=800',
  },
  {
    label: 'Water Burst',
    url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&q=80&w=800',
  },
  {
    label: 'Live Wire',
    url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800',
  },
];

export const ReportIssuePage: React.FC<Props> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { categories, createIssue } = useIssues();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Damaged Roads & Potholes');
  const [priority, setPriority] = useState<IssuePriority>('Medium');

  // Location state (Bangalore Default)
  const [latitude, setLatitude] = useState<number>(12.9716);
  const [longitude, setLongitude] = useState<number>(77.5946);
  const [address, setAddress] = useState('MG Road, Central Commercial District, Bengaluru');
  const [landmark, setLandmark] = useState('Near Metro Station Exit 2');

  // Photo
  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_CIVIC_PHOTOS[0].url);
  const [customImageUrl, setCustomImageUrl] = useState<string>('');

  // AI Modal state
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Trigger AI assistant
  const handleRunAI = async () => {
    if (!title.trim() && !description.trim()) {
      alert('Please enter at least an issue title or description before running AI analysis.');
      return;
    }
    setIsAiLoading(true);
    setShowAiModal(true);
    try {
      const res = await api.analyzeWithAI({
        title,
        description,
        location: { latitude, longitude, address },
        categoryHint: category,
      });
      setAiAnalysis(res.analysis);
    } catch (err) {
      console.error('AI check error:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleApplyAI = (suggestedCat: string, suggestedPri: string) => {
    setCategory(suggestedCat);
    setPriority(suggestedPri as IssuePriority);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill out all mandatory fields.');
      return;
    }

    setSubmitting(true);
    try {
      const finalImage = customImageUrl.trim() || selectedImage;

      const newReport = await createIssue({
        title,
        description,
        category,
        priority,
        location: {
          address,
          landmark,
          latitude,
          longitude,
          city: 'Bengaluru',
        },
        images: [finalImage],
      });

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        onNavigate('details', newReport.id);
      }, 900);
    } catch (err: any) {
      alert(err.message || 'Failed to submit report');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
          Citizen Reporting Interface
        </span>
        <h1 className="text-3xl font-black text-stone-900 dark:text-white tracking-tight">
          File a Civic Grievance
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-lg mx-auto">
          Help authorities quickly locate and resolve community defects through automated triage & SLA countdown tracking.
        </p>
      </div>

      {/* Stepper Navigation */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-md mx-auto text-xs font-bold font-mono">
        <button
          onClick={() => setCurrentStep(1)}
          className={`py-2 rounded-xl transition-all ${
            currentStep === 1
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          1. Issue Details
        </button>
        <button
          onClick={() => setCurrentStep(2)}
          className={`py-2 rounded-xl transition-all ${
            currentStep === 2
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          2. Geo Location
        </button>
        <button
          onClick={() => setCurrentStep(3)}
          className={`py-2 rounded-xl transition-all ${
            currentStep === 3
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          3. Photo Evidence
        </button>
      </div>

      {/* Step 1: Issue Details */}
      {currentStep === 1 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 font-mono">
              Describe the Problem
            </h2>

            {/* AI Analyze trigger */}
            <button
              type="button"
              onClick={handleRunAI}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs hover:scale-102 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Auto-Triage & SLA</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                Issue Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Broken streetlight on 5th Cross near community park"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-sm text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium placeholder-stone-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                Select Municipal Category *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.name)}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                      category === cat.name
                        ? 'bg-orange-50 dark:bg-orange-950/80 border-orange-500 text-orange-900 dark:text-orange-300 ring-2 ring-orange-500/20 font-bold'
                        : 'bg-white dark:bg-stone-950/60 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-orange-50/40 dark:hover:bg-stone-800'
                    }`}
                  >
                    <div className="p-1.5 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-orange-600 dark:text-orange-400 shrink-0">
                      <CategoryIcon category={cat.name} className="w-4 h-4" />
                    </div>
                    <span className="text-xs leading-snug line-clamp-2">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                Detailed Incident Description *
              </label>
              <textarea
                rows={4}
                placeholder="Describe what occurred, public danger hazards, time noticed, or affected commuter traffic..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-sm text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium leading-relaxed placeholder-stone-400"
                required
              />
            </div>

            {/* Priority Selector */}
            <div>
              <label className="block text-xs font-mono font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                Perceived Urgency / Severity
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Low', 'Medium', 'High', 'Urgent'] as IssuePriority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                      priority === p
                        ? p === 'Urgent'
                          ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-500 shadow-xs'
                          : p === 'High'
                          ? 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 border-orange-500'
                          : 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border-orange-300'
                        : 'bg-white dark:bg-stone-950 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (!title.trim() || !description.trim()) {
                  alert('Please enter a title and description.');
                  return;
                }
                setCurrentStep(2);
              }}
              className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs shadow-md shadow-orange-500/25 flex items-center gap-2 transition-all hover:scale-102"
            >
              <span>Next: Set Location Coordinates</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Location Map */}
      {currentStep === 2 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 font-mono">
                Pinpoint Geographic Coordinates
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">Click on the interactive map or enter the street address</p>
            </div>
            <button
              type="button"
              onClick={handleRunAI}
              className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 flex items-center gap-1 font-mono"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Duplicate Scan (300m)</span>
            </button>
          </div>

          {/* Interactive Leaflet Picker Map */}
          <MapView
            selectMode={true}
            selectedLocation={{ latitude, longitude }}
            onSelectLocation={(loc) => {
              setLatitude(loc.latitude);
              setLongitude(loc.longitude);
              if (loc.address) setAddress(loc.address);
            }}
            className="w-full h-80"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                Street / Area Address *
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-xs text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                Nearby Landmark / Zone
              </label>
              <input
                type="text"
                placeholder="e.g. Opposite Pillar 140 / Near School gate"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-xs text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 font-medium placeholder-stone-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-mono bg-stone-50 dark:bg-stone-950 p-3 rounded-xl border border-stone-200 dark:border-stone-800">
            <span>Latitude: {latitude.toFixed(6)}</span>
            <span>Longitude: {longitude.toFixed(6)}</span>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-bold text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs shadow-md shadow-orange-500/25 flex items-center gap-2 transition-all hover:scale-102"
            >
              <span>Next: Photo Evidence</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Photo & Submit */}
      {currentStep === 3 && (
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
          <div className="pb-3 border-b border-stone-200 dark:border-stone-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 font-mono">
              Upload Photographic Verification Evidence
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Clear photos help ward dispatch teams accurately assign equipment and materials.
            </p>
          </div>

          {/* Test Photo Presets */}
          <div className="space-y-3">
            <label className="block text-xs font-mono font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              Choose from Common Test Photos or Enter URL:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {SAMPLE_CIVIC_PHOTOS.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedImage(item.url);
                    setCustomImageUrl('');
                  }}
                  className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all aspect-video group ${
                    selectedImage === item.url && !customImageUrl
                      ? 'border-orange-500 ring-2 ring-orange-500/40 scale-102'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  <img
                    src={item.url}
                    alt={item.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform opacity-90"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-2">
                    <span className="text-[10px] font-bold text-white leading-tight">
                      {item.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
              Custom Photo URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={customImageUrl}
              onChange={(e) => setCustomImageUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-xs text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 font-medium placeholder-stone-400"
            />
          </div>

          {/* Final Verification Review Pill */}
          <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/40 space-y-2 text-xs">
            <div className="flex items-center justify-between text-orange-800 dark:text-orange-300 font-bold font-mono">
              <span>Ready for Municipal Registration</span>
              <span className="px-2.5 py-0.5 rounded-full bg-orange-600 text-white text-[10px]">
                {priority} Priority
              </span>
            </div>
            <p className="text-stone-900 dark:text-white font-bold">{title}</p>
            <p className="text-stone-600 dark:text-stone-400 font-mono text-[11px]">📍 {address}</p>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-bold text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-sm shadow-md shadow-orange-500/25 flex items-center gap-2 transition-all hover:scale-102 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Registering Complaint...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit & Start SLA Clock</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* AI Assistant Modal */}
      <AIAssistantModal
        analysis={aiAnalysis}
        loading={isAiLoading}
        onApply={handleApplyAI}
        onClose={() => setShowAiModal(false)}
      />
    </div>
  );
};
