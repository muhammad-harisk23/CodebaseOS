import { Request, Response, NextFunction } from 'express';
export declare const agentController: {
    run(req: Request, res: Response, next: NextFunction): Promise<void>;
    getStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    getTimeline(req: Request, res: Response, next: NextFunction): Promise<void>;
    getRecommendations(req: Request, res: Response, next: NextFunction): Promise<void>;
};
//# sourceMappingURL=agent.controller.d.ts.map