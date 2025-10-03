"""
Classification 라우터
"""

import logging
from fastapi import APIRouter, Depends, Query
from sqlmodel import Session

from db import engine
from models.transaction import ClassificationResult
from services.classifier import classify_all_unclassified

logger = logging.getLogger(__name__)
router = APIRouter()


def get_session():
    with Session(engine) as session:
        yield session


@router.post("/classify", response_model=ClassificationResult)
async def classify_transactions(
    use_llm: bool = Query(default=False, description="LLM 백업 사용 여부"),
    session: Session = Depends(get_session)
):
    """
    미분류 거래 자동 분류
    
    - Rules engine을 사용하여 가맹점/키워드 기반 분류
    - use_llm=true 설정 시 LLM 백업 사용 (현재는 stub)
    - 분류 후 카테고리별 건수와 검토 필요 건수 반환
    """
    logger.info(f"분류 시작 (use_llm={use_llm})")
    
    result = classify_all_unclassified(session, use_llm=use_llm)
    
    logger.info(
        f"분류 완료: {result['total_classified']}건 처리, "
        f"{result['needs_review_count']}건 검토 필요"
    )
    
    return ClassificationResult(
        total_classified=result["total_classified"],
        by_category=result["by_category"],
        needs_review_count=result["needs_review_count"],
    )
