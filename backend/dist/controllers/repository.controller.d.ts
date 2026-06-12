import { Request, Response, NextFunction } from 'express';
export declare const repositoryController: {
    uploadMiddleware: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * POST /api/v1/repositories/analyze
     */
    analyze(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/repositories/upload
     */
    upload(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/repositories/:repositoryId
     */
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/repositories
     */
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * DELETE /api/v1/repositories/:repositoryId
     */
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
};
//# sourceMappingURL=repository.controller.d.ts.map