import { Router } from 'express';
import { z } from 'zod';
import { TaskStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { getUserId } from '../middleware/auth';

const router = Router();

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional()
});

const updateSchema = createSchema.partial();

async function ensureOwnedProject(projectId: string, ownerId: string): Promise<boolean> {
  const project = await prisma.project.findFirst({ where: { id: projectId, ownerId } });
  return Boolean(project);
}

router.post('/projects/:projectId/tasks', async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid payload', issues: parsed.error.flatten() });
    return;
  }

  const ownerId = getUserId(req);
  const hasAccess = await ensureOwnedProject(req.params.projectId, ownerId);
  if (!hasAccess) {
    res.status(404).json({ message: 'Project not found' });
    return;
  }

  const task = await prisma.task.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      status: parsed.data.status,
      projectId: req.params.projectId
    }
  });

  res.status(201).json(task);
});

router.get('/projects/:projectId/tasks', async (req, res) => {
  const ownerId = getUserId(req);
  const hasAccess = await ensureOwnedProject(req.params.projectId, ownerId);
  if (!hasAccess) {
    res.status(404).json({ message: 'Project not found' });
    return;
  }

  const tasks = await prisma.task.findMany({
    where: { projectId: req.params.projectId },
    include: { comments: true },
    orderBy: { createdAt: 'desc' }
  });

  res.json(tasks);
});

router.get('/tasks/:id', async (req, res) => {
  const ownerId = getUserId(req);

  const task = await prisma.task.findFirst({
    where: {
      id: req.params.id,
      project: {
        ownerId
      }
    },
    include: {
      comments: true
    }
  });

  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }

  res.json(task);
});

router.patch('/tasks/:id', async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid payload', issues: parsed.error.flatten() });
    return;
  }

  const ownerId = getUserId(req);

  const existing = await prisma.task.findFirst({
    where: {
      id: req.params.id,
      project: {
        ownerId
      }
    }
  });

  if (!existing) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }

  const task = await prisma.task.update({
    where: { id: req.params.id },
    data: parsed.data
  });

  res.json(task);
});

router.delete('/tasks/:id', async (req, res) => {
  const ownerId = getUserId(req);

  const existing = await prisma.task.findFirst({
    where: {
      id: req.params.id,
      project: {
        ownerId
      }
    }
  });

  if (!existing) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }

  await prisma.task.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
