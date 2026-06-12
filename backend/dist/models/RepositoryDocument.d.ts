import mongoose, { Document } from 'mongoose';
export interface IRepositoryDocumentDoc extends Document {
    repositoryId: string;
    type: 'README' | 'architecture' | 'api' | 'onboarding' | 'maintenance' | 'knowledge_transfer';
    content: string;
    generatedBy: 'agent' | 'user';
    createdAt: Date;
}
export declare const RepositoryDocument: mongoose.Model<IRepositoryDocumentDoc, {}, {}, {}, mongoose.Document<unknown, {}, IRepositoryDocumentDoc, {}, mongoose.DefaultSchemaOptions> & IRepositoryDocumentDoc & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IRepositoryDocumentDoc>;
//# sourceMappingURL=RepositoryDocument.d.ts.map