import mongoose, { Schema, Document } from 'mongoose';

export interface IGitlabIssueDocument extends Document {
  repositoryId: string;
  gitlabIssueId?: number;
  title: string;
  description?: string;
  status: 'open' | 'closed';
  url?: string;
  labels?: string[];
  createdAt: Date;
}

const gitlabIssueSchema = new Schema<IGitlabIssueDocument>({
  repositoryId: { type: String, required: true, index: true },
  gitlabIssueId: { type: Number },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  url: { type: String },
  labels: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

gitlabIssueSchema.index({ repositoryId: 1, gitlabIssueId: 1 });

export const GitlabIssue = mongoose.model<IGitlabIssueDocument>('GitlabIssue', gitlabIssueSchema);