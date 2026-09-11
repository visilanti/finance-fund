/**
 * Unified ApiClient for Pengajuan Finance SaaS.
 * Automatically switches between 'mock' and 'real' API responses
 * based on process.env.NEXT_PUBLIC_API_MODE.
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export const API_MODE = process.env.NEXT_PUBLIC_API_MODE || "mock";

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit & { mockData?: T; delayMs?: number }
): Promise<ApiResponse<T>> {
  const delay = options?.delayMs ?? 300;

  if (API_MODE === "mock" && options?.mockData !== undefined) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    return {
      success: true,
      data: options.mockData,
      message: "Data berhasil dimuat (Mock Mode)",
      timestamp: new Date().toISOString(),
    };
  }

  // Real API Fetch Fallback
  try {
    const res = await fetch(`/api/backend-proxy${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    // Fallback to mock data if real call fails and mockData exists
    if (options?.mockData !== undefined) {
      console.warn(`[apiClient] Backend fallback to mock for ${endpoint}:`, err.message);
      return {
        success: true,
        data: options.mockData,
        message: "Fallback ke Mock Data",
        timestamp: new Date().toISOString(),
      };
    }
    throw err;
  }
}
