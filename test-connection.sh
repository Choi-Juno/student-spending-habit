#!/bin/bash

# 프론트엔드-API 연결 테스트
# 사용법: ./test-connection.sh https://your-api.onrender.com https://your-app.vercel.app

API_URL=${1:-"http://localhost:8000"}
WEB_URL=${2:-"http://localhost:3000"}

echo "🧪 프론트엔드-API 연결 테스트"
echo "================================"
echo "API URL: $API_URL"
echo "Web URL: $WEB_URL"
echo ""

# 1. API Health Check
echo "1️⃣ API Health Check..."
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/health")
if [ "$API_STATUS" = "200" ]; then
  echo "   ✅ API 정상 ($API_STATUS)"
else
  echo "   ❌ API 에러 ($API_STATUS)"
fi
echo ""

# 2. Web Health Check
echo "2️⃣ Web App Health Check..."
WEB_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$WEB_URL")
if [ "$WEB_STATUS" = "200" ]; then
  echo "   ✅ Web App 정상 ($WEB_STATUS)"
else
  echo "   ❌ Web App 에러 ($WEB_STATUS)"
fi
echo ""

# 3. CORS Test
echo "3️⃣ CORS 테스트..."
CORS_HEADER=$(curl -s -H "Origin: $WEB_URL" -I "$API_URL/health" | grep -i "access-control-allow-origin")
if [ -n "$CORS_HEADER" ]; then
  echo "   ✅ CORS 설정됨"
  echo "   $CORS_HEADER"
else
  echo "   ⚠️  CORS 헤더 없음 (확인 필요)"
fi
echo ""

# 4. API 기능 테스트
echo "4️⃣ API 분류 기능 테스트..."
CLASSIFY_RESPONSE=$(curl -s -X POST "$API_URL/api/classify" \
  -H "Content-Type: application/json" \
  -H "Origin: $WEB_URL" \
  -d '{
    "transactions": [
      {"description": "스타벅스", "amount": 5000, "date": "2024-01-15"}
    ]
  }')

if echo "$CLASSIFY_RESPONSE" | grep -q "classified"; then
  echo "   ✅ API 분류 기능 정상"
else
  echo "   ❌ API 분류 기능 에러"
fi
echo ""

echo "================================"
echo "✅ 테스트 완료!"
echo ""
echo "📝 다음 단계:"
echo "1. Vercel 환경 변수: NEXT_PUBLIC_API_URL=$API_URL"
echo "2. Render 환경 변수: CORS_ORIGINS=$WEB_URL"

