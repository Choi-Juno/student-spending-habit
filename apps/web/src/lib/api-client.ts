const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class APIError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = "APIError";
  }
}

export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Unknown error" }));
      throw new APIError(response.status, error.message || "Request failed", error);
    }

    return response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(0, "Network error", error);
  }
}

