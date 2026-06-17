import { useContext } from 'react';
import { AuthContext, ThemeContext } from '../context/AuthContext';
import { getApiBaseUrl } from './apiUrl';

// ========== API BASE URL ==========
// Production: Render backend URL
// Development: localhost
const API_URL = getApiBaseUrl();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// ========== API HELPER FUNCTIONS ==========
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
    headers: { ...defaultOptions.headers, ...options.headers },
  });
  
  return response;
};