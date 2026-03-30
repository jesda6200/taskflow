import { FormEvent, useState } from 'react';
import { apiFetch } from '../api/client';
import type { AuthResult } from '../types';

interface LoginPageProps {
  onAuthenticated: (result: AuthResult) => void;
}

export function LoginPage({ onAuthenticated }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    try {
      const result = await apiFetch<AuthResult>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      onAuthenticated(result);
    } catch {
      setError('Invalid credentials');
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold text-slate-900">TaskFlow Login</h1>
        <label className="mt-4 block text-sm text-slate-700">
          Email
          <input
            aria-label="email"
            type="email"
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="mt-3 block text-sm text-slate-700">
          Password
          <input
            aria-label="password"
            type="password"
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        <button className="mt-4 w-full rounded bg-slate-900 px-4 py-2 text-white" type="submit">
          Sign in
        </button>
      </form>
    </main>
  );
}
