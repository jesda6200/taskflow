import request from 'supertest';
import { app } from '../app';

describe('project access control', () => {
  it('prevents another user from reading project details', async () => {
    const ownerRes = await request(app).post('/api/v1/auth/register').send({
      email: 'owner@example.com',
      name: 'Owner',
      password: 'secret12'
    });

    const intruderRes = await request(app).post('/api/v1/auth/register').send({
      email: 'intruder@example.com',
      name: 'Intruder',
      password: 'secret12'
    });

    const projectRes = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${ownerRes.body.accessToken}`)
      .send({ name: 'Private Project' });

    expect(projectRes.status).toBe(201);

    const readRes = await request(app)
      .get(`/api/v1/projects/${projectRes.body.id}`)
      .set('Authorization', `Bearer ${intruderRes.body.accessToken}`);

    expect(readRes.status).toBe(404);
  });
});
