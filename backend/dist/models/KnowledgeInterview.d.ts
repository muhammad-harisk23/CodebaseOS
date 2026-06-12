import mongoose, { Document } from 'mongoose';
export interface IKnowledgeInterviewDocument extends Document {
    repositoryId: string;
    questions: {
        question: string;
        answer?: string;
        correctAnswer?: string;
        score?: number;
        category: 'authentication' | 'database' | 'architecture' | 'security';
    }[];
    authenticationScore: number;
    databaseScore: number;
    architectureScore: number;
    securityScore: number;
    overallScore: number;
    status: 'in_progress' | 'completed';
    createdAt: Date;
}
export declare const KnowledgeInterview: mongoose.Model<IKnowledgeInterviewDocument, {}, {}, {}, mongoose.Document<unknown, {}, IKnowledgeInterviewDocument, {}, mongoose.DefaultSchemaOptions> & IKnowledgeInterviewDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IKnowledgeInterviewDocument>;
//# sourceMappingURL=KnowledgeInterview.d.ts.map