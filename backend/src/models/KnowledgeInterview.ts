 import mongoose, { Schema, Document } from 'mongoose';

export interface IKnowledgeInterviewDocument extends Document {
  repositoryId: string;
  questions: {
    question: string;
    answer?: string;
    correctAnswer?: string;
    score?: number;
    category: 'authentication' | 'database' | 'architecture' | 'security';
  }[];
  authenticationScore: number;
  databaseScore: number;
  architectureScore: number;
  securityScore: number;
  overallScore: number;
  status: 'in_progress' | 'completed';
  createdAt: Date;
}

const knowledgeInterviewSchema = new Schema<IKnowledgeInterviewDocument>({
  repositoryId: { type: String, required: true, index: true },
  questions: [{
    question: { type: String, required: true },
    answer: { type: String },
    correctAnswer: { type: String },
    score: { type: Number },
    category: { type: String, enum: ['authentication', 'database', 'architecture', 'security'], required: true },
  }],
  authenticationScore: { type: Number, default: 0 },
  databaseScore: { type: Number, default: 0 },
  architectureScore: { type: Number, default: 0 },
  securityScore: { type: Number, default: 0 },
  overallScore: { type: Number, default: 0 },
  status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' },
  createdAt: { type: Date, default: Date.now },
});

export const KnowledgeInterview = mongoose.model<IKnowledgeInterviewDocument>('KnowledgeInterview', knowledgeInterviewSchema);