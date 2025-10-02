/**
 * 공유 타입 정의
 * API와 Web 앱 간 공유되는 타입
 */

export interface Transaction {
  id?: string;
  description: string;
  amount: number;
  date: string;
  category?: string;
  confidence?: number;
}

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

export type Category =
  | "식비"
  | "교통비"
  | "학용품"
  | "생활용품"
  | "통신비"
  | "취미/여가"
  | "의료"
  | "기타";

export interface HealthResponse {
  status: string;
  service: string;
}

