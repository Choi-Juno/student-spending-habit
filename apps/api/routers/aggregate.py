"""
지출 집계 라우터
"""

import logging

from fastapi import APIRouter

from models.schemas import AggregateResponse, ClassifyRequest
from services.aggregator import aggregator
from services.classifier import classifier

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/aggregate", response_model=AggregateResponse)
async def aggregate_spending(request: ClassifyRequest):
    """
    지출 집계

    - 카테고리별 지출 합계
    - 전체 지출 합계
    """
    # 먼저 거래를 분류
    classified = []
    for txn in request.transactions:
        category, _ = classifier.classify(txn.description)
        classified.append(
            {"category": category, "amount": txn.amount, "date": txn.date}
        )

    # 집계 수행
    total, by_category = aggregator.aggregate_by_category(classified)

    logger.info(
        f"지출 집계 완료",
        extra={"total_spending": total, "category_count": len(by_category)},
    )

    return AggregateResponse(
        period="custom", total_spending=total, by_category=by_category
    )
