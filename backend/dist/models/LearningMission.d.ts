import mongoose, { Document } from 'mongoose';
export interface ILearningMissionDocument extends Document {
    repositoryId: string;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    estimatedTime: string;
    objective: string;
    status: 'pending' | 'in_progress' | 'completed';
    createdAt: Date;
}
export declare const LearningMission: mongoose.Model<ILearningMissionDocument, {}, {}, {}, mongoose.Document<unknown, {}, ILearningMissionDocument, {}, mongoose.DefaultSchemaOptions> & ILearningMissionDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ILearningMissionDocument>;
//# sourceMappingURL=LearningMission.d.ts.map