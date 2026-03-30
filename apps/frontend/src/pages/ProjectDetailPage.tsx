import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../api/client';
import type { ProjectDetail } from '../types';

interface ProjectDetailPageProps {
  token: string;
}

export function ProjectDetailPage({ token }: ProjectDetailPageProps) {
  const { projectId } = useParams();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!projectId) {
      return;
    }

    apiFetch<ProjectDetail>(`/projects/${projectId}`, {}, token)
      .then(setProject)
      .catch(() => setError('Unable to load project'));
  }, [projectId, token]);

  if (error) {
    return <main className="p-6 text-red-600">{error}</main>;
  }

  if (!project) {
    return <main className="p-6 text-slate-700">Loading project...</main>;
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold text-slate-900">{project.name}</h1>
      <p className="mt-1 text-slate-600">{project.description || 'No description'}</p>
      <section className="mt-6">
        <h2 className="text-xl font-medium text-slate-900">Tasks</h2>
        <ul className="mt-3 space-y-2">
          {project.tasks.map((task) => (
            <li key={task.id} className="rounded bg-white p-3 shadow-sm">
              <p className="font-medium text-slate-900">{task.title}</p>
              <p className="text-sm text-slate-600">{task.status}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
