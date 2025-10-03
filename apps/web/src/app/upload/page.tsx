"use client";

import { useState, useCallback } from "react";
import Papa from "papaparse";
import { Transaction, TransactionSchema, validateTransactions } from "@student-spending/shared";
import Link from "next/link";

interface ParsedData {
  valid: Transaction[];
  invalid: Array<{
    row: number;
    data: unknown;
    errors: string[];
  }>;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    accepted: number;
    rejected: number;
    reasons: Array<{ row: number; reason: string }>;
  } | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setUploadResult(null);

    // CSV 또는 JSONL 파싱
    if (selectedFile.name.endsWith(".csv")) {
      Papa.parse(selectedFile, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          const validated = validateTransactions(results.data);
          setParsedData(validated);
        },
        error: (error) => {
          console.error("CSV 파싱 에러:", error);
          alert("CSV 파일 파싱에 실패했습니다.");
        },
      });
    } else if (selectedFile.name.endsWith(".jsonl")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split("\n").filter((line) => line.trim());
        const jsonData = lines.map((line) => JSON.parse(line));
        const validated = validateTransactions(jsonData);
        setParsedData(validated);
      };
      reader.readAsText(selectedFile);
    } else {
      alert("CSV 또는 JSONL 파일만 지원됩니다.");
    }
  };

  const handleSendToAPI = async () => {
    if (!parsedData || parsedData.valid.length === 0) {
      alert("업로드할 유효한 데이터가 없습니다.");
      return;
    }

    setIsUploading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/transactions/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactions: parsedData.valid,
        }),
      });

      if (!response.ok) {
        throw new Error("API 요청 실패");
      }

      const result = await response.json();
      setUploadResult(result);
      console.log("업로드 성공:", result);
    } catch (error) {
      console.error("업로드 에러:", error);
      alert("서버 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* 헤더 */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← 홈으로 돌아가기
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📤 거래 데이터 업로드</h1>
          <p className="text-gray-600">CSV 또는 JSONL 파일을 업로드하여 거래 데이터를 가져오세요</p>
        </div>

        {/* 파일 업로드 영역 */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
            }`}
          >
            <input
              type="file"
              accept=".csv,.jsonl"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-lg text-gray-700 mb-2">
                {file ? file.name : "파일을 드래그하거나 클릭하여 선택"}
              </p>
              <p className="text-sm text-gray-500">CSV 또는 JSONL 파일 (최대 10MB)</p>
            </label>
          </div>

          {/* 파일 정보 */}
          {file && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>파일명:</strong> {file.name}
              </p>
              <p className="text-sm text-gray-600">
                <strong>크기:</strong> {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}
        </div>

        {/* 파싱 결과 */}
        {parsedData && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">파싱 결과</h2>

            {/* 통계 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600">유효한 행</p>
                <p className="text-3xl font-bold text-green-700">{parsedData.valid.length}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-red-600">무효한 행</p>
                <p className="text-3xl font-bold text-red-700">{parsedData.invalid.length}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">총 행 수</p>
                <p className="text-3xl font-bold text-blue-700">
                  {parsedData.valid.length + parsedData.invalid.length}
                </p>
              </div>
            </div>

            {/* 무효한 행 상세 */}
            {parsedData.invalid.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-red-700 mb-3">
                  무효한 행 ({parsedData.invalid.length}개)
                </h3>
                <div className="max-h-60 overflow-y-auto bg-red-50 p-4 rounded-lg">
                  {parsedData.invalid.slice(0, 10).map((item, index) => (
                    <div key={index} className="mb-3 pb-3 border-b border-red-200 last:border-0">
                      <p className="text-sm font-medium text-red-800">행 {item.row}:</p>
                      {item.errors.map((error, i) => (
                        <p key={i} className="text-sm text-red-600 ml-4">
                          • {error}
                        </p>
                      ))}
                    </div>
                  ))}
                  {parsedData.invalid.length > 10 && (
                    <p className="text-sm text-red-600 mt-2">
                      ... 외 {parsedData.invalid.length - 10}개
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* 미리보기 테이블 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                데이터 미리보기 (처음 50개)
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        날짜
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        시간
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        가맹점
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        금액
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        결제수단
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        도시
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {parsedData.valid.slice(0, 50).map((txn, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">{txn.date}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{txn.time}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{txn.merchant}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          ₩{txn.amount_krw.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{txn.payment_type}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{txn.city}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedData.valid.length > 50 && (
                <p className="text-sm text-gray-500 mt-4 text-center">
                  ... 외 {parsedData.valid.length - 50}개 행
                </p>
              )}
            </div>

            {/* API 전송 버튼 */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSendToAPI}
                disabled={parsedData.valid.length === 0 || isUploading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isUploading ? "업로드 중..." : `API로 전송 (${parsedData.valid.length}건)`}
              </button>
            </div>
          </div>
        )}

        {/* 업로드 결과 */}
        {uploadResult && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">업로드 결과</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600">성공</p>
                <p className="text-3xl font-bold text-green-700">{uploadResult.accepted}건</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-red-600">실패</p>
                <p className="text-3xl font-bold text-red-700">{uploadResult.rejected}건</p>
              </div>
            </div>

            {uploadResult.reasons.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-red-700 mb-3">실패 사유</h3>
                <div className="max-h-60 overflow-y-auto bg-red-50 p-4 rounded-lg">
                  {uploadResult.reasons.map((reason, index) => (
                    <div key={index} className="mb-2">
                      <p className="text-sm text-red-800">
                        <strong>행 {reason.row}:</strong> {reason.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploadResult.accepted > 0 && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-green-800">
                  ✅ {uploadResult.accepted}건의 거래가 성공적으로 저장되었습니다!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
