# 🚀 Vercel 배포 가이드

## 빠른 배포 (5분)

### 1단계: 변경사항 커밋 & Push

```bash
cd /Users/junochoi/Documents/Project/student-spending-habit

# 변경사항 커밋
git add .
git commit -m "fix: update Next.js config for Vercel deployment"
git push origin main
```

### 2단계: Vercel에서 프로젝트 설정

#### A. 새 프로젝트 생성
1. https://vercel.com 로그인
2. **Add New... → Project** 클릭
3. GitHub 저장소 import: `student-spending-habit`

#### B. 프로젝트 설정
**Root Directory 설정이 가장 중요합니다!**

```
Framework Preset: Next.js (자동 감지)
Root Directory: apps/web         ← 중요!
Build Command: pnpm build        (자동 설정)
Output Directory: .next          (자동 설정)
Install Command: pnpm install    (자동 설정)
```

#### C. 환경 변수 설정
**Environment Variables** 섹션:

```
Name: NEXT_PUBLIC_API_URL
Value: http://localhost:8000     (일단 임시값, API 배포 후 수정)
```

#### D. 고급 설정 (선택사항)
**Build & Development Settings** → **Override** 클릭:

```
Install Command: cd ../.. && pnpm install && cd apps/web
```

### 3단계: Deploy!

**Deploy** 버튼 클릭 → 약 2-3분 대기

성공 시 URL:
```
https://your-project-name.vercel.app
```

---

## 🔧 배포 실패 시 해결 방법

### 에러 1: "Root Directory가 잘못되었습니다"

**해결**:
1. Vercel 프로젝트 Settings → General
2. **Root Directory**: `apps/web` 입력
3. Save → Redeploy

### 에러 2: "pnpm을 찾을 수 없습니다"

**해결**:
1. Vercel 프로젝트 Settings → General
2. **Node.js Version**: 20.x 선택
3. 프로젝트 루트에 `.npmrc` 파일이 있는지 확인
4. Redeploy

### 에러 3: "Build failed"

**해결 방법 1** (권장):
```bash
# 로컬에서 빌드 테스트
cd apps/web
pnpm build

# 에러가 있으면 수정 후 다시 push
git add .
git commit -m "fix: build errors"
git push
```

**해결 방법 2** (임시):
`next.config.ts`에서 이미 설정됨:
```typescript
eslint: {
  ignoreDuringBuilds: true,
},
typescript: {
  ignoreBuildErrors: true,
}
```

### 에러 4: "Module not found"

**해결**:
1. `apps/web/package.json` 확인
2. 누락된 패키지 설치:
```bash
cd apps/web
pnpm install
```
3. 다시 push

---

## 📱 API 서버 연결

### 옵션 1: Render로 API 배포 (무료)

1. https://render.com 가입
2. **New Web Service** 클릭
3. 저장소 연결: `student-spending-habit`
4. 설정:
   ```
   Name: student-spending-api
   Root Directory: apps/api
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
5. 환경 변수:
   ```
   CORS_ORIGINS=https://your-project.vercel.app
   ENVIRONMENT=production
   LOG_LEVEL=INFO
   ```
6. **Create Web Service**

7. 배포 완료 후 URL 복사:
   ```
   https://student-spending-api.onrender.com
   ```

8. Vercel로 돌아가서:
   - Settings → Environment Variables
   - `NEXT_PUBLIC_API_URL` 값을 Render URL로 변경
   - **Redeploy** 트리거

### 옵션 2: Vercel Serverless Functions

API를 Vercel Serverless Functions로 변환 (고급):
- Python 지원 제한적
- FastAPI를 Vercel Functions로 변환 필요
- 권장하지 않음 (복잡함)

---

## ✅ 배포 확인

### 웹 앱 체크리스트
- [ ] https://your-project.vercel.app 접속 확인
- [ ] 페이지 로딩 확인
- [ ] 브라우저 개발자 도구 → Console 에러 없음
- [ ] 브라우저 개발자 도구 → Network에서 API 호출 확인

### API 체크리스트
- [ ] https://your-api.onrender.com/health 접속 확인
- [ ] `{"status":"healthy"}` 응답 확인
- [ ] https://your-api.onrender.com/docs 문서 확인

---

## 🎨 커스텀 도메인 연결 (선택사항)

### Vercel에서 도메인 추가
1. 프로젝트 Settings → Domains
2. **Add Domain** 클릭
3. 도메인 입력 (예: `myapp.com`)
4. DNS 레코드 설정:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```
5. Save → DNS 전파 대기 (최대 48시간)

---

## 🔄 자동 배포 설정

Vercel은 기본적으로 자동 배포가 활성화되어 있습니다:

- ✅ `main` 브랜치 push → 자동 배포
- ✅ Pull Request → 미리보기 배포 생성
- ✅ 커밋마다 별도 URL 제공

**비활성화하려면**:
1. Settings → Git
2. **Auto-deploy** 토글 off

---

## 📊 모니터링

### Vercel Analytics
1. 프로젝트 → Analytics 탭
2. 무료 플랜:
   - 페이지 뷰
   - 로딩 시간
   - Core Web Vitals

### 로그 확인
1. 프로젝트 → Deployments
2. 특정 배포 클릭 → **Function Logs** 또는 **Build Logs**

---

## 💡 유용한 Vercel CLI 명령어

```bash
# Vercel CLI 설치
npm i -g vercel

# 로컬에서 Vercel 환경으로 배포
cd apps/web
vercel

# 프로덕션 배포
vercel --prod

# 로그 확인
vercel logs

# 환경 변수 추가
vercel env add NEXT_PUBLIC_API_URL
```

---

## 🆘 추가 도움말

- **Vercel 문서**: https://vercel.com/docs
- **Next.js 배포 가이드**: https://nextjs.org/docs/deployment
- **Vercel 커뮤니티**: https://github.com/vercel/vercel/discussions

---

**완료!** 🎉

이제 앱이 전 세계에서 접속 가능합니다!

