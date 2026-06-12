import { apiRequest } from './client';

export interface HealthStatus {
  status: 'up' | 'down';
}

export interface HealthResponse {
  success: boolean;
  data: HealthStatus;
}

export const healthApi = {
  get: () => apiRequest<HealthStatus>('/health'),

  gemini: () => apiRequest<HealthStatus>('/health/gemini'),

  gitlab: () => apiRequest<HealthStatus>('/health/gitlab'),

  mongodb: () => apiRequest<HealthStatus>('/health/mongodb'),
};
