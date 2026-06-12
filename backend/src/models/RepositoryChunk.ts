import mongoose, { Schema, Document } from 'mongoose';

export interface IRepositoryChunkDocument extends Document {
  repositoryId: string;
  filePath: string;
  module?: string;
  summary?: string;
  chunkContent: string;
  relationships?: string[];
  createdAt: Date;
}

const repositoryChunkSchema = new Schema<IRepositoryChunkDocument>({
  repositoryId: { type: String, required: true, index: true },
  filePath: { type: String, required: true },
  module: { type: String },
  summary: { type: String },
  chunkContent: { type: String, required: true },
  relationships: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

repositoryChunkSchema.index({ repositoryId: 1, module: 1 });
repositoryChunkSchema.index({ repositoryId: 1, filePath: 1 });

export const RepositoryChunk = mongoose.model<IRepositoryChunkDocument>('RepositoryChunk', repositoryChunkSchema);