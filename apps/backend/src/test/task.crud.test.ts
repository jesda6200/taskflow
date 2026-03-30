import request from 'supertest';
import { app } from '../app';

describe('task create and read', () => {
  it('creates a task and reads it back from project listing', async () => {
    const authRes = await request(app).post('/api/v1/auth/register').send({
      email: 'taskowner@example.com',
      name: 'Task Owner',
      password: 'secret12'
    });

    const token = authRes.body.accessToken;

    const projectRes = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Project Alpha' });

    expect(projectRes.status).toBe(201);

    const taskRes = await request(app)
      .post(`/api/v1/projects/${projectRes.body.id}/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'My first task', description: 'desc' });

    expect(taskRes.status).toBe(201);
    expect(taskRes.body.title).toBe('My first task');

    const listRes = await request(app)
      .get(`/api/v1/projects/${projectRes.body.id}/tasks`)
      .set('Authorization', `Bearer ${token}`);

    expect(listRes.status).toBe(200);
    expect(listRes.body).toHaveLength(1);
    expect(listRes.body[0].id).toBe(taskRes.body.id);
  });
});
