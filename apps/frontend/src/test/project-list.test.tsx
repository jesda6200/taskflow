import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProjectsPage } from '../pages/ProjectsPage';

describe('ProjectsPage', () => {
  it('renders project list from API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [
          { id: 'p1', name: 'Project One' },
          { id: 'p2', name: 'Project Two' }
        ]
      })
    );

    render(
      <MemoryRouter>
        <ProjectsPage token="token" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Project One')).toBeInTheDocument();
    });

    expect(screen.getByText('Project Two')).toBeInTheDocument();
  });
});
