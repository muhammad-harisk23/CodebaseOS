import { Router } from 'express';
import { repositoryController } from '../controllers/repository.controller';

const router = Router();

router.post('/analyze', repositoryController.analyze);
router.post('/upload', repositoryController.uploadMiddleware, repositoryController.upload);
router.get('/', repositoryController.getAll);
router.get('/:repositoryId', repositoryController.getById);
router.delete('/:repositoryId', repositoryController.delete);

export default router;