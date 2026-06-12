import { Request, Response, NextFunction } from 'express';
export declare const documentationController: {
    generate(req: Request, res: Response, next: NextFunction): Promise<void>;
    get(req: Request, res: Response, next: NextFunction): Promise<void>;
    export(req: Request, res: Response, next: NextFunction): Promise<void>;
    generateMissions(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMissions(req: Request, res: Response, next: NextFunction): Promise<void>;
    completeMission(req: Request, res: Response, next: NextFunction): Promise<void>;
    startInterview(req: Request, res: Response, next: NextFunction): Promise<void>;
    submitAnswer(req: Request, res: Response, next: NextFunction): Promise<void>;
    getInterviewResults(req: Request, res: Response, next: NextFunction): Promise<void>;
    generateRescueReport(req: Request, res: Response, next: NextFunction): Promise<void>;
};
//# sourceMappingURL=documentation.controller.d.ts.map