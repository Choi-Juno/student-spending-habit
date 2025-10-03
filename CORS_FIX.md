# 🔧 CORS 설정 수정 가이드

## 현재 상황
- API URL: https://student-spending-habit.onrender.com
- Web URL: https://student-spending-habit-web.vercel.app/
- 문제: CORS 설정 안 됨

## ⚠️ 주의사항
Web URL 끝에 `/` 제거 필요:
- ❌ https://student-spending-habit-web.vercel.app/
- ✅ https://student-spending-habit-web.vercel.app

---

## 📝 단계별 수정 방법

### Step 1: Render 대시보드 접속
1. https://render.com 로그인
2. API 서비스 선택: `student-spending-habit`

### Step 2: Environment 탭 클릭
좌측 메뉴 또는 상단 탭에서 **Environment** 선택

### Step 3: CORS_ORIGINS 환경 변수 찾기

#### 경우 A: CORS_ORIGINS가 이미 있는 경우
1. `CORS_ORIGINS` 찾기
2. **Edit** 버튼 클릭
3. Value 수정:
   ```
   https://student-spending-habit-web.vercel.app
   ```
   (끝에 / 없음!)
4. **Save** 클릭

#### 경우 B: CORS_ORIGINS가 없는 경우
1. **Add Environment Variable** 클릭
2. Key 입력:
   ```
   CORS_ORIGINS
   ```
3. Value 입력:
   ```
   https://student-spending-habit-web.vercel.app
   ```
4. **Add** 클릭

### Step 4: 저장 및 재배포
1. **Save Changes** 클릭
2. 자동으로 재배포 시작됨
3. 약 3-5분 대기

### Step 5: 재배포 확인
Logs 탭에서 다음 메시지 확인:
```
==> Starting service...
2025-10-03 - main - INFO - 🚀 API 서버 시작
==> Your service is live 🎉
```

---

## ✅ 설정 확인

### 최종 환경 변수 (Render)
```
CORS_ORIGINS=https://student-spending-habit-web.vercel.app
ENVIRONMENT=production
LOG_LEVEL=INFO
```

### 최종 환경 변수 (Vercel)
```
NEXT_PUBLIC_API_URL=https://student-spending-habit.onrender.com
```

---

## 🧪 테스트
재배포 후 다시 테스트:
```bash
./quick-test.sh
```

---

## 🌐 브라우저 테스트
1. https://student-spending-habit-web.vercel.app 접속
2. F12 → Console 탭
3. CORS 에러가 없는지 확인
4. F12 → Network 탭
5. API 호출이 200 OK인지 확인

