"use client";

import { useState, useEffect } from "react";
import { SpendingChart } from "@/components/SpendingChart";
import { useSpendingStore } from "@/stores/spending-store";
import Link from "next/link";

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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <header className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-4">
            <span className="text-6xl">💰</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 leading-tight">
            학생 지출 분석
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            AI 기반 지출 분석으로 당신의 소비 패턴을 이해하고 개선하세요
          </p>
          
          {/* API 상태 표시 - 개선된 디자인 */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/50">
            <div className={`w-2 h-2 rounded-full ${apiStatus.includes("✅") ? "bg-green-500 animate-pulse" : "bg-yellow-500"}`}></div>
            <span className="text-sm text-gray-700">{apiStatus}</span>
          </div>
        </header>

        <div className="max-w-6xl mx-auto">
          {/* 기간 선택 - 개선된 탭 디자인 */}
          <div className="mb-10 flex justify-center">
            <div className="inline-flex bg-white/80 backdrop-blur-sm rounded-2xl p-1.5 shadow-lg border border-gray-200/50">
              {(["week", "month", "year"] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    selectedPeriod === period
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {period === "week" && "📅 주간"}
                  {period === "month" && "📆 월간"}
                  {period === "year" && "📊 연간"}
                </button>
              ))}
            </div>
          </div>

          {/* 차트 섹션 - 개선된 카드 디자인 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 mb-10 border border-gray-200/50 hover:shadow-3xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                카테고리별 지출 현황
              </h2>
            </div>
            <SpendingChart data={mockData} />
          </div>

          {/* 통계 카드 - 개선된 그라데이션 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="group bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl shadow-xl p-8 text-white hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider opacity-90">총 지출</h3>
                <span className="text-3xl">💵</span>
              </div>
              <p className="text-4xl font-extrabold mb-2">₩1,000,000</p>
              <div className="flex items-center gap-2">
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">전월 대비 -5% ↓</span>
              </div>
            </div>
            
            <div className="group bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-xl p-8 text-white hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider opacity-90">평균 일일 지출</h3>
                <span className="text-3xl">💳</span>
              </div>
              <p className="text-4xl font-extrabold mb-2">₩33,333</p>
              <div className="flex items-center gap-2">
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">목표 범위 내 ✓</span>
              </div>
            </div>
            
            <div className="group bg-gradient-to-br from-orange-500 to-pink-600 rounded-3xl shadow-xl p-8 text-white hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider opacity-90">가장 큰 지출</h3>
                <span className="text-3xl">🍔</span>
              </div>
              <p className="text-4xl font-extrabold mb-2">식비</p>
              <div className="flex items-center gap-2">
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">전체의 45%</span>
              </div>
            </div>
          </div>

          {/* 업로드 섹션 - 개선된 CTA 디자인 */}
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-3xl shadow-2xl p-10 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">📤</span>
                </div>
                <h2 className="text-3xl font-bold">지출 데이터 업로드</h2>
              </div>
              <p className="text-white/90 mb-8 text-lg">
                CSV 또는 JSONL 파일을 업로드하여 AI가 자동으로 분석하고 인사이트를 제공합니다
              </p>
              <Link href="/upload">
                <div className="group bg-white hover:bg-gray-50 rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 hover:scale-105 shadow-xl">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <svg
                        className="w-10 h-10 text-violet-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <p className="text-xl font-bold text-gray-800 mb-2">업로드 페이지로 이동</p>
                    <p className="text-sm text-gray-500">클릭하여 파일 업로드 시작 →</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
