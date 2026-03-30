import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { getUserId } from '../middleware/auth';

const router = Router();

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional()
});

const updateSchema = createSchema.partial();

router.post('/', async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid payload', issues: parsed.error.flatten() });
    return;
  }

  const ownerId = getUserId(req);

  const project = await prisma.project.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      ownerId
    }
  });

  res.status(201).json(project);
});

router.get('/', async (req, res) => {
  const ownerId = getUserId(req);
  const projects = await prisma.project.findMany({
    where: { ownerId },
    orderBy: { createdAt: 'desc' }
  });
  res.json(projects);
});

router.get('/:id', async (req, res) => {
  const ownerId = getUserId(req);

  const project = await prisma.project.findFirst({
    where: { id: req.params.id, ownerId },
    include: {
      tasks: {
        include: {
          comments: true
        }
      }
    }
  });

  if (!project) {
    res.status(404).json({ message: 'Project not found' });
    return;
  }

  res.json(project);
});

router.patch('/:id', async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid payload', issues: parsed.error.flatten() });
    return;
  }

  const ownerId = getUserId(req);

  const existing = await prisma.project.findFirst({
    where: { id: req.params.id, ownerId }
  });

  if (!existing) {
    res.status(404).json({ message: 'Project not found' });
    return;
  }

  const project = await prisma.project.update({
    where: { id: req.params.id },
    data: parsed.data
  });

  res.json(project);
});

router.delete('/:id', async (req, res) => {
  const ownerId = getUserId(req);

  const existing = await prisma.project.findFirst({
    where: { id: req.params.id, ownerId }
  });

  if (!existing) {
    res.status(404).json({ message: 'Project not found' });
    return;
  }

  await prisma.project.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
