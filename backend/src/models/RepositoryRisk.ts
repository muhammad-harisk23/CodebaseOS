import mongoose, { Schema, Document } from 'mongoose';

export interface IRepositoryRiskDocument extends Document {
  repositoryId: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedFiles: string[];
  recommendation: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: Date;
}

const repositoryRiskSchema = new Schema<IRepositoryRiskDocument>({
  repositoryId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true,
  },
  description: { type: String, required: true },
  affectedFiles: [{ type: String }],
  recommendation: { type: String, required: true },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved'],
    default: 'open',
  },
  createdAt: { type: Date, default: Date.now },
});

repositoryRiskSchema.index({ repositoryId: 1, severity: 1 });
repositoryRiskSchema.index({ repositoryId: 1, status: 1 });

export const RepositoryRisk = mongoose.model<IRepositoryRiskDocument>('RepositoryRisk', repositoryRiskSchema);