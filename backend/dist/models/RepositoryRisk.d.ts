import mongoose, { Document } from 'mongoose';
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
export declare const RepositoryRisk: mongoose.Model<IRepositoryRiskDocument, {}, {}, {}, mongoose.Document<unknown, {}, IRepositoryRiskDocument, {}, mongoose.DefaultSchemaOptions> & IRepositoryRiskDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IRepositoryRiskDocument>;
//# sourceMappingURL=RepositoryRisk.d.ts.map