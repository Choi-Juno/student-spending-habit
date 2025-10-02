export interface UploadResponse {
  message: string;
  processed_count: number;
}

export interface ClassifyRequest {
  transactions: Array<{
    description: string;
    amount: number;
    date: string;
  }>;
}

export interface ClassifyResponse {
  classified: Array<{
    description: string;
    amount: number;
    date: string;
    category: string;
    confidence: number;
  }>;
}

export interface AggregateResponse {
  period: string;
  total_spending: number;
  by_category: Record<string, number>;
}

export interface InsightResponse {
  insights: string[];
  recommendations: string[];
  spending_trend: "increasing" | "decreasing" | "stable";
}

