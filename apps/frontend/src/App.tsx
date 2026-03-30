import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import type { AuthResult } from './types';

function readStoredAccessToken(): string {
  return localStorage.getItem('taskflow_access_token') || '';
}

export default function App() {
  const [token, setToken] = useState<string>(readStoredAccessToken());

  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  const handleAuthenticated = (result: AuthResult) => {
    localStorage.setItem('taskflow_access_token', result.accessToken);
    localStorage.setItem('taskflow_refresh_token', result.refreshToken);
    setToken(result.accessToken);
  };

  if (!isAuthenticated) {
    return <LoginPage onAuthenticated={handleAuthenticated} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProjectsPage token={token} />} />
        <Route path="/projects/:projectId" element={<ProjectDetailPage token={token} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
