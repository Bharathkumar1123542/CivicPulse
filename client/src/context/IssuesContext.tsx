import React, { createContext, useContext, useState, useEffect } from 'react';
import { Report, Department, Category } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface IssuesContextType {
  issues: Report[];
  categories: Category[];
  departments: Department[];
  loading: boolean;
  activeFilterCategory: string;
  activeFilterStatus: string;
  activeFilterPriority: string;
  searchQuery: string;
  setActiveFilterCategory: (c: string) => void;
  setActiveFilterStatus: (s: string) => void;
  setActiveFilterPriority: (p: string) => void;
  setSearchQuery: (q: string) => void;
  refreshIssues: (customParams?: any) => Promise<void>;
  createIssue: (data: Partial<Report>) => Promise<Report>;
  updateStatus: (id: string, status: string, notes?: string) => Promise<Report>;
  assignIssue: (id: string, data: any) => Promise<Report>;
  resolveIssue: (id: string, data: { resolutionNotes: string; evidenceImages?: string[] }) => Promise<Report>;
  verifyIssue: (id: string, data: { confirmed: boolean; rating: number; feedback: string }) => Promise<Report>;
  toggleUpvote: (id: string) => Promise<void>;
}

const IssuesContext = createContext<IssuesContextType | undefined>(undefined);

export const IssuesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [issues, setIssues] = useState<Report[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Global filters
  const [activeFilterCategory, setActiveFilterCategory] = useState<string>('all');
  const [activeFilterStatus, setActiveFilterStatus] = useState<string>('all');
  const [activeFilterPriority, setActiveFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const refreshMasterData = async () => {
    try {
      const [catRes, deptRes] = await Promise.all([
        api.getCategories(),
        api.getDepartments(),
      ]);
      setCategories(catRes.categories);
      setDepartments(deptRes.departments);
    } catch (err) {
      console.warn('Failed to load master data:', err);
    }
  };

  const refreshIssues = async (customParams?: any) => {
    setLoading(true);
    try {
      const params = {
        category: activeFilterCategory !== 'all' ? activeFilterCategory : undefined,
        status: activeFilterStatus !== 'all' ? activeFilterStatus : undefined,
        priority: activeFilterPriority !== 'all' ? activeFilterPriority : undefined,
        search: searchQuery.trim() || undefined,
        ...customParams,
      };
      const res = await api.getIssues(params);
      setIssues(res.reports);
    } catch (err) {
      console.warn('Failed to fetch issues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMasterData();
    refreshIssues();
  }, [activeFilterCategory, activeFilterStatus, activeFilterPriority, searchQuery]);

  const createIssue = async (data: Partial<Report>): Promise<Report> => {
    const res = await api.createIssue({
      ...data,
      citizenId: user?.id,
      citizenName: user?.name,
      citizenEmail: user?.email,
      citizenPhone: user?.phone,
    });
    setIssues((prev) => [res.report, ...prev]);
    return res.report;
  };

  const updateStatus = async (id: string, status: string, notes?: string): Promise<Report> => {
    const res = await api.updateIssueStatus(id, {
      status,
      actorName: user?.name || 'Officer',
      actorRole: user?.role || 'officer',
      notes,
    });
    setIssues((prev) => prev.map((r) => (r.id === id ? res.report : r)));
    return res.report;
  };

  const assignIssue = async (id: string, data: any): Promise<Report> => {
    const res = await api.assignIssue(id, {
      ...data,
      actorName: user?.name || 'Admin',
    });
    setIssues((prev) => prev.map((r) => (r.id === id ? res.report : r)));
    return res.report;
  };

  const resolveIssue = async (
    id: string,
    data: { resolutionNotes: string; evidenceImages?: string[] }
  ): Promise<Report> => {
    const res = await api.resolveIssue(id, {
      resolvedBy: user?.name || 'Officer',
      resolutionNotes: data.resolutionNotes,
      evidenceImages: data.evidenceImages,
    });
    setIssues((prev) => prev.map((r) => (r.id === id ? res.report : r)));
    return res.report;
  };

  const verifyIssue = async (
    id: string,
    data: { confirmed: boolean; rating: number; feedback: string }
  ): Promise<Report> => {
    const res = await api.verifyIssue(id, {
      ...data,
      actorName: user?.name || 'Citizen',
    });
    setIssues((prev) => prev.map((r) => (r.id === id ? res.report : r)));
    return res.report;
  };

  const toggleUpvote = async (id: string) => {
    if (!user) return;
    try {
      const res = await api.toggleUpvote(id, user.id);
      setIssues((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, upvotes: res.upvotes, upvotedBy: res.upvotedBy }
            : r
        )
      );
    } catch (err) {
      console.error('Error toggling upvote:', err);
    }
  };

  return (
    <IssuesContext.Provider
      value={{
        issues,
        categories,
        departments,
        loading,
        activeFilterCategory,
        activeFilterStatus,
        activeFilterPriority,
        searchQuery,
        setActiveFilterCategory,
        setActiveFilterStatus,
        setActiveFilterPriority,
        setSearchQuery,
        refreshIssues,
        createIssue,
        updateStatus,
        assignIssue,
        resolveIssue,
        verifyIssue,
        toggleUpvote,
      }}
    >
      {children}
    </IssuesContext.Provider>
  );
};

export const useIssues = () => {
  const context = useContext(IssuesContext);
  if (!context) throw new Error('useIssues must be used within an IssuesProvider');
  return context;
};
