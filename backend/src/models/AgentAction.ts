import mongoose, { Schema, Document } from 'mongoose';

export interface IAgentActionDocument extends Document {
  repositoryId: string;
  actionType: 'create_documentation' | 'create_gitlab_issue' | 'create_learning_mission' | 'generate_report' | 'transfer_knowledge';
  reasoning: string;
  confidence: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: string;
  createdAt: Date;
}

const agentActionSchema = new Schema<IAgentActionDocument>({
  repositoryId: { type: String, required: true, index: true },
  actionType: {
    type: String,
    enum: ['create_documentation', 'create_gitlab_issue', 'create_learning_mission', 'generate_report', 'transfer_knowledge'],
    required: true,
  },
  reasoning: { type: String, required: true },
  confidence: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'failed'],
    default: 'pending',
  },
  result: { type: String },
  createdAt: { type: Date, default: Date.now },
});

agentActionSchema.index({ repositoryId: 1, actionType: 1 });
agentActionSchema.index({ repositoryId: 1, status: 1 });

export const AgentAction = mongoose.model<IAgentActionDocument>('AgentAction', agentActionSchema);