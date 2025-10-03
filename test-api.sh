#!/bin/bash

# API 배포 테스트 스크립트
# 사용법: ./test-api.sh https://your-api.onrender.com

API_URL=${1:-"http://localhost:8000"}

echo "🧪 API 테스트 시작: $API_URL"
echo ""

# 1. Health Check
echo "1️⃣ Health Check..."
curl -s "$API_URL/health" | python3 -m json.tool
echo ""

# 2. Root Endpoint
echo "2️⃣ Root Endpoint..."
curl -s "$API_URL/" | python3 -m json.tool
echo ""

# 3. Classify Test
echo "3️⃣ Classify Test..."
curl -s -X POST "$API_URL/api/classify" \
  -H "Content-Type: application/json" \
  -d '{
    "transactions": [
      {
        "description": "스타벅스 커피",
        "amount": 5000,
        "date": "2024-01-15"
      },
      {
        "description": "지하철 교통카드",
        "amount": 1500,
        "date": "2024-01-15"
      }
    ]
  }' | python3 -m json.tool
echo ""

echo "✅ 테스트 완료!"

