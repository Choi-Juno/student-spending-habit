"""
인사이트 생성 라우터
"""

import logging

from fastapi import APIRouter

from models.schemas import ClassifyRequest, InsightResponse
from services.aggregator import aggregator
from services.classifier import classifier
from services.insight_generator import insight_generator

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/insight", response_model=InsightResponse)
async def generate_insights(request: ClassifyRequest):
    """
    지출 인사이트 생성

    - 지출 패턴 분석
    - 개선 제안
    - 트렌드 분석
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

    # 인사이트 생성
    insights_data = insight_generator.generate_insights(total, by_category)

    logger.info(
        f"인사이트 생성 완료",
        extra={
            "insight_count": len(insights_data["insights"]),
            "recommendation_count": len(insights_data["recommendations"]),
        },
    )

    return InsightResponse(**insights_data)
