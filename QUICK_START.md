# 🚀 빠른 시작 가이드

이 가이드는 5분 안에 프로젝트를 실행하는 방법을 안내합니다.

## 방법 1: Docker Compose (가장 쉬움) ⭐

### 1단계: 저장소 클론

```bash
git clone <repository-url>
cd student-spending-habit
```

### 2단계: 환경 변수 설정 (선택사항)

Docker Compose는 기본값으로 동작합니다. 필요시 `.env` 파일을 생성하세요.

```bash
# .env 파일 생성 (선택사항)
cp env.example .env
```

### 3단계: 서비스 실행

```bash
docker-compose up --build
```

### 4단계: 브라우저로 접속

- **웹 앱**: http://localhost:3000
- **API 문서**: http://localhost:8000/docs

완료! 🎉

---

## 방법 2: 로컬 개발 환경

### 사전 요구사항

- Node.js 20+
- pnpm 8+
- Python 3.11+

### 1단계: 저장소 클론

```bash
git clone <repository-url>
cd student-spending-habit
```

### 2단계: 웹 앱 실행

**터미널 1** (웹 앱):

```bash
# 의존성 설치
pnpm install

# 환경 변수 설정
cd apps/web
cat > .env.local << EOL
NEXT_PUBLIC_API_URL=http://localhost:8000
EOL

# 개발 서버 실행
cd ../..
pnpm dev
```

웹 앱이 http://localhost:3000 에서 실행됩니다.

### 3단계: API 실행

**터미널 2** (API):

```bash
# API 디렉토리로 이동
cd apps/api

# 가상 환경 생성 (선택사항)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 환경 변수 설정
cat > .env << EOL
CORS_ORIGINS=http://localhost:3000
ENVIRONMENT=development
LOG_LEVEL=INFO
EOL

# API 서버 실행
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API가 http://localhost:8000 에서 실행됩니다.

### 4단계: 브라우저로 접속

- **웹 앱**: http://localhost:3000
- **API 문서**: http://localhost:8000/docs

완료! 🎉

---

## 테스트 실행

### 웹 앱 테스트

```bash
cd apps/web
pnpm test
```

### API 테스트

```bash
cd apps/api
pytest
```

---

## 자주 발생하는 문제

### pnpm 명령어가 없다고 나와요

```bash
npm install -g pnpm
```

### Python 가상 환경이 활성화되지 않아요

```bash
# macOS/Linux
cd apps/api
source venv/bin/activate

# Windows
cd apps/api
.\venv\Scripts\activate
```

### Docker 빌드가 실패해요

```bash
# 캐시 없이 다시 빌드
docker-compose build --no-cache
docker-compose up
```

### API 연결이 안 돼요

1. API가 실행 중인지 확인: http://localhost:8000/health
2. 웹 앱의 `.env.local` 파일 확인
3. CORS 설정 확인: `apps/api/.env`

---

## 다음 단계

- 📚 [README.md](./README.md)에서 상세 문서 확인
- 🏗️ [STRUCTURE.md](./STRUCTURE.md)에서 프로젝트 구조 확인
- 📖 API 문서 탐색: http://localhost:8000/docs

즐거운 개발 되세요! 🚀

