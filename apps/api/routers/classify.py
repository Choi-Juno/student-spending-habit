"""
Classification 라우터
"""

import logging
from typing import Annotated
from fastapi import APIRouter, Depends, Query
from sqlmodel import Session

from db import get_session
from models.transaction import ClassificationResult
from models.user import User
from routers.auth import get_current_user_dependency
from services.classifier import classify_all_unclassified

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/classify", response_model=ClassificationResult)
async def classify_transactions(
    use_llm: bool = Query(default=False, description="LLM 백업 사용 여부"),
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user_dependency)],
):
    """
    미분류 거래 자동 분류
    
    - Rules engine을 사용하여 가맹점/키워드 기반 분류
    - use_llm=true 설정 시 LLM 백업 사용 (현재는 stub)
    - 분류 후 카테고리별 건수와 검토 필요 건수 반환
    - 현재 로그인한 사용자의 거래만 분류
    """
    logger.info(f"분류 시작 (use_llm={use_llm}, user_id={current_user.id})")
    
    result = classify_all_unclassified(session, user_id=current_user.id, use_llm=use_llm)
    
    logger.info(
        f"분류 완료: {result['total_classified']}건 처리, "
        f"{result['needs_review_count']}건 검토 필요"
    )
    
    return ClassificationResult(
        total_classified=result["total_classified"],
        by_category=result["by_category"],
        needs_review_count=result["needs_review_count"],
    )
