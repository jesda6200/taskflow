import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { getUserId } from '../middleware/auth';

const router = Router();

const createSchema = z.object({
  body: z.string().min(1)
});

const updateSchema = createSchema.partial();

router.post('/tasks/:taskId/comments', async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid payload', issues: parsed.error.flatten() });
    return;
  }

  const userId = getUserId(req);

  const task = await prisma.task.findFirst({
    where: {
      id: req.params.taskId,
      project: {
        ownerId: userId
      }
    }
  });

  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }

  const comment = await prisma.comment.create({
    data: {
      body: parsed.data.body,
      taskId: req.params.taskId,
      authorId: userId
    }
  });

  res.status(201).json(comment);
});

router.get('/tasks/:taskId/comments', async (req, res) => {
  const userId = getUserId(req);

  const task = await prisma.task.findFirst({
    where: {
      id: req.params.taskId,
      project: {
        ownerId: userId
      }
    }
  });

  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }

  const comments = await prisma.comment.findMany({
    where: { taskId: req.params.taskId },
    orderBy: { createdAt: 'asc' }
  });

  res.json(comments);
});

router.patch('/comments/:id', async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid payload', issues: parsed.error.flatten() });
    return;
  }

  const userId = getUserId(req);
  const existing = await prisma.comment.findFirst({
    where: {
      id: req.params.id,
      task: {
        project: {
          ownerId: userId
        }
      }
    }
  });

  if (!existing) {
    res.status(404).json({ message: 'Comment not found' });
    return;
  }

  const comment = await prisma.comment.update({
    where: { id: req.params.id },
    data: parsed.data
  });

  res.json(comment);
});

router.delete('/comments/:id', async (req, res) => {
  const userId = getUserId(req);
  const existing = await prisma.comment.findFirst({
    where: {
      id: req.params.id,
      task: {
        project: {
          ownerId: userId
        }
      }
    }
  });

  if (!existing) {
    res.status(404).json({ message: 'Comment not found' });
    return;
  }

  await prisma.comment.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
