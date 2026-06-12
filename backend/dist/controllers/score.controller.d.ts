import { Request, Response, NextFunction } from 'express';
export declare const scoreController: {
    getIntelligenceReport(req: Request, res: Response, next: NextFunction): Promise<void>;
    getFrameworks(req: Request, res: Response, next: NextFunction): Promise<void>;
    getDependencies(req: Request, res: Response, next: NextFunction): Promise<void>;
    getServices(req: Request, res: Response, next: NextFunction): Promise<void>;
    getApis(req: Request, res: Response, next: NextFunction): Promise<void>;
    getKnowledgeDebt(req: Request, res: Response, next: NextFunction): Promise<void>;
    getSurvivability(req: Request, res: Response, next: NextFunction): Promise<void>;
    getRecoverability(req: Request, res: Response, next: NextFunction): Promise<void>;
    getBusFactor(req: Request, res: Response, next: NextFunction): Promise<void>;
    getRiskDashboard(req: Request, res: Response, next: NextFunction): Promise<void>;
    getRisks(req: Request, res: Response, next: NextFunction): Promise<void>;
    getCriticalRisks(req: Request, res: Response, next: NextFunction): Promise<void>;
    getOwnershipMap(req: Request, res: Response, next: NextFunction): Promise<void>;
    getModuleOwnership(req: Request, res: Response, next: NextFunction): Promise<void>;
};
//# sourceMappingURL=score.controller.d.ts.map