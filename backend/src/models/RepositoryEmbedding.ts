import mongoose, { Document, Schema } from 'mongoose';

export interface IRepositoryEmbedding extends Document {
  repositoryId: string;
  chunkId: string;
  embeddingProvider: 'gemini' | string;
  embeddingVector: number[];
  createdAt: Date;
  updatedAt: Date;
}

const repositoryEmbeddingSchema = new Schema<IRepositoryEmbedding>(
  {
    repositoryId: { type: String, required: true, index: true },
    chunkId: { type: String, required: true, index: true },
    embeddingProvider: { type: String, required: true },
    embeddingVector: { type: [Number], default: [] },
  },
  { timestamps: true }
);

repositoryEmbeddingSchema.index({ repositoryId: 1, chunkId: 1 });

export const RepositoryEmbedding = mongoose.model<IRepositoryEmbedding>(
  'RepositoryEmbedding',
  repositoryEmbeddingSchema
);
