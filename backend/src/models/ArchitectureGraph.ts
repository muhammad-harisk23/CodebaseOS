import mongoose, { Document, Schema } from 'mongoose';

export interface IArchitectureGraph extends Document {
  repositoryId: string;
  nodes: Array<{ id: string; type: string; label?: string }>;
  edges: Array<{ source: string; target: string; type: string }>;
  complexityScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const architectureGraphSchema = new Schema<IArchitectureGraph>(
  {
    repositoryId: { type: String, required: true, index: true },
    nodes: { type: [Object], default: [] },
    edges: { type: [Object], default: [] },
    complexityScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

architectureGraphSchema.index({ repositoryId: 1 });

export const ArchitectureGraph = mongoose.model<IArchitectureGraph>(
  'ArchitectureGraph',
  architectureGraphSchema
);
