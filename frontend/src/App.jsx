// this file is the main entry point of the React application. It sets up the routing and context providers for authentication and theme management.

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, ThemeProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { AIAssistant } from './pages/AIAssistant';
import { Reports } from './pages/Reports';
import { ActivityHistory } from './pages/ActivityHistory';
import { Achievements } from './pages/Achievements';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-assistant"
              element={
                <ProtectedRoute>
                  <AIAssistant />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/activity-history"
              element={
                <ProtectedRoute>
                  <ActivityHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/achievements"
              element={
                <ProtectedRoute>
                  <Achievements />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
