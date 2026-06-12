// ============================================================
// Knowledge Interview API Module
// ============================================================
import { apiRequest } from './client';
import type { KnowledgeInterview } from '@/types/api';

export const interviewApi = {
  start: (repositoryId: string) =>
    apiRequest<KnowledgeInterview>(`/interview/${repositoryId}/start`, { method: 'POST' }),

  submitAnswer: (interviewId: string, questionIndex: number, answer: string) =>
    apiRequest<KnowledgeInterview>(`/interview/${interviewId}/answer`, {
      method: 'POST',
      body: JSON.stringify({ questionIndex, answer }),
    }),

  getResults: (interviewId: string) =>
    apiRequest<KnowledgeInterview>(`/interview/${interviewId}/results`),
};