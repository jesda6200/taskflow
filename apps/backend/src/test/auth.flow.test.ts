import request from 'supertest';
import { app } from '../app';

describe('auth flow', () => {
  it('registers, logs in, refreshes and logs out', async () => {
    const registerRes = await request(app).post('/api/v1/auth/register').send({
      email: 'alice@example.com',
      name: 'Alice',
      password: 'secret12'
    });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.accessToken).toBeTruthy();
    expect(registerRes.body.refreshToken).toBeTruthy();

    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'alice@example.com',
      password: 'secret12'
    });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.accessToken).toBeTruthy();

    const refreshRes = await request(app).post('/api/v1/auth/refresh').send({
      refreshToken: loginRes.body.refreshToken
    });

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.accessToken).toBeTruthy();

    const logoutRes = await request(app).post('/api/v1/auth/logout').send({
      refreshToken: refreshRes.body.refreshToken
    });

    expect(logoutRes.status).toBe(204);
  });
});
