import mongoose, { Document } from 'mongoose';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export interface IScoreBreakdown extends Record<string, unknown> {
}
export interface IScoreWithRisk extends Document {
    score: number;
    riskLevel: RiskLevel;
    breakdown: IScoreBreakdown;
    recommendations: string[];
}
export interface IRepositoryScoreDocument extends Document {
    repositoryId: string;
    knowledgeDebtScore: IScoreWithRisk;
    survivabilityScore: IScoreWithRisk;
    recoverabilityScore: IScoreWithRisk;
    busFactorScore: IScoreWithRisk;
    repositoryRiskScore: {
        score: number;
        riskLevel: RiskLevel;
        breakdown: IScoreBreakdown;
        recommendations: string[];
    };
    generatedAt: Date;
}
export declare const RepositoryScore: mongoose.Model<IRepositoryScoreDocument, {}, {}, {}, mongoose.Document<unknown, {}, IRepositoryScoreDocument, {}, mongoose.DefaultSchemaOptions> & IRepositoryScoreDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IRepositoryScoreDocument>;
//# sourceMappingURL=RepositoryScore.d.ts.map