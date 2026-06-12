"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
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
exports.default = router;
//# sourceMappingURL=interview.routes.js.map