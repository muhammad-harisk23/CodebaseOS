import mongoose, { Document } from 'mongoose';
export interface IRepositoryChunkDocument extends Document {
    repositoryId: string;
    filePath: string;
    module?: string;
    summary?: string;
    chunkContent: string;
    relationships?: string[];
    createdAt: Date;
}
export declare const RepositoryChunk: mongoose.Model<IRepositoryChunkDocument, {}, {}, {}, mongoose.Document<unknown, {}, IRepositoryChunkDocument, {}, mongoose.DefaultSchemaOptions> & IRepositoryChunkDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IRepositoryChunkDocument>;
//# sourceMappingURL=RepositoryChunk.d.ts.map