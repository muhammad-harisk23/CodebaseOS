import { Router } from 'express';

const router = Router();

// POST /api/v1/interview/:repositoryId/start
router.post('/:repositoryId/start', (_req, res) => {
  res.status(501).json({
    success: false,
    error: { code: 'NOT_IMPLEMENTED', message: 'Interview start not implemented yet' },
  });
});

// POST /api/v1/interview/:interviewId/answer
router.post('/:interviewId/answer', (_req, res) => {
  res.status(501).json({
    success: false,
    error: { code: 'NOT_IMPLEMENTED', message: 'Interview answer submit not implemented yet' },
  });
});

// GET /api/v1/interview/:interviewId/results
router.get('/:interviewId/results', (_req, res) => {
  res.status(501).json({
    success: false,
    error: { code: 'NOT_IMPLEMENTED', message: 'Interview results not implemented yet' },
  });
});

export default router;
