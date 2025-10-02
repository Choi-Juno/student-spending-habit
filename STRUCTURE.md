# 프로젝트 구조

```
student-spending-habit/
├── .github/
│   └── workflows/
│       └── ci.yml                      # GitHub Actions CI 워크플로우
│
├── apps/
│   ├── web/                            # Next.js 웹 애플리케이션
│   │   ├── public/                     # 정적 파일
│   │   ├── src/
│   │   │   ├── app/                    # Next.js App Router
│   │   │   │   ├── layout.tsx          # 루트 레이아웃
│   │   │   │   ├── page.tsx            # 메인 페이지
│   │   │   │   └── globals.css         # 글로벌 스타일
│   │   │   ├── components/             # React 컴포넌트
│   │   │   │   ├── SpendingChart.tsx   # 지출 차트 컴포넌트
│   │   │   │   └── SpendingChart.test.tsx  # 차트 테스트
│   │   │   ├── lib/                    # 라이브러리 & 유틸리티
│   │   │   │   ├── react-query.tsx     # React Query 설정
│   │   │   │   └── api-client.ts       # API 클라이언트
│   │   │   ├── stores/                 # Zustand 스토어
│   │   │   │   └── spending-store.ts   # 지출 데이터 스토어
│   │   │   ├── types/                  # TypeScript 타입 정의
│   │   │   │   └── api.ts              # API 타입
│   │   │   ├── test/                   # 테스트 설정
│   │   │   │   └── setup.ts            # Vitest 설정
│   │   │   └── hooks/                  # 커스텀 훅 (추가 가능)
│   │   ├── Dockerfile                  # 웹 앱 Docker 이미지
│   │   ├── next.config.ts              # Next.js 설정
│   │   ├── tailwind.config.js          # Tailwind CSS 설정
│   │   ├── tsconfig.json               # TypeScript 설정
│   │   ├── vitest.config.ts            # Vitest 설정
│   │   ├── package.json                # 웹 앱 의존성
│   │   └── env.local.example           # 환경 변수 예시
│   │
│   └── api/                            # FastAPI 백엔드
│       ├── routers/                    # API 라우터
│       │   ├── __init__.py
│       │   ├── upload.py               # 파일 업로드 라우터
│       │   ├── classify.py             # 거래 분류 라우터
│       │   ├── aggregate.py            # 지출 집계 라우터
│       │   └── insight.py              # 인사이트 생성 라우터
│       ├── models/                     # Pydantic 모델
│       │   ├── __init__.py
│       │   └── schemas.py              # API 스키마 정의
│       ├── services/                   # 비즈니스 로직
│       │   ├── __init__.py
│       │   ├── classifier.py           # 거래 분류 서비스
│       │   ├── aggregator.py           # 지출 집계 서비스
│       │   └── insight_generator.py    # 인사이트 생성 서비스
│       ├── tests/                      # pytest 테스트
│       │   ├── __init__.py
│       │   └── test_classifier.py      # 분류기 테스트
│       ├── main.py                     # FastAPI 메인 앱
│       ├── Dockerfile                  # API Docker 이미지
│       ├── requirements.txt            # Python 의존성
│       ├── pyproject.toml              # Ruff 설정
│       ├── .gitignore                  # Git ignore
│       └── env.example                 # 환경 변수 예시
│
├── packages/
│   └── shared/                         # 공유 타입/스키마
│       ├── src/
│       │   └── index.ts                # 공유 타입 정의
│       ├── package.json                # 패키지 설정
│       └── tsconfig.json               # TypeScript 설정
│
├── docker-compose.yml                  # Docker Compose 설정
├── pnpm-workspace.yaml                 # pnpm 워크스페이스 설정
├── package.json                        # 루트 package.json
├── .gitignore                          # 전역 Git ignore
├── .prettierrc                         # Prettier 설정
├── env.example                         # 환경 변수 예시
├── README.md                           # 프로젝트 문서
└── STRUCTURE.md                        # 이 파일
```

## 주요 파일 설명

### 설정 파일

- **pnpm-workspace.yaml**: pnpm 모노레포 설정
- **docker-compose.yml**: 로컬 개발 환경 Docker 설정
- **.github/workflows/ci.yml**: CI/CD 파이프라인
- **package.json** (루트): 전역 스크립트 및 개발 도구

### 웹 앱 (apps/web)

- **src/app**: Next.js 14+ App Router 기반 페이지
- **src/components**: 재사용 가능한 React 컴포넌트
- **src/lib**: React Query, API 클라이언트 등 유틸리티
- **src/stores**: Zustand 상태 관리
- **src/types**: TypeScript 타입 정의

### API (apps/api)

- **routers**: 각 도메인별 라우터 (upload, classify, aggregate, insight)
- **models**: Pydantic 스키마
- **services**: 비즈니스 로직 (분류, 집계, 인사이트 생성)
- **tests**: pytest 기반 테스트

### 공유 패키지 (packages/shared)

- API와 웹 앱 간 공유되는 TypeScript 타입 정의
- OpenAPI 스키마와 동기화 가능

## 기술 스택 요약

### Frontend
- Next.js 15+ (App Router, TypeScript)
- Tailwind CSS 4
- React Query (TanStack Query v5)
- Zustand
- Recharts
- Vitest + Testing Library

### Backend
- FastAPI (Python 3.11)
- Uvicorn
- Pydantic
- Pandas
- scikit-learn (placeholder)
- pytest
- Ruff

### DevOps
- Docker + Docker Compose
- GitHub Actions
- pnpm (워크스페이스)
- ESLint + Prettier

