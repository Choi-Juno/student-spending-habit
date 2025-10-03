"use client";

import { useState } from "react";
import Link from "next/link";

export default function ClassifyPage() {
  const [isClassifying, setIsClassifying] = useState(false);
  const [useLlm, setUseLlm] = useState(false);
  const [result, setResult] = useState<{
    total_classified: number;
    by_category: Record<string, number>;
    needs_review_count: number;
  } | null>(null);

  const handleClassify = async () => {
    setIsClassifying(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/classify?use_llm=${useLlm}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("분류 실패");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("분류 에러:", error);
      alert("분류에 실패했습니다.");
    } finally {
      setIsClassifying(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100 py-12 relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        {/* 헤더 */}
        <div className="mb-12">
          <Link href="/" className="group inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-6 font-medium transition-all">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            홈으로 돌아가기
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-4xl">🤖</span>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI 자동 분류
              </h1>
              <p className="text-lg text-gray-600 mt-2">미분류 거래를 자동으로 카테고리에 분류합니다</p>
            </div>
          </div>
        </div>

        {/* 분류 옵션 */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-gray-200/50">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>⚙️</span> 분류 옵션
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="use-llm"
                checked={useLlm}
                onChange={(e) => setUseLlm(e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="use-llm" className="text-gray-700 font-medium">
                LLM 백업 사용 (규칙으로 분류 안 되는 항목에 대해 AI 분류 시도)
              </label>
            </div>

            <button
              onClick={handleClassify}
              disabled={isClassifying}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isClassifying ? "분류 중..." : "🚀 분류 시작"}
            </button>
          </div>
        </div>

        {/* 분류 결과 */}
        {result && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-200/50">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 분류 결과</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                <p className="text-sm font-semibold uppercase tracking-wider opacity-90 mb-2">총 분류</p>
                <p className="text-5xl font-extrabold">{result.total_classified}건</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                <p className="text-sm font-semibold uppercase tracking-wider opacity-90 mb-2">카테고리 수</p>
                <p className="text-5xl font-extrabold">{Object.keys(result.by_category).length}개</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white">
                <p className="text-sm font-semibold uppercase tracking-wider opacity-90 mb-2">검토 필요</p>
                <p className="text-5xl font-extrabold">{result.needs_review_count}건</p>
              </div>
            </div>

            {/* 카테고리별 상세 */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">카테고리별 분류 건수</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(result.by_category)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, count]) => (
                    <div key={category} className="bg-white rounded-xl p-4 border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">{category}</p>
                      <p className="text-2xl font-bold text-gray-900">{count}건</p>
                    </div>
                  ))}
              </div>
            </div>

            {result.needs_review_count > 0 && (
              <div className="mt-6 bg-orange-50 rounded-2xl p-6 border border-orange-200">
                <p className="text-orange-800 flex items-center gap-2">
                  <span className="text-2xl">⚠️</span>
                  <span className="font-semibold">
                    {result.needs_review_count}건의 거래가 '기타'로 분류되었습니다. 수동 검토를 권장합니다.
                  </span>
                </p>
              </div>
            )}

            {result.total_classified > 0 && (
              <div className="mt-6 bg-green-50 rounded-2xl p-6 border border-green-200">
                <p className="text-green-800 flex items-center gap-2">
                  <span className="text-2xl">✅</span>
                  <span className="font-semibold">
                    분류가 완료되었습니다! 이제 통계 페이지에서 분석 결과를 확인하세요.
                  </span>
                </p>
                <Link href="/stats" className="mt-4 inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">
                  통계 보러가기 →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

