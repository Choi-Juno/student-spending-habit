"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#EF4444"];

export default function StatsPage() {
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });
  const [rangeType, setRangeType] = useState<"day" | "week" | "month">("month");
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<{
    total_amount: number;
    by_category: Record<string, number>;
    top_merchants: Array<{ merchant: string; amount: number }>;
    daily_totals: Array<{ date: string; amount: number }>;
  } | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(
        `${apiUrl}/api/aggregate?start=${dateRange.start}&end=${dateRange.end}&range=${rangeType}`
      );

      if (!response.ok) {
        throw new Error("통계 조회 실패");
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("통계 조회 에러:", error);
      alert("통계 조회에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const categoryData = stats
    ? Object.entries(stats.by_category).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-teal-100 py-12 relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* 헤더 */}
        <div className="mb-12">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-green-600 hover:text-green-800 mb-6 font-medium transition-all"
          >
            <svg
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            홈으로 돌아가기
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-4xl">📊</span>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                지출 통계
              </h1>
              <p className="text-lg text-gray-600 mt-2">카테고리별 지출 분석 및 트렌드</p>
            </div>
          </div>
        </div>

        {/* 날짜 범위 선택 */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-gray-200/50">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>📅</span> 조회 기간 설정
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">시작일</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">종료일</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">집계 범위</label>
              <select
                value={rangeType}
                onChange={(e) => setRangeType(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="day">일별</option>
                <option value="week">주별</option>
                <option value="month">월별</option>
              </select>
            </div>
          </div>

          <button
            onClick={fetchStats}
            disabled={isLoading}
            className="mt-6 w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50"
          >
            {isLoading ? "조회 중..." : "🔍 조회하기"}
          </button>
        </div>

        {stats && (
          <>
            {/* 요약 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white col-span-2">
                <p className="text-sm font-semibold uppercase tracking-wider opacity-90 mb-2">
                  총 지출
                </p>
                <p className="text-5xl font-extrabold">₩{stats.total_amount.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                <p className="text-sm font-semibold uppercase tracking-wider opacity-90 mb-2">
                  카테고리 수
                </p>
                <p className="text-5xl font-extrabold">{Object.keys(stats.by_category).length}개</p>
              </div>
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white">
                <p className="text-sm font-semibold uppercase tracking-wider opacity-90 mb-2">
                  거래 일수
                </p>
                <p className="text-5xl font-extrabold">{stats.daily_totals.length}일</p>
              </div>
            </div>

            {/* 차트 영역 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* 카테고리별 파이 차트 */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-200/50">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">카테고리별 지출</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `₩${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* 상위 가맹점 */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-200/50">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">상위 가맹점 TOP 3</h3>
                <div className="space-y-4">
                  {stats.top_merchants.map((merchant, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-600"}`}
                        >
                          {index + 1}
                        </div>
                        <span className="font-semibold text-gray-800">{merchant.merchant}</span>
                      </div>
                      <span className="text-xl font-bold text-purple-600">
                        ₩{merchant.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 일별 추이 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-200/50">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">일별 지출 추이</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.daily_totals}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `₩${(value / 1000).toFixed(0)}K`} />
                  <Tooltip formatter={(value: number) => `₩${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="amount" fill="#3B82F6" name="지출 금액" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
