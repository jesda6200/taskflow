import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPage } from '../pages/LoginPage';

describe('LoginPage', () => {
  it('submits credentials and calls onAuthenticated', async () => {
    const onAuthenticated = vi.fn();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          accessToken: 'access',
          refreshToken: 'refresh',
          user: { id: 'u1', email: 'john@example.com', name: 'John' }
        })
      })
    );

    render(<LoginPage onAuthenticated={onAuthenticated} />);

    await userEvent.type(screen.getByLabelText('email'), 'john@example.com');
    await userEvent.type(screen.getByLabelText('password'), 'secret12');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(onAuthenticated).toHaveBeenCalledTimes(1);
  });
});
