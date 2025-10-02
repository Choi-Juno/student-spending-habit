"""
Student Spending Analytics API
FastAPI 백엔드 애플리케이션
"""

import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import aggregate, classify, insight, upload

# 로깅 설정
logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """애플리케이션 시작/종료 시 실행할 작업"""
    logger.info("🚀 API 서버 시작")
    yield
    logger.info("🛑 API 서버 종료")


app = FastAPI(
    title="Student Spending Analytics API",
    description="학생 지출 분석 및 인사이트 제공 API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS 설정
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(upload.router, prefix="/api", tags=["Upload"])
app.include_router(classify.router, prefix="/api", tags=["Classify"])
app.include_router(aggregate.router, prefix="/api", tags=["Aggregate"])
app.include_router(insight.router, prefix="/api", tags=["Insight"])


@app.get("/health")
async def health_check():
    """헬스 체크 엔드포인트"""
    return {"status": "healthy", "service": "student-spending-api"}


@app.get("/")
async def root():
    """루트 엔드포인트"""
    return {
        "message": "Student Spending Analytics API",
        "docs": "/docs",
        "health": "/health",
    }
