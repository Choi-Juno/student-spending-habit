/**
 * Transaction 스키마 정의
 * 한국 학생 지출 거래 데이터 모델
 */

import { z } from "zod";

// Payment Type 열거형
export const PaymentTypeSchema = z.enum([
  "credit_card",
  "debit_card",
  "transport_card",
  "mobile_pay",
  "cash",
]);

export type PaymentType = z.infer<typeof PaymentTypeSchema>;

// Channel 열거형
export const ChannelSchema = z.enum(["offline", "online", "app", "kiosk"]);

export type Channel = z.infer<typeof ChannelSchema>;

// Transaction Zod 스키마
export const TransactionSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "날짜는 YYYY-MM-DD 형식이어야 합니다"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "시간은 HH:MM 형식이어야 합니다"),
  merchant: z.string().min(1, "가맹점명은 필수입니다"),
  memo: z.string().default(""),
  amount_krw: z.number().positive("금액은 양수여야 합니다"),
  payment_type: PaymentTypeSchema,
  city: z.string().min(1, "도시명은 필수입니다"),
  channel: ChannelSchema,
});

// TypeScript 타입
export type Transaction = z.infer<typeof TransactionSchema>;

// 배열 검증용 스키마
export const TransactionArraySchema = z.array(TransactionSchema);

// 업로드 요청 스키마
export const UploadRequestSchema = z.object({
  transactions: TransactionArraySchema,
});

export type UploadRequest = z.infer<typeof UploadRequestSchema>;

// 업로드 응답 스키마
export const UploadResponseSchema = z.object({
  accepted: z.number(),
  rejected: z.number(),
  reasons: z.array(
    z.object({
      row: z.number(),
      reason: z.string(),
    })
  ),
});

export type UploadResponse = z.infer<typeof UploadResponseSchema>;

// Validation 결과 타입
export interface ValidationResult {
  valid: Transaction[];
  invalid: Array<{
    row: number;
    data: unknown;
    errors: string[];
  }>;
}

/**
 * 트랜잭션 배열 검증 헬퍼 함수
 */
export function validateTransactions(data: unknown[]): ValidationResult {
  const valid: Transaction[] = [];
  const invalid: ValidationResult["invalid"] = [];

  data.forEach((item, index) => {
    const result = TransactionSchema.safeParse(item);
    if (result.success) {
      valid.push(result.data);
    } else {
      invalid.push({
        row: index + 1,
        data: item,
        errors: result.error.errors.map((err) => `${err.path.join(".")}: ${err.message}`),
      });
    }
  });

  return { valid, invalid };
}

