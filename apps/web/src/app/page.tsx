"use client";

import { useState, useEffect } from "react";
import { SpendingChart } from "@/components/SpendingChart";
import { useSpendingStore } from "@/stores/spending-store";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<string>("확인 중...");
  const { selectedPeriod, setSelectedPeriod } = useSpendingStore();

  const mockData = [
    { name: "식비", value: 450000 },
    { name: "교통비", value: 120000 },
    { name: "학용품", value: 80000 },
    { name: "생활용품", value: 150000 },
    { name: "기타", value: 200000 },
  ];

  // API Health Check - 페이지 로드 시 자동 호출
  useEffect(() => {
    const checkAPI = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        console.log("🔍 API 호출 시작:", apiUrl);

        const response = await fetch(`${apiUrl}/health`);
        const data = await response.json();

        console.log("✅ API 응답:", data);
        setApiStatus(data.status === "healthy" ? "연결됨 ✅" : "응답 이상");
      } catch (error) {
        console.error("❌ API 에러:", error);
        setApiStatus("연결 실패 ❌");
      }
    };

    checkAPI();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">💰 학생 지출 분석</h1>
          <p className="text-gray-600">당신의 소비 패턴을 분석하고 개선하세요</p>

          {/* API 상태 표시 */}
          <div className="mt-4 inline-block px-4 py-2 bg-white rounded-lg shadow-sm">
            <span className="text-sm text-gray-600">API 상태: </span>
            <span className="text-sm font-semibold">{apiStatus}</span>
          </div>
        </header>

        <div className="max-w-6xl mx-auto">
          {/* 기간 선택 */}
          <div className="mb-8 flex justify-center gap-4">
            {(["week", "month", "year"] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === period
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {period === "week" && "주간"}
                {period === "month" && "월간"}
                {period === "year" && "연간"}
              </button>
            ))}
          </div>

          {/* 차트 섹션 */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">카테고리별 지출 현황</h2>
            <SpendingChart data={mockData} />
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">총 지출</h3>
              <p className="text-3xl font-bold text-gray-800">₩1,000,000</p>
              <p className="text-sm text-green-600 mt-2">전월 대비 -5%</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">평균 일일 지출</h3>
              <p className="text-3xl font-bold text-gray-800">₩33,333</p>
              <p className="text-sm text-blue-600 mt-2">목표 범위 내</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">가장 큰 지출</h3>
              <p className="text-3xl font-bold text-gray-800">식비</p>
              <p className="text-sm text-orange-600 mt-2">45%</p>
            </div>
          </div>

          {/* 업로드 섹션 */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">지출 데이터 업로드</h2>
            <p className="text-gray-600 mb-6">
              CSV 또는 엑셀 파일을 업로드하여 지출을 자동으로 분석하세요
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors cursor-pointer">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
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
              <p className="mt-4 text-gray-600">파일을 드래그하거나 클릭하여 업로드</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
