#!/bin/bash

echo "🧪 빠른 연결 테스트"
echo "===================="
echo ""
echo "Render API URL을 입력하세요:"
read API_URL

echo ""
echo "Vercel 웹 URL을 입력하세요:"
read WEB_URL

echo ""
echo "테스트 시작..."
echo ""

# 1. API Health Check
echo "1️⃣ API 상태 확인..."
API_RESPONSE=$(curl -s "$API_URL/health")
if echo "$API_RESPONSE" | grep -q "healthy"; then
  echo "   ✅ API 정상 작동!"
  echo "   응답: $API_RESPONSE"
else
  echo "   ❌ API 응답 없음"
  echo "   응답: $API_RESPONSE"
fi
echo ""

# 2. Web App Check
echo "2️⃣ 웹 앱 상태 확인..."
WEB_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$WEB_URL")
if [ "$WEB_STATUS" = "200" ]; then
  echo "   ✅ 웹 앱 정상 ($WEB_STATUS)"
else
  echo "   ⚠️  웹 앱 상태: $WEB_STATUS"
fi
echo ""

# 3. CORS Check (실제 요청으로 테스트)
echo "3️⃣ CORS 설정 확인..."
CORS_TEST=$(curl -s -H "Origin: $WEB_URL" -I "$API_URL/health")
if echo "$CORS_TEST" | grep -qi "access-control-allow-origin"; then
  echo "   ✅ CORS 설정됨"
  echo "$CORS_TEST" | grep -i "access-control"
else
  echo "   ⚠️  CORS 헤더 없음 (하지만 실제로는 작동할 수 있음)"
  echo "   브라우저에서 확인하세요!"
fi
echo ""

# 4. API 기능 테스트
echo "4️⃣ API 분류 기능 테스트..."
CLASSIFY_RESULT=$(curl -s -X POST "$API_URL/api/classify" \
  -H "Content-Type: application/json" \
  -H "Origin: $WEB_URL" \
  -d '{
    "transactions": [
      {
        "description": "스타벅스 커피",
        "amount": 5000,
        "date": "2024-01-15"
      }
    ]
  }')

if echo "$CLASSIFY_RESULT" | grep -q "식비"; then
  echo "   ✅ API 분류 기능 정상!"
  echo "   결과: 스타벅스 → 식비 카테고리"
else
  echo "   ❌ API 분류 기능 에러"
  echo "   응답: $CLASSIFY_RESULT"
fi
echo ""

echo "===================="
echo "✅ 테스트 완료!"
echo ""
echo "📝 요약:"
echo "- API URL: $API_URL"
echo "- Web URL: $WEB_URL"
echo ""
echo "🌐 브라우저로 확인:"
echo "1. $WEB_URL 접속"
echo "2. F12 → Network 탭 확인"
echo "3. 페이지 새로고침"
echo "4. API 호출 확인"

