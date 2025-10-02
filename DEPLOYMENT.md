# 🚀 배포 가이드

이 문서는 학생 지출 분석 앱을 무료로 배포하는 방법을 안내합니다.

## 📌 배포 옵션 비교

| 방법 | 웹 앱 | API | 난이도 | 비용 | 추천도 |
|------|-------|-----|--------|------|--------|
| **Vercel + Render** | Vercel | Render | ⭐ 쉬움 | 무료 | ⭐⭐⭐⭐⭐ |
| **Vercel 올인원** | Vercel | Vercel Serverless | ⭐⭐ 보통 | 무료 | ⭐⭐⭐⭐ |
| **Railway** | Railway | Railway | ⭐ 쉬움 | $5/월 후 무료 | ⭐⭐⭐⭐ |
| **GitHub Pages** | GitHub | 불가능 | ⭐⭐⭐ 어려움 | 무료 | ⭐⭐ |

## 🎯 방법 1: Vercel + Render (가장 추천)

### 장점
- ✅ 완전 무료
- ✅ 자동 배포 (Git push만 하면 됨)
- ✅ HTTPS 자동 적용
- ✅ 무료 도메인 제공
- ✅ 설정 간단

---

### A. 웹 앱 배포 (Vercel)

#### 1단계: Vercel 계정 생성
1. https://vercel.com 접속
2. **Sign Up with GitHub** 클릭
3. 권한 허용

#### 2단계: 프로젝트 import
1. Vercel 대시보드에서 **Add New... → Project** 클릭
2. GitHub 저장소 선택: `student-spending-habit`
3. **Framework Preset**: Next.js 자동 감지
4. **Root Directory**: `apps/web` 입력
5. **Build Command**: 그대로 두기 (자동 설정됨)
6. **Output Directory**: 그대로 두기

#### 3단계: 환경 변수 설정
**Environment Variables** 섹션에서:
- **Name**: `NEXT_PUBLIC_API_URL`
- **Value**: `https://your-api-name.onrender.com` (나중에 Render에서 받을 URL)
- **Add** 클릭

#### 4단계: Deploy!
**Deploy** 버튼 클릭 → 약 2분 후 완료

배포 완료 후 URL:
```
https://your-app-name.vercel.app
```

---

### B. API 배포 (Render)

#### 1단계: Render 계정 생성
1. https://render.com 접속
2. **Sign Up with GitHub** 클릭

#### 2단계: Web Service 생성
1. 대시보드에서 **New +** → **Web Service** 클릭
2. GitHub 저장소 연결: `student-spending-habit`
3. **Connect** 클릭

#### 3단계: 서비스 설정
- **Name**: `student-spending-api` (원하는 이름)
- **Region**: Singapore (또는 가까운 지역)
- **Branch**: `main`
- **Root Directory**: `apps/api`
- **Runtime**: Python 3
- **Build Command**: 
  ```bash
  pip install -r requirements.txt
  ```
- **Start Command**:
  ```bash
  uvicorn main:app --host 0.0.0.0 --port $PORT
  ```

#### 4단계: 환경 변수 설정
**Environment Variables** 섹션에서:
- `CORS_ORIGINS`: `https://your-app-name.vercel.app`
- `ENVIRONMENT`: `production`
- `LOG_LEVEL`: `INFO`

#### 5단계: Create Web Service
**Create Web Service** 클릭 → 약 5분 후 완료

배포 완료 후 URL:
```
https://student-spending-api.onrender.com
```

#### 6단계: Vercel 환경 변수 업데이트
1. Vercel 대시보드로 돌아가기
2. 프로젝트 → Settings → Environment Variables
3. `NEXT_PUBLIC_API_URL` 값을 Render API URL로 업데이트
4. Redeploy 트리거

---

## 🎯 방법 2: GitHub Pages (정적 배포 - 제한적)

⚠️ **주의**: 이 방법은 API 없이 프론트엔드만 배포합니다. API는 별도 배포 필요.

### 1단계: Next.js를 정적 사이트로 변경

`apps/web/next.config.ts` 수정:
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/student-spending-habit", // 저장소 이름
};

export default nextConfig;
```

### 2단계: GitHub Actions 워크플로우 생성

`.github/workflows/deploy-pages.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      
      - uses: pnpm/action-setup@v3
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: |
          cd apps/web
          pnpm build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: apps/web/out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 3단계: GitHub Pages 활성화
1. GitHub 저장소 → Settings → Pages
2. **Source**: GitHub Actions 선택
3. Save

### 4단계: Push & Deploy
```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

배포 완료 후 URL:
```
https://yourusername.github.io/student-spending-habit/
```

⚠️ **제약사항**:
- Server-side rendering 불가
- API Routes 불가
- 이미지 최적화 불가
- 백엔드 별도 배포 필요

---

## 🎯 방법 3: Railway (올인원)

### 장점
- ✅ 웹 + API 한 번에 배포
- ✅ PostgreSQL 데이터베이스 포함 가능
- ✅ 매우 간단

### 단점
- ⚠️ $5 무료 크레딧 후 유료

### 배포 방법
1. https://railway.app 가입
2. **New Project** → **Deploy from GitHub repo**
3. 저장소 선택
4. Railway가 자동으로 감지 및 배포

---

## 📝 배포 후 체크리스트

### ✅ 웹 앱
- [ ] 사이트 접속 확인
- [ ] 환경 변수 확인 (API URL)
- [ ] 페이지 로딩 확인
- [ ] 브라우저 콘솔 에러 없음

### ✅ API
- [ ] Health check 확인: `https://your-api.com/health`
- [ ] API 문서 확인: `https://your-api.com/docs`
- [ ] CORS 설정 확인
- [ ] 로그 확인

### ✅ 연동
- [ ] 웹 앱에서 API 호출 성공
- [ ] 네트워크 탭에서 요청/응답 확인

---

## 🔧 트러블슈팅

### 웹 앱이 API에 연결되지 않음

**원인**: CORS 설정 또는 환경 변수 문제

**해결**:
1. API 환경 변수 확인:
   ```
   CORS_ORIGINS=https://your-vercel-app.vercel.app
   ```
2. 웹 앱 환경 변수 확인:
   ```
   NEXT_PUBLIC_API_URL=https://your-api.onrender.com
   ```
3. Redeploy

### Render에서 API가 시작되지 않음

**원인**: Python 버전 또는 의존성 문제

**해결**:
1. Render 로그 확인
2. Python 버전 확인 (3.11)
3. `requirements.txt` 확인

### Vercel 빌드 실패

**원인**: pnpm 워크스페이스 설정

**해결**:
1. Vercel 설정에서 Root Directory를 `apps/web`로 설정
2. Install Command: `pnpm install`

---

## 💡 추가 팁

### 커스텀 도메인 연결
- **Vercel**: Settings → Domains → Add Domain
- **Render**: Settings → Custom Domain

### 자동 배포 설정
- Git push만 하면 자동으로 배포됨
- PR 미리보기도 가능 (Vercel)

### 모니터링
- **Vercel**: Analytics 탭에서 확인
- **Render**: Metrics 탭에서 확인

---

## 📚 추가 리소스

- [Vercel 문서](https://vercel.com/docs)
- [Render 문서](https://render.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [FastAPI 배포 가이드](https://fastapi.tiangolo.com/deployment/)

---

**추천**: 우선 **Vercel + Render** 조합을 시도해보세요. 가장 간단하고 안정적입니다! 🚀

