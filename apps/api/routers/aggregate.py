"""
Aggregation 라우터
"""

import logging
from typing import Literal
from fastapi import APIRouter, Depends, Query
from sqlmodel import Session

from db import engine
from models.transaction import AggregationResult
from services.aggregator import aggregate_transactions

logger = logging.getLogger(__name__)
router = APIRouter()


def get_session():
    with Session(engine) as session:
        yield session


@router.get("/aggregate", response_model=AggregationResult)
async def get_aggregation(
    start: str = Query(
        ..., description="시작일 (YYYY-MM-DD)", regex=r"^\d{4}-\d{2}-\d{2}$"
    ),
    end: str = Query(
        ..., description="종료일 (YYYY-MM-DD)", regex=r"^\d{4}-\d{2}-\d{2}$"
    ),
    range: Literal["day", "week", "month"] = Query(
        default="month", description="집계 범위"
    ),
    session: Session = Depends(get_session),
):
    """
    거래 집계 조회

    - 날짜 범위 내 거래 통계 제공
    - 카테고리별 금액, 상위 가맹점, 일별 총액 반환
    """
    logger.info(f"집계 조회: {start} ~ {end} (range={range})")

    result = aggregate_transactions(
        session, start_date=start, end_date=end, range_type=range
    )

    return AggregationResult(
        total_amount=result["total_amount"],
        by_category=result["by_category"],
        top_merchants=result["top_merchants"],
        daily_totals=result["daily_totals"],
    )
