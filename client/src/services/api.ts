import {
  Report,
  Department,
  Category,
  Comment,
  Notification,
  AnalyticsOverview,
  User,
  UserRole,
  AIAnalysis,
} from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('civicpulse_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    departmentId?: string;
  }): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  async switchRole(role: UserRole): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/demo-switch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to switch demo role');
    }
    return res.json();
  },

  async getCurrentUser(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
  },

  // Issues
  async getIssues(params?: {
    status?: string;
    category?: string;
    priority?: string;
    departmentId?: string;
    citizenId?: string;
    assignedOfficerId?: string;
    search?: string;
    lat?: number;
    lng?: number;
    radiusKm?: number;
  }): Promise<{ count: number; reports: Report[] }> {
    const url = new URL(`${window.location.origin}${API_BASE}/issues`);
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          url.searchParams.append(key, String(val));
        }
      });
    }
    const res = await fetch(url.toString(), { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch issues');
    return res.json();
  },

  async getIssueById(id: string): Promise<{ report: Report; comments: Comment[] }> {
    const res = await fetch(`${API_BASE}/issues/${id}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch issue details');
    return res.json();
  },

  async createIssue(data: Partial<Report>): Promise<{ report: Report }> {
    const res = await fetch(`${API_BASE}/issues`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit issue');
    }
    return res.json();
  },

  async updateIssueStatus(
    id: string,
    data: { status: string; actorName?: string; actorRole?: string; notes?: string }
  ): Promise<{ report: Report }> {
    const res = await fetch(`${API_BASE}/issues/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },

  async assignIssue(
    id: string,
    data: {
      departmentId: string;
      assignedOfficerId?: string;
      assignedOfficerName?: string;
      assignedOfficerPhone?: string;
      actorName?: string;
    }
  ): Promise<{ report: Report }> {
    const res = await fetch(`${API_BASE}/issues/${id}/assign`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to assign issue');
    return res.json();
  },

  async resolveIssue(
    id: string,
    data: {
      resolvedBy: string;
      resolutionNotes: string;
      evidenceImages?: string[];
    }
  ): Promise<{ report: Report }> {
    const res = await fetch(`${API_BASE}/issues/${id}/resolve`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit resolution');
    return res.json();
  },

  async verifyIssue(
    id: string,
    data: {
      confirmed: boolean;
      rating: number;
      feedback: string;
      actorName?: string;
    }
  ): Promise<{ report: Report }> {
    const res = await fetch(`${API_BASE}/issues/${id}/verify`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to confirm resolution');
    return res.json();
  },

  async toggleUpvote(id: string, userId: string): Promise<{ upvotes: number; upvotedBy: string[] }> {
    const res = await fetch(`${API_BASE}/issues/${id}/upvote`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) throw new Error('Failed to toggle upvote');
    return res.json();
  },

  async addComment(
    reportId: string,
    data: {
      userId: string;
      userName: string;
      userRole: UserRole;
      userAvatar?: string;
      message: string;
    }
  ): Promise<{ comment: Comment }> {
    const res = await fetch(`${API_BASE}/issues/${reportId}/comments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to post comment');
    return res.json();
  },

  // AI
  async analyzeWithAI(data: {
    title: string;
    description: string;
    location?: { latitude: number; longitude: number; address?: string };
    categoryHint?: string;
  }): Promise<{ analysis: AIAnalysis }> {
    const res = await fetch(`${API_BASE}/ai/analyze`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('AI analysis failed');
    return res.json();
  },

  // Master Data
  async getDepartments(): Promise<{ departments: Department[] }> {
    const res = await fetch(`${API_BASE}/departments`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch departments');
    return res.json();
  },

  async getCategories(): Promise<{ categories: Category[] }> {
    const res = await fetch(`${API_BASE}/categories`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  // Analytics
  async getAnalytics(): Promise<AnalyticsOverview> {
    const res = await fetch(`${API_BASE}/analytics/overview`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  // Notifications
  async getNotifications(userId: string): Promise<{ unreadCount: number; notifications: Notification[] }> {
    const res = await fetch(`${API_BASE}/notifications?userId=${encodeURIComponent(userId)}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  async markNotificationRead(id: string): Promise<void> {
    await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
  },

  async markAllNotificationsRead(userId: string): Promise<void> {
    await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId }),
    });
  },
};
