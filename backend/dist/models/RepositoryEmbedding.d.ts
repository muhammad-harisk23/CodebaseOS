import mongoose, { Document } from 'mongoose';
export interface IRepositoryEmbedding extends Document {
    repositoryId: string;
    chunkId: string;
    embeddingProvider: 'gemini' | string;
    embeddingVector: number[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const RepositoryEmbedding: mongoose.Model<IRepositoryEmbedding, {}, {}, {}, mongoose.Document<unknown, {}, IRepositoryEmbedding, {}, mongoose.DefaultSchemaOptions> & IRepositoryEmbedding & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IRepositoryEmbedding>;
//# sourceMappingURL=RepositoryEmbedding.d.ts.map