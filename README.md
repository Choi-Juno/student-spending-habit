# 💰 학생 지출 분석 (Student Spending Analytics)

학생들을 위한 지출 분석 및 인사이트 제공 플랫폼 MVP

## 📋 목차

- [프로젝트 구조](#프로젝트-구조)
- [기술 스택](#기술-스택)
- [시작하기](#시작하기)
- [개발 가이드](#개발-가이드)
- [API 문서](#api-문서)
- [테스팅](#테스팅)
- [배포](#배포)

## 🏗️ 프로젝트 구조

```
student-spending-habit/
├── apps/
│   ├── web/                    # Next.js 웹 애플리케이션
│   │   ├── src/
│   │   │   ├── app/           # App Router 페이지
│   │   │   ├── components/    # React 컴포넌트
│   │   │   ├── lib/           # 유틸리티 & 설정
│   │   │   ├── stores/        # Zustand 스토어
│   │   │   ├── types/         # TypeScript 타입
│   │   │   └── test/          # 테스트 설정
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── api/                    # FastAPI 백엔드
│       ├── routers/           # API 라우터
│       ├── models/            # Pydantic 모델
│       ├── services/          # 비즈니스 로직
│       ├── tests/             # pytest 테스트
│       ├── main.py            # FastAPI 앱
│       ├── Dockerfile
│       └── requirements.txt
│
├── packages/
│   └── shared/                 # 공유 타입/스키마
│       └── src/
│           └── index.ts
│
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI
│
├── docker-compose.yml
├── pnpm-workspace.yaml
└── README.md
```

## 🛠️ 기술 스택

### Frontend (Web)
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query (v5)
- **Charts**: Recharts
- **Testing**: Vitest + Testing Library

### Backend (API)
- **Framework**: FastAPI
- **Language**: Python 3.11
- **Server**: Uvicorn
- **Validation**: Pydantic
- **Data Processing**: Pandas
- **ML (Placeholder)**: scikit-learn
- **Testing**: pytest
- **Linting**: Ruff

### DevOps
- **Package Manager**: pnpm (monorepo)
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Node Version**: 20+

## 🚀 시작하기

### 사전 요구사항

다음 도구들이 설치되어 있어야 합니다:

- **Node.js**: 20.0.0 이상
- **pnpm**: 8.0.0 이상
- **Python**: 3.11 이상
- **Docker** & **Docker Compose**: (선택사항, Docker로 실행 시)

### 설치 방법

#### 1. 저장소 클론

```bash
git clone <repository-url>
cd student-spending-habit
```

#### 2. 환경 변수 설정

루트 디렉토리의 `env.example`을 참고하여 환경 변수를 설정합니다.

**웹 앱 환경 변수** (`apps/web/.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**API 환경 변수** (`apps/api/.env`):
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/spending_db
OPENAI_API_KEY=sk-your-openai-api-key-here
CORS_ORIGINS=http://localhost:3000
ENVIRONMENT=development
LOG_LEVEL=INFO
```

## 💻 개발 가이드

### 방법 1: Docker Compose로 실행 (권장)

가장 간단한 방법입니다. 모든 서비스를 한 번에 실행합니다.

```bash
# 서비스 시작 (빌드 포함)
docker-compose up --build

# 백그라운드 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 서비스 중지
docker-compose down
```

서비스 접속:
- **웹 앱**: http://localhost:3000
- **API**: http://localhost:8000
- **API 문서**: http://localhost:8000/docs

### 방법 2: 로컬 개발 환경

각 서비스를 개별적으로 실행합니다.

#### 2-1. 웹 앱 실행

```bash
# 1. 루트 디렉토리에서 의존성 설치
pnpm install

# 2. 웹 앱 개발 서버 실행
pnpm dev

# 또는 직접 실행
cd apps/web
pnpm dev
```

웹 앱이 http://localhost:3000 에서 실행됩니다.

#### 2-2. API 서버 실행

```bash
# 1. API 디렉토리로 이동
cd apps/api

# 2. 가상 환경 생성 (선택사항, 권장)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 3. 의존성 설치
pip install -r requirements.txt

# 4. API 서버 실행
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 또는 루트에서 실행
pnpm dev:api
```

API가 http://localhost:8000 에서 실행됩니다.

### 개발 명령어

#### 전체 프로젝트

```bash
# 모든 패키지 설치
pnpm install

# 웹 앱 실행
pnpm dev

# API 실행
pnpm dev:api

# 전체 린트
pnpm lint

# 전체 포맷
pnpm format

# 타입 체크
pnpm type-check

# 전체 테스트
pnpm test
```

#### 웹 앱 (apps/web)

```bash
cd apps/web

# 개발 서버 실행 (Turbopack)
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start

# 린트
pnpm lint

# 타입 체크
pnpm type-check

# 테스트 실행
pnpm test

# 테스트 (watch 모드)
pnpm test:watch
```

#### API (apps/api)

```bash
cd apps/api

# 개발 서버 실행
uvicorn main:app --reload

# 린트 (Ruff)
ruff check .

# 린트 자동 수정
ruff check . --fix

# 포맷 (Ruff)
ruff format .

# 테스트 실행
pytest

# 테스트 (상세 출력)
pytest -v

# 커버리지 포함 테스트
pytest --cov=. --cov-report=html
```

## 📚 API 문서

FastAPI는 자동으로 API 문서를 생성합니다.

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### 주요 엔드포인트

#### 1. 파일 업로드
```
POST /api/upload
Content-Type: multipart/form-data

파일: CSV 또는 Excel 파일
```

#### 2. 거래 분류
```
POST /api/classify
Content-Type: application/json

{
  "transactions": [
    {
      "description": "스타벅스 커피",
      "amount": 5000,
      "date": "2024-01-15"
    }
  ]
}
```

#### 3. 지출 집계
```
POST /api/aggregate
Content-Type: application/json

{
  "transactions": [...]
}
```

#### 4. 인사이트 생성
```
POST /api/insight
Content-Type: application/json

{
  "transactions": [...]
}
```

#### 5. 헬스 체크
```
GET /health

Response:
{
  "status": "healthy",
  "service": "student-spending-api"
}
```

## 🧪 테스팅

### 웹 앱 테스트

```bash
# 테스트 실행
cd apps/web
pnpm test

# Watch 모드
pnpm test:watch

# 커버리지
pnpm test -- --coverage
```

**샘플 테스트**: `apps/web/src/components/SpendingChart.test.tsx`

### API 테스트

```bash
# 테스트 실행
cd apps/api
pytest

# 특정 파일 테스트
pytest tests/test_classifier.py

# 상세 출력
pytest -v

# 커버리지
pytest --cov=. --cov-report=html
```

**샘플 테스트**: `apps/api/tests/test_classifier.py`

## 🔒 보안 고려사항

1. **PII 로깅 금지**: 개인정보는 로그에 기록하지 않습니다
2. **중앙 로거**: 구조화된 로깅 사용
3. **CORS 설정**: 환경 변수로 허용 오리진 관리
4. **헬스 체크**: `/health` 엔드포인트 제공
5. **환경 변수**: 민감한 정보는 환경 변수로 관리

## 📦 빌드 & 배포

### Docker 이미지 빌드

```bash
# 웹 앱 이미지 빌드
docker build -t student-spending-web:latest -f apps/web/Dockerfile .

# API 이미지 빌드
docker build -t student-spending-api:latest -f apps/api/Dockerfile apps/api
```

### 프로덕션 빌드

```bash
# 웹 앱
cd apps/web
pnpm build

# Next.js 프로덕션 서버 실행
pnpm start
```

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### 코드 스타일

- **TypeScript/JavaScript**: ESLint + Prettier
- **Python**: Ruff (자동 포맷 및 린트)
- **커밋 메시지**: Conventional Commits 권장

## 📝 라이선스

This project is licensed under the MIT License.

## 🆘 트러블슈팅

### 문제: pnpm 명령어가 작동하지 않음

```bash
# pnpm 설치
npm install -g pnpm

# 또는 corepack 사용 (Node 16.13+)
corepack enable
corepack prepare pnpm@latest --activate
```

### 문제: Docker 빌드 실패

```bash
# 캐시 없이 다시 빌드
docker-compose build --no-cache

# 이전 컨테이너 정리
docker-compose down -v
```

### 문제: API 연결 오류

1. API 서버가 실행 중인지 확인: http://localhost:8000/health
2. CORS 설정 확인: `apps/api/.env`의 `CORS_ORIGINS`
3. 웹 앱 환경 변수 확인: `apps/web/.env.local`의 `NEXT_PUBLIC_API_URL`

### 문제: Python 가상 환경 활성화

```bash
# macOS/Linux
cd apps/api
python -m venv venv
source venv/bin/activate

# Windows
cd apps/api
python -m venv venv
.\venv\Scripts\activate
```

## 📧 문의

프로젝트에 대한 문의사항이나 이슈는 GitHub Issues를 통해 제출해주세요.

---

Made with ❤️ for students

