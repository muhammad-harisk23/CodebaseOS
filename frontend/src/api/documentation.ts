// ============================================================
// Documentation API Module
// ============================================================
import { apiRequest } from './client';
import type { RepositoryDocument } from '@/types/api';

export const documentationApi = {
  generate: (repositoryId: string, type: RepositoryDocument['type']) =>
    apiRequest<RepositoryDocument>(`/documentation/${repositoryId}/generate`, {
      method: 'POST',
      body: JSON.stringify({ type }),
    }),

  get: (repositoryId: string) =>
    apiRequest<RepositoryDocument[]>(`/documentation/${repositoryId}`),

  getExport: (repositoryId: string) =>
    apiRequest<string>(`/documentation/${repositoryId}/export`),
};