import mongoose, { Document } from 'mongoose';
export interface IKnowledgeGraphDocument extends Document {
    repositoryId: string;
    nodes: {
        id: string;
        type: string;
        label: string;
        data?: Record<string, unknown>;
    }[];
    edges: {
        source: string;
        target: string;
        type: string;
        label?: string;
    }[];
    createdAt: Date;
}
export declare const KnowledgeGraph: mongoose.Model<IKnowledgeGraphDocument, {}, {}, {}, mongoose.Document<unknown, {}, IKnowledgeGraphDocument, {}, mongoose.DefaultSchemaOptions> & IKnowledgeGraphDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IKnowledgeGraphDocument>;
//# sourceMappingURL=KnowledgeGraph.d.ts.map