import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client';
import type { Project } from '../types';

interface ProjectsPageProps {
  token: string;
}

export function ProjectsPage({ token }: ProjectsPageProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<Project[]>('/projects', {}, token)
      .then(setProjects)
      .catch(() => setError('Unable to load projects'));
  }, [token]);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Projects</h1>
      </header>
      {error ? <p className="text-red-600">{error}</p> : null}
      <ul className="space-y-2">
        {projects.map((project) => (
          <li key={project.id} className="rounded bg-white p-3 shadow-sm">
            <Link className="font-medium text-slate-900" to={`/projects/${project.id}`}>
              {project.name}
            </Link>
            {project.description ? <p className="text-sm text-slate-600">{project.description}</p> : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
