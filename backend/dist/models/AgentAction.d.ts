import mongoose, { Document } from 'mongoose';
export interface IAgentActionDocument extends Document {
    repositoryId: string;
    actionType: 'create_documentation' | 'create_gitlab_issue' | 'create_learning_mission' | 'generate_report' | 'transfer_knowledge';
    reasoning: string;
    confidence: number;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    result?: string;
    createdAt: Date;
}
export declare const AgentAction: mongoose.Model<IAgentActionDocument, {}, {}, {}, mongoose.Document<unknown, {}, IAgentActionDocument, {}, mongoose.DefaultSchemaOptions> & IAgentActionDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IAgentActionDocument>;
//# sourceMappingURL=AgentAction.d.ts.map