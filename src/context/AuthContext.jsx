import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import config from '../config';

const AuthContext = createContext(null);

const API = axios.create({
  baseURL: config.apiUrl,
});

API.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);

  const refreshSettings = useCallback(async () => {
    try {
      const { data } = await API.get('/settings/public');
      setSettings(data.settings || null);
      return data.settings;
    } catch (e) {
      console.error('Failed to load settings', e);
      return null;
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        await refreshSettings();
        const token = localStorage.getItem('token');
        if (token) {
          const { data } = await API.get('/auth/me');
          setUser(data.user);
        }
      } catch (e) {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [refreshSettings]);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    await refreshSettings();
    return data;
  };

  const register = async (form) => {
    const { data } = await API.post('/auth/register', form);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    await refreshSettings();
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const refreshUser = async () => {
    const { data } = await API.get('/auth/me');
    setUser(data.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        settings,
        login,
        register,
        logout,
        refreshUser,
        refreshSettings,
        API,
        config,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
