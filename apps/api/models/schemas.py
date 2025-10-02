"""
Pydantic 스키마 정의
"""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class TransactionBase(BaseModel):
    """거래 기본 모델"""

    description: str = Field(..., description="거래 설명")
    amount: float = Field(..., gt=0, description="금액")
    date: str = Field(..., description="날짜 (YYYY-MM-DD)")


class TransactionCreate(TransactionBase):
    """거래 생성 요청"""

    pass


class TransactionClassified(TransactionBase):
    """분류된 거래"""

    category: str = Field(..., description="카테고리")
    confidence: float = Field(..., ge=0, le=1, description="분류 신뢰도")


class UploadResponse(BaseModel):
    """업로드 응답"""

    message: str
    processed_count: int


class ClassifyRequest(BaseModel):
    """분류 요청"""

    transactions: list[TransactionBase]


class ClassifyResponse(BaseModel):
    """분류 응답"""

    classified: list[TransactionClassified]


class AggregateResponse(BaseModel):
    """집계 응답"""

    period: str
    total_spending: float
    by_category: dict[str, float]


class InsightResponse(BaseModel):
    """인사이트 응답"""

    insights: list[str]
    recommendations: list[str]
    spending_trend: Literal["increasing", "decreasing", "stable"]


class HealthResponse(BaseModel):
    """헬스 체크 응답"""

    status: str
    service: str
