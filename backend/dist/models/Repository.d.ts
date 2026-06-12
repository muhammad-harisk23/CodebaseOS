import mongoose, { Document } from 'mongoose';
export interface IRepositoryDocument extends Document {
    name: string;
    description?: string;
    source: 'github' | 'gitlab' | 'zip';
    repositoryUrl?: string;
    branch?: string;
    framework?: string;
    languages?: string[];
    packageManager?: 'npm' | 'yarn' | 'pnpm' | 'unknown' | string;
    dependencies?: string[];
    database?: string;
    authentication?: string;
    totalFiles?: number;
    totalFolders?: number;
    readmePresent?: boolean;
    services?: number;
    apis?: number;
    modules?: number;
    status: 'pending' | 'analyzing' | 'analyzed' | 'failed';
    errorMessage?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Repository: mongoose.Model<IRepositoryDocument, {}, {}, {}, mongoose.Document<unknown, {}, IRepositoryDocument, {}, mongoose.DefaultSchemaOptions> & IRepositoryDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IRepositoryDocument>;
//# sourceMappingURL=Repository.d.ts.map