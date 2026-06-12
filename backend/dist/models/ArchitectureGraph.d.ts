import mongoose, { Document } from 'mongoose';
export interface IArchitectureGraph extends Document {
    repositoryId: string;
    nodes: Array<{
        id: string;
        type: string;
        label?: string;
    }>;
    edges: Array<{
        source: string;
        target: string;
        type: string;
    }>;
    complexityScore: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ArchitectureGraph: mongoose.Model<IArchitectureGraph, {}, {}, {}, mongoose.Document<unknown, {}, IArchitectureGraph, {}, mongoose.DefaultSchemaOptions> & IArchitectureGraph & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IArchitectureGraph>;
//# sourceMappingURL=ArchitectureGraph.d.ts.map