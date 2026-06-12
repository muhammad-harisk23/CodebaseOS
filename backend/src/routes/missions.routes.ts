import { Router } from 'express';

const router = Router();

// POST /api/v1/missions/:repositoryId/generate
router.post('/:repositoryId/generate', (_req, res) => {
  res.status(501).json({
    success: false,
    error: { code: 'NOT_IMPLEMENTED', message: 'Learning mission generation not implemented yet' },
  });
});

// GET /api/v1/missions/:repositoryId
router.get('/:repositoryId', (_req, res) => {
  res.status(501).json({
    success: false,
    error: { code: 'NOT_IMPLEMENTED', message: 'Learning missions retrieval not implemented yet' },
  });
});

export default router;
