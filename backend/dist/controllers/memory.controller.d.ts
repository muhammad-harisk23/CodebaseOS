import { Request, Response, NextFunction } from 'express';
export declare const memoryController: {
    getMemory(req: Request, res: Response, next: NextFunction): Promise<void>;
    getChunks(req: Request, res: Response, next: NextFunction): Promise<void>;
    getChunkDetails(req: Request, res: Response, next: NextFunction): Promise<void>;
    rebuildMemory(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getArchitectureGraph(req: Request, res: Response, next: NextFunction): Promise<void>;
    getArchitectureComplexity(req: Request, res: Response, next: NextFunction): Promise<void>;
    getKnowledgeGraph(req: Request, res: Response, next: NextFunction): Promise<void>;
    searchKnowledgeGraph(req: Request, res: Response, next: NextFunction): Promise<void>;
};
//# sourceMappingURL=memory.controller.d.ts.map