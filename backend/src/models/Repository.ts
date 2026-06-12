import mongoose, { Schema, Document } from 'mongoose';

export interface IRepositoryDocument extends Document {
  name: string;
  description?: string;
  source: 'github' | 'gitlab' | 'zip';
  repositoryUrl?: string;
  branch?: string;

  // Intelligence metadata
  framework?: string;
  languages?: string[];
  packageManager?: 'npm' | 'yarn' | 'pnpm' | 'unknown' | string;
  dependencies?: string[];
  database?: string;
  authentication?: string;

  // Repository structure stats
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

const repositorySchema = new Schema<IRepositoryDocument>(
  {
    name: { type: String, required: true },
    description: { type: String },
    source: { type: String, enum: ['github', 'gitlab', 'zip'], required: true },
    repositoryUrl: { type: String },
    branch: { type: String, default: 'main' },
    framework: { type: String },
    languages: { type: [String], default: [] },
    packageManager: { type: String, default: 'unknown' },
    dependencies: { type: [String], default: [] },
    database: { type: String },
    authentication: { type: String },

    totalFiles: { type: Number, default: 0 },
    totalFolders: { type: Number, default: 0 },
    readmePresent: { type: Boolean, default: false },
    services: { type: Number, default: 0 },
    apis: { type: Number, default: 0 },
    modules: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'analyzing', 'analyzed', 'failed'],
      default: 'pending',
    },
    errorMessage: { type: String },
  },
  {
    timestamps: true,
  }
);

repositorySchema.index({ repositoryUrl: 1 });
repositorySchema.index({ name: 1 });
repositorySchema.index({ status: 1 });

export const Repository = mongoose.model<IRepositoryDocument>('Repository', repositorySchema);