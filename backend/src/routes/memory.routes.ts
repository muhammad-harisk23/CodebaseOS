import { Router } from 'express';
import { memoryController } from '../controllers/memory.controller';

const router = Router();

router.get('/:repositoryId', memoryController.getMemory);
router.get('/:repositoryId/chunks', memoryController.getChunks);
router.get('/chunks/:chunkId', memoryController.getChunkDetails);
router.post('/:repositoryId/rebuild', memoryController.rebuildMemory);

export default router;