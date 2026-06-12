import mongoose, { Schema, Document } from 'mongoose';

export interface IRepositoryDocumentDoc extends Document {
  repositoryId: string;
  type: 'README' | 'architecture' | 'api' | 'onboarding' | 'maintenance' | 'knowledge_transfer';
  content: string;
  generatedBy: 'agent' | 'user';
  createdAt: Date;
}

const repositoryDocumentSchema = new Schema<IRepositoryDocumentDoc>({
  repositoryId: { type: String, required: true, index: true },
  type: {
    type: String,
    enum: ['README', 'architecture', 'api', 'onboarding', 'maintenance', 'knowledge_transfer'],
    required: true,
  },
  content: { type: String, required: true },
  generatedBy: { type: String, enum: ['agent', 'user'], required: true },
  createdAt: { type: Date, default: Date.now },
});

export const RepositoryDocument = mongoose.model<IRepositoryDocumentDoc>('RepositoryDocument', repositoryDocumentSchema);