import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { NotificationDropdown } from './NotificationDropdown';
import {
  Globe,
  MapPin,
  Shield,
  Briefcase,
  User,
  PlusCircle,
  Menu,
  X,
  Search,
  Sun,
  Moon,
} from 'lucide-react';

interface Props {
  currentTab: string;
  onNavigate: (tab: string, param?: any) => void;
  onOpenCommandPalette: () => void;
}

export const Navbar: React.FC<Props> = ({
  currentTab,
  onNavigate,
  onOpenCommandPalette,
}) => {
  const { user, role, switchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'landing', label: 'Overview', icon: Globe },
    { id: 'map', label: 'Live Map', icon: MapPin },
    { id: 'citizen', label: 'Citizen Hub', icon: User },
    { id: 'officer', label: 'Officer Queue', icon: Briefcase },
    { id: 'admin', label: 'Admin Analytics', icon: Shield },
  ];

  const handleRoleSwitch = (newRole: 'citizen' | 'officer' | 'admin') => {
    switchRole(newRole);
    if (newRole === 'citizen') onNavigate('citizen');
    else if (newRole === 'officer') onNavigate('officer');
    else if (newRole === 'admin') onNavigate('admin');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border-b border-stone-200 dark:border-stone-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
              <Globe className="w-5 h-5 text-white" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-stone-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  CivicPulse
                </span>
                <span className="text-[10px] font-mono font-bold tracking-wider px-1.5 py-0.2 rounded bg-orange-50 dark:bg-orange-950/70 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                  GOV TECH
                </span>
              </div>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 font-medium -mt-1 hidden sm:block">
                Resolution & Triage Platform
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100/90 dark:bg-stone-800/80 p-1 rounded-2xl border border-stone-200/80 dark:border-stone-700">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-white dark:hover:bg-stone-700/70'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Command Palette Button (Ctrl+K) */}
            <button
              onClick={onOpenCommandPalette}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:border-orange-300 text-xs transition-colors"
              title="Search everything (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              <span className="text-[11px] font-medium">Search</span>
              <kbd className="text-[10px] font-mono bg-white dark:bg-stone-700 px-1.5 py-0.2 rounded border border-stone-200 dark:border-stone-600 text-stone-500 dark:text-stone-400 shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Sun / Moon Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition-colors shadow-2xs"
              title={`Switch to ${theme === 'light' ? 'Dark Command Center' : 'Clean Civic Light'} theme`}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-stone-700" />
              ) : (
                <Sun className="w-4 h-4 text-orange-400" />
              )}
            </button>

            {/* Role Switcher Pill */}
            <div className="hidden xl:flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold">
              <span className="text-[10px] text-stone-500 dark:text-stone-400 px-2 font-mono">
                Role:
              </span>
              <button
                onClick={() => handleRoleSwitch('citizen')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  role === 'citizen'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                Citizen
              </button>
              <button
                onClick={() => handleRoleSwitch('officer')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  role === 'officer'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                Officer
              </button>
              <button
                onClick={() => handleRoleSwitch('admin')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  role === 'admin'
                    ? 'bg-stone-800 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Notification Dropdown */}
            <NotificationDropdown onSelectReport={(id) => onNavigate('details', id)} />

            {/* Report Issue CTA Button */}
            <button
              onClick={() => onNavigate('report')}
              className="inline-flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white px-3.5 py-2 rounded-xl text-xs font-extrabold shadow-sm shadow-orange-500/25 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Report Issue</span>
              <span className="sm:hidden">Report</span>
            </button>

            {/* User Avatar */}
            <div
              onClick={() => onNavigate(role === 'citizen' ? 'citizen' : role === 'officer' ? 'officer' : 'admin')}
              className="flex items-center gap-2 pl-1 cursor-pointer group"
              title={`Active persona: ${user?.name} (${role})`}
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-stone-200 dark:border-stone-700 shadow-sm ring-2 ring-stone-100 dark:ring-stone-800 group-hover:ring-orange-500 transition-all"
              />
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 pt-3 pb-5 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold ${
                    currentTab === link.id
                      ? 'bg-orange-50 dark:bg-orange-950/80 text-orange-700 dark:text-orange-400'
                      : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">Theme:</span>
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs font-bold text-stone-700 dark:text-stone-200 flex items-center gap-1.5"
            >
              {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-orange-400" />}
              <span>{theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}</span>
            </button>
          </div>

          <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
            <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block mb-2 font-mono">
              Switch Persona
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => {
                  handleRoleSwitch('citizen');
                  setMobileMenuOpen(false);
                }}
                className={`py-1.5 rounded-lg text-xs font-bold ${
                  role === 'citizen' ? 'bg-orange-600 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                Citizen
              </button>
              <button
                onClick={() => {
                  handleRoleSwitch('officer');
                  setMobileMenuOpen(false);
                }}
                className={`py-1.5 rounded-lg text-xs font-bold ${
                  role === 'officer' ? 'bg-amber-600 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                Officer
              </button>
              <button
                onClick={() => {
                  handleRoleSwitch('admin');
                  setMobileMenuOpen(false);
                }}
                className={`py-1.5 rounded-lg text-xs font-bold ${
                  role === 'admin' ? 'bg-stone-800 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
