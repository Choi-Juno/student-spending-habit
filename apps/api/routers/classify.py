"""
거래 분류 라우터
"""

import logging

from fastapi import APIRouter

from models.schemas import ClassifyRequest, ClassifyResponse, TransactionClassified
from services.classifier import classifier

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/classify", response_model=ClassifyResponse)
async def classify_transactions(request: ClassifyRequest):
    """
    거래 내역 분류

    - 각 거래를 카테고리로 자동 분류
    - 신뢰도 점수 반환
    """
    classified_transactions = []

    for txn in request.transactions:
        # 분류 수행 (PII 데이터는 로깅하지 않음)
        category, confidence = classifier.classify(txn.description)

        classified_transactions.append(
            TransactionClassified(
                description=txn.description,
                amount=txn.amount,
                date=txn.date,
                category=category,
                confidence=confidence,
            )
        )

    logger.info(
        f"거래 분류 완료",
        extra={"transaction_count": len(classified_transactions)},
    )

    return ClassifyResponse(classified=classified_transactions)
