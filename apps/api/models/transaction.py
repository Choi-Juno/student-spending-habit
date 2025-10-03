"""
Transaction 모델 정의 (SQLModel)
"""

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlmodel import Field, SQLModel


class PaymentType(str, Enum):
    """결제 수단"""

    CREDIT_CARD = "credit_card"
    DEBIT_CARD = "debit_card"
    TRANSPORT_CARD = "transport_card"
    MOBILE_PAY = "mobile_pay"
    CASH = "cash"


class Channel(str, Enum):
    """거래 채널"""

    OFFLINE = "offline"
    ONLINE = "online"
    APP = "app"
    KIOSK = "kiosk"


class Transaction(SQLModel, table=True):
    """거래 테이블"""

    __tablename__ = "transactions"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True, description="사용자 ID")
    date: str = Field(..., description="거래 날짜 (YYYY-MM-DD)")
    time: str = Field(..., description="거래 시간 (HH:MM)")
    merchant: str = Field(..., description="가맹점명")
    memo: str = Field(default="", description="메모")
    amount_krw: float = Field(..., gt=0, description="금액 (원)")
    payment_type: str = Field(..., description="결제 수단")
    city: str = Field(..., description="도시명")
    channel: str = Field(..., description="거래 채널")
    category: Optional[str] = Field(default=None, description="분류 카테고리")
    confidence: Optional[float] = Field(default=None, description="분류 신뢰도 (0-1)")
    needs_review: bool = Field(default=False, description="수동 검토 필요 여부")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class TransactionCreate(SQLModel):
    """Transaction 생성용 스키마"""

    date: str
    time: str
    merchant: str
    memo: str = ""
    amount_krw: float
    payment_type: str
    city: str
    channel: str


class TransactionRead(SQLModel):
    """Transaction 조회용 스키마"""

    id: int
    user_id: int
    date: str
    time: str
    merchant: str
    memo: str
    amount_krw: float
    payment_type: str
    city: str
    channel: str
    category: Optional[str] = None
    confidence: Optional[float] = None
    needs_review: bool = False
    created_at: datetime
    updated_at: datetime


class ClassificationResult(SQLModel):
    """분류 결과"""

    total_classified: int
    by_category: dict[str, int]
    needs_review_count: int


class AggregationResult(SQLModel):
    """집계 결과"""

    total_amount: float
    by_category: dict[str, float]
    top_merchants: list[dict[str, float]]
    daily_totals: list[dict[str, float]]
