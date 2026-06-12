"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const memory_controller_1 = require("../controllers/memory.controller");
const router = (0, express_1.Router)();
router.get('/:repositoryId', memory_controller_1.memoryController.getMemory);
router.get('/:repositoryId/chunks', memory_controller_1.memoryController.getChunks);
router.get('/chunks/:chunkId', memory_controller_1.memoryController.getChunkDetails);
router.post('/:repositoryId/rebuild', memory_controller_1.memoryController.rebuildMemory);
exports.default = router;
//# sourceMappingURL=memory.routes.js.map