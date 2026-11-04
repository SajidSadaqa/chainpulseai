// API Environment Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.chainpulse.ai/v1';

export interface APIResponse<T> {
  data: T | null;
  error: string | null;
}

// Normalized API Wrapper
export async function fetchMockAPI(shouldFail: boolean = false): Promise<APIResponse<{ status: string; timestamp: string }>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (shouldFail) {
        resolve({ data: null, error: 'تعذر الاتصال بخادم Mahmoud (API Error 500)' });
      } else {
        resolve({
          data: { status: 'Operational', timestamp: new Date().toISOString() },
          error: null,
        });
      }
    }, 800);
  });
}