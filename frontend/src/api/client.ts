// ============================================================
// API Client — Centralized HTTP layer
// ============================================================

/**
 * Centralized API base URL.
 * Must be configured via NEXT_PUBLIC_API_URL
 */
const API_BASE_URL =
  (globalThis as any)?.process?.env?.NEXT_PUBLIC_API_URL ??
  'http://localhost:5000/api/v1';

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers as Record<string, string>),
    },
  };

  const response = await fetch(url, config);
  const json = await response.json();

  if (!response.ok || !json.success) {
    throw new ApiError(
      response.status,
      json.error?.code || 'UNKNOWN_ERROR',
      json.error?.message || json.message || 'An unexpected error occurred'
    );
  }

  return json.data as T;
}

export async function apiUpload<T>(
  endpoint: string,
  formData: FormData
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  const json = await response.json();

  if (!response.ok || !json.success) {
    throw new ApiError(
      response.status,
      json.error?.code || 'UPLOAD_ERROR',
      json.error?.message || json.message || 'Upload failed'
    );
  }

  return json.data as T;
}