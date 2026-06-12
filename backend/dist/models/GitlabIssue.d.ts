import mongoose, { Document } from 'mongoose';
export interface IGitlabIssueDocument extends Document {
    repositoryId: string;
    gitlabIssueId?: number;
    title: string;
    description?: string;
    status: 'open' | 'closed';
    url?: string;
    labels?: string[];
    createdAt: Date;
}
export declare const GitlabIssue: mongoose.Model<IGitlabIssueDocument, {}, {}, {}, mongoose.Document<unknown, {}, IGitlabIssueDocument, {}, mongoose.DefaultSchemaOptions> & IGitlabIssueDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IGitlabIssueDocument>;
//# sourceMappingURL=GitlabIssue.d.ts.map