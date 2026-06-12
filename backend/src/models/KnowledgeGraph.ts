import mongoose, { Schema, Document } from 'mongoose';

export interface IKnowledgeGraphDocument extends Document {
  repositoryId: string;
  nodes: { id: string; type: string; label: string; data?: Record<string, unknown> }[];
  edges: { source: string; target: string; type: string; label?: string }[];
  createdAt: Date;
}

const knowledgeGraphSchema = new Schema<IKnowledgeGraphDocument>({
  repositoryId: { type: String, required: true, index: true, unique: true },
  nodes: [{
    id: { type: String, required: true },
    type: { type: String, required: true },
    label: { type: String, required: true },
    data: { type: Schema.Types.Mixed },
  }],
  edges: [{
    source: { type: String, required: true },
    target: { type: String, required: true },
    type: { type: String, required: true },
    label: { type: String },
  }],
  createdAt: { type: Date, default: Date.now },
});

export const KnowledgeGraph = mongoose.model<IKnowledgeGraphDocument>('KnowledgeGraph', knowledgeGraphSchema);