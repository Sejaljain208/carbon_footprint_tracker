import React, { createContext, useState, useEffect } from 'react';
import { getApiBaseUrl } from '../utils/apiUrl';

export const AuthContext = createContext();
export const ThemeContext = createContext();

// ========== API BASE URL ==========
const API_URL = getApiBaseUrl();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Verify token
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const parseJsonResponse = async (response) => {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try {
        return await response.json();
      } catch (err) {
        return null;
      }
    }

    const text = await response.text();
    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch (err) {
      return null;
    }
  };

  const fetchUser = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await parseJsonResponse(response);
        if (data?.user) {
          setUser(data.user);
        } else {
          setToken(null);
          localStorage.removeItem('token');
        }
      } else {
        setToken(null);
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await parseJsonResponse(response);
    if (!response.ok) {
      const message = data?.message || response.statusText || 'Login failed';
      throw new Error(message);
    }

    if (!data?.token || !data?.user) {
      throw new Error('Invalid server response during login');
    }

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    return data;
  };

  const signup = async (name, email, password) => {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await parseJsonResponse(response);
    if (!response.ok) {
      const message = data?.message || response.statusText || 'Signup failed';
      throw new Error(message);
    }

    if (!data?.token || !data?.user) {
      throw new Error('Invalid server response during signup');
    }

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'light';
  });

  const [customTheme, setCustomTheme] = useState(() => {
    const saved = localStorage.getItem('customTheme');
    return saved
      ? JSON.parse(saved)
      : { primary: '#10b981', accent: '#f59e0b' };
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const html = document.documentElement;

    // Remove all theme classes
    html.classList.remove('light', 'dark', 'custom');
    html.classList.add(theme);

    // Apply dark mode
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    // Apply custom colors
    if (theme === 'custom') {
      html.style.setProperty('--theme-primary', customTheme.primary);
      html.style.setProperty('--theme-accent', customTheme.accent);
    }
  }, [theme, customTheme]);

  const updateCustomTheme = (primary, accent) => {
    const newTheme = { primary, accent };
    setCustomTheme(newTheme);
    localStorage.setItem('customTheme', JSON.stringify(newTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, customTheme, updateCustomTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
