import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check for an existing token

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    // Token exists — validate it against the API and load the user
    axiosInstance
      .get('/auth/me')
      .then((res) => setUser(res.data.data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await axiosInstance.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.data.token);
    setUser(res.data.data.user);
  };

  const register = async (name, email, password) => {
    const res = await axiosInstance.post('/auth/register', { name, email, password });
    localStorage.setItem('token', res.data.data.token);
    setUser(res.data.data.user);
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch {
      // best effort — log out client-side regardless of API result
    }
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}