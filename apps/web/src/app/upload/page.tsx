"use client";

import { useState } from "react";
import { Transaction, validateTransactions } from "@student-spending/shared";
import Link from "next/link";

export default function UploadPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    accepted: number;
    rejected: number;
    reasons: Array<{ row: number; reason: string }>;
  } | null>(null);

  // 폼 상태
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
    time: new Date().toTimeString().slice(0, 5), // HH:MM
    merchant: "",
    memo: "",
    amount_krw: "",
    payment_type: "credit_card" as const,
    city: "서울",
    channel: "offline" as const,
  });

  const handleAddTransaction = () => {
    if (!formData.merchant || !formData.amount_krw) {
      alert("가맹점명과 금액은 필수입니다.");
      return;
    }

    const newTransaction: Transaction = {
      ...formData,
      amount_krw: parseFloat(formData.amount_krw),
    };

    setTransactions([...transactions, newTransaction]);

    // 폼 초기화 (일부 필드만)
    setFormData({
      ...formData,
      merchant: "",
      memo: "",
      amount_krw: "",
    });
  };

  const handleRemoveTransaction = (index: number) => {
    setTransactions(transactions.filter((_, i) => i !== index));
  };

  const handleSendToAPI = async () => {
    if (transactions.length === 0) {
      alert("등록된 거래가 없습니다.");
      return;
    }

    const validated = validateTransactions(transactions);
    if (validated.invalid.length > 0) {
      alert(`${validated.invalid.length}건의 유효하지 않은 거래가 있습니다.`);
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
          transactions: validated.valid,
        }),
      });

      if (!response.ok) {
        throw new Error("API 요청 실패");
      }

      const result = await response.json();
      setUploadResult(result);
      
      if (result.accepted > 0) {
        setTransactions([]); // 성공 시 목록 초기화
      }
    } catch (error) {
      console.error("업로드 에러:", error);
      alert("서버 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* 헤더 */}
        <div className="mb-12">
          <Link href="/" className="group inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-medium transition-all">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            홈으로 돌아가기
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-4xl">✏️</span>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                거래 내역 등록
              </h1>
              <p className="text-lg text-gray-600 mt-2">직접 입력하여 거래 데이터를 간편하게 등록하세요</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 입력 폼 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-200/50">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span>📝</span> 거래 정보 입력
            </h2>

            <div className="space-y-4">
              {/* 날짜 & 시간 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">날짜</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">시간</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* 가맹점 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  가맹점 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="예: 스타벅스 강남점"
                  value={formData.merchant}
                  onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              {/* 금액 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  금액 (원) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="예: 5000"
                  value={formData.amount_krw}
                  onChange={(e) => setFormData({ ...formData, amount_krw: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              {/* 결제 수단 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">결제 수단</label>
                <select
                  value={formData.payment_type}
                  onChange={(e) => setFormData({ ...formData, payment_type: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="credit_card">신용카드</option>
                  <option value="debit_card">체크카드</option>
                  <option value="transport_card">교통카드</option>
                  <option value="mobile_pay">모바일 페이</option>
                  <option value="cash">현금</option>
                </select>
              </div>

              {/* 도시 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">도시</label>
                <input
                  type="text"
                  placeholder="예: 서울"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              {/* 채널 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">거래 채널</label>
                <select
                  value={formData.channel}
                  onChange={(e) => setFormData({ ...formData, channel: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="offline">오프라인 매장</option>
                  <option value="online">온라인</option>
                  <option value="app">앱</option>
                  <option value="kiosk">키오스크</option>
                </select>
              </div>

              {/* 메모 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">메모 (선택)</label>
                <textarea
                  placeholder="추가 메모..."
                  value={formData.memo}
                  onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* 추가 버튼 */}
              <button
                onClick={handleAddTransaction}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
              >
                ➕ 거래 추가
              </button>
            </div>
          </div>

          {/* 등록된 거래 목록 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-200/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span>📋</span> 등록된 거래
              </h2>
              <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-semibold">
                {transactions.length}건
              </div>
            </div>

            {transactions.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-500">아직 등록된 거래가 없습니다</p>
                <p className="text-sm text-gray-400 mt-2">왼쪽 폼에서 거래를 추가하세요</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto pr-2">
                  {transactions.map((txn, index) => (
                    <div key={index} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200/50 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg font-bold text-gray-800">{txn.merchant}</span>
                            <span className="text-xs bg-purple-200 text-purple-700 px-2 py-1 rounded-full">
                              {txn.payment_type}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">💰</span>
                              <span className="text-lg font-bold text-purple-600">
                                ₩{txn.amount_krw.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                              <span>📅 {txn.date} {txn.time}</span>
                              <span>📍 {txn.city}</span>
                              <span>🏪 {txn.channel}</span>
                            </div>
                            {txn.memo && (
                              <div className="text-xs text-gray-500 italic">💬 {txn.memo}</div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveTransaction(index)}
                          className="ml-4 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSendToAPI}
                  disabled={isUploading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isUploading ? "업로드 중..." : `🚀 ${transactions.length}건 서버에 전송`}
                </button>
              </>
            )}
          </div>
        </div>

        {/* 업로드 결과 */}
        {uploadResult && (
          <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-200/50">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 업로드 결과</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                <p className="text-sm font-semibold uppercase tracking-wider opacity-90 mb-2">성공</p>
                <p className="text-5xl font-extrabold">{uploadResult.accepted}건</p>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white">
                <p className="text-sm font-semibold uppercase tracking-wider opacity-90 mb-2">실패</p>
                <p className="text-5xl font-extrabold">{uploadResult.rejected}건</p>
              </div>
            </div>

            {uploadResult.reasons.length > 0 && (
              <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                <h3 className="text-lg font-semibold text-red-800 mb-4">❌ 실패 사유</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {uploadResult.reasons.map((reason, index) => (
                    <div key={index} className="text-sm text-red-700">
                      <strong>행 {reason.row}:</strong> {reason.reason}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploadResult.accepted > 0 && (
              <div className="mt-6 bg-green-50 rounded-2xl p-6 border border-green-200">
                <p className="text-green-800 flex items-center gap-2">
                  <span className="text-2xl">✅</span>
                  <span className="font-semibold">
                    {uploadResult.accepted}건의 거래가 성공적으로 저장되었습니다!
                  </span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
