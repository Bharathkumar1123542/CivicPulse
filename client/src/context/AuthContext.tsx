import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; role: UserRole; phone?: string; departmentId?: string }) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fallback demo user if backend is loading or initially offline
const DEFAULT_CITIZEN: User = {
  id: 'user-citizen-1',
  name: 'Vandhana Vijayakumar',
  email: 'vandhana@citizen.org',
  role: 'citizen',
  phone: '+91 98450 12345',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEFAULT_CITIZEN);
  const [token, setToken] = useState<string | null>(localStorage.getItem('civicpulse_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('civicpulse_token');
      if (storedToken) {
        try {
          const res = await api.getCurrentUser();
          setUser(res.user);
        } catch (err) {
          console.warn('Session expired or offline, using default demo user:', err);
          setUser(DEFAULT_CITIZEN);
        }
      } else {
        setUser(DEFAULT_CITIZEN);
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const res = await api.login(email, pass);
      localStorage.setItem('civicpulse_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; password: string; role: UserRole; phone?: string; departmentId?: string }) => {
    setLoading(true);
    try {
      const res = await api.register(data);
      localStorage.setItem('civicpulse_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('civicpulse_token');
    setToken(null);
    setUser(null);
  };

  const switchRole = async (targetRole: UserRole) => {
    try {
      const res = await api.switchRole(targetRole);
      localStorage.setItem('civicpulse_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } catch (err) {
      console.warn('Role switch network issue, updating locally for demo mode:', err);
      if (targetRole === 'citizen') {
        setUser(DEFAULT_CITIZEN);
      } else if (targetRole === 'officer') {
        setUser({
          id: 'user-officer-1',
          name: 'Rajesh Kumar',
          email: 'officer.rajesh@civicpulse.gov',
          role: 'officer',
          phone: '+91 94480 87654',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
          departmentId: 'dept-pwd',
          departmentName: 'Public Works & Roads Infrastructure',
          designation: 'Senior Ward Civil Engineer',
        });
      } else if (targetRole === 'admin') {
        setUser({
          id: 'user-admin-1',
          name: 'Dr. Anand Sharma',
          email: 'admin@civicpulse.gov',
          role: 'admin',
          phone: '+91 98800 11223',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
          designation: 'Municipal Operations Director',
        });
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'citizen',
        token,
        loading,
        login,
        register,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
