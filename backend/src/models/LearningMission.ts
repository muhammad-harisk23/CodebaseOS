import mongoose, { Schema, Document } from 'mongoose';

export interface ILearningMissionDocument extends Document {
  repositoryId: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  objective: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: Date;
}

const learningMissionSchema = new Schema<ILearningMissionDocument>({
  repositoryId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  estimatedTime: { type: String, required: true },
  objective: { type: String, required: true },
  status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

learningMissionSchema.index({ repositoryId: 1, status: 1 });

export const LearningMission = mongoose.model<ILearningMissionDocument>('LearningMission', learningMissionSchema);