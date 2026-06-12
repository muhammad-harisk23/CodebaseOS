// ============================================================
// Repository API Module
// ============================================================
import { apiRequest, apiUpload } from './client';
import type { Repository, IntelligenceReport } from '@/types/api';

export const repositoryApi = {
  analyze: (repositoryUrl: string, source: 'github' | 'gitlab') =>
    apiRequest<{ repositoryId: string; status: string }>('/repositories/analyze', {
      method: 'POST',
      body: JSON.stringify({ repositoryUrl, source }),
    }),

  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiUpload<{ repositoryId: string }>('/repositories/upload', formData);
  },

  get: (repositoryId: string) =>
    apiRequest<Repository>(`/repositories/${repositoryId}`),

  getAll: () =>
    apiRequest<Repository[]>('/repositories'),

  delete: (repositoryId: string) =>
    apiRequest<void>(`/repositories/${repositoryId}`, { method: 'DELETE' }),

  getIntelligence: (repositoryId: string) =>
    apiRequest<IntelligenceReport>(`/intelligence/${repositoryId}`),

  getFrameworks: (repositoryId: string) =>
    apiRequest<unknown>(`/intelligence/${repositoryId}/frameworks`),

  getDependencies: (repositoryId: string) =>
    apiRequest<unknown>(`/intelligence/${repositoryId}/dependencies`),

  getServices: (repositoryId: string) =>
    apiRequest<unknown>(`/intelligence/${repositoryId}/services`),

  getApis: (repositoryId: string) =>
    apiRequest<unknown>(`/intelligence/${repositoryId}/apis`),

  getMemory: (repositoryId: string) =>
    apiRequest<{ filesIndexed: number; chunks: number; apis: number; services: number; coverage: number }>(`/memory/${repositoryId}`),

  getChunks: (repositoryId: string) =>
    apiRequest<unknown[]>(`/memory/${repositoryId}/chunks`),

  rebuildMemory: (repositoryId: string) =>
    apiRequest<void>(`/memory/${repositoryId}/rebuild`, { method: 'POST' }),

  getArchitecture: (repositoryId: string) =>
    apiRequest<{ nodes: unknown[]; edges: unknown[] }>(`/architecture/${repositoryId}`),

  getArchitectureComplexity: (repositoryId: string) =>
    apiRequest<unknown>(`/architecture/${repositoryId}/complexity`),

  getKnowledgeGraph: (repositoryId: string) =>
    apiRequest<{ nodes: unknown[]; edges: unknown[] }>(`/knowledge-graph/${repositoryId}`),

  searchKnowledgeGraph: (repositoryId: string, query: string) =>
    apiRequest<unknown>(`/knowledge-graph/${repositoryId}/search?q=${encodeURIComponent(query)}`),
};