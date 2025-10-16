import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type User = { email: string; role?: 'admin' | 'gestor' | 'operador' } | null;

type AuthContextType = {
  user: User;
  login: (creds: { email: string; password: string }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const navigate = useNavigate();

  const login = ({ email }: { email: string }) => {
    // mock login: set role based on email for demo
    const role = email.includes('admin') ? 'admin' : email.includes('gestor') ? 'gestor' : 'operador';
    setUser({ email, role });
    navigate('/dashboard');
  };

  const logout = () => {
    setUser(null);
    navigate('/');
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
