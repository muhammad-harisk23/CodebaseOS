import mongoose, { Schema, Document } from 'mongoose';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface IScoreBreakdown extends Record<string, unknown> {}

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
    score: number; // 0-100 aggregate risk severity index
    riskLevel: RiskLevel;
    breakdown: IScoreBreakdown;
    recommendations: string[];
  };

  generatedAt: Date;
}

const scoreWithRiskSchema = new Schema<IScoreWithRisk>(
  {
    score: { type: Number, required: true },
    riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], required: true },
    breakdown: { type: Schema.Types.Mixed, required: true },
    recommendations: { type: [String], required: true, default: [] },
  },
  { _id: false }
);

const repositoryScoreSchema = new Schema<IRepositoryScoreDocument>(
  {
    repositoryId: { type: String, required: true, unique: true, index: true },

    knowledgeDebtScore: { type: scoreWithRiskSchema, required: true },
    survivabilityScore: { type: scoreWithRiskSchema, required: true },
    recoverabilityScore: { type: scoreWithRiskSchema, required: true },
    busFactorScore: { type: scoreWithRiskSchema, required: true },

    repositoryRiskScore: {
      score: { type: Number, required: true },
      riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], required: true },
      breakdown: { type: Schema.Types.Mixed, required: true },
      recommendations: { type: [String], required: true, default: [] },
    },

    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export const RepositoryScore = mongoose.model<IRepositoryScoreDocument>('RepositoryScore', repositoryScoreSchema);
