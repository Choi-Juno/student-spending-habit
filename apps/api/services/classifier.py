"""
거래 분류 서비스
"""

import logging
from datetime import datetime
from sqlmodel import Session, select
from models.transaction import Transaction
from services.category_rules import classify_transaction

logger = logging.getLogger(__name__)


def classify_with_llm(transaction: Transaction) -> dict:
    """
    LLM을 사용한 분류 (stub)
    
    실제 LLM API 호출 없이 deterministic fallback 반환
    
    Args:
        transaction: 거래 객체
        
    Returns:
        {
            "category": str,
            "confidence": float,
            "rationale": str
        }
    """
    # TODO: 실제 LLM API 연동 (OpenAI, Anthropic 등)
    # 현재는 mock 응답 반환
    
    merchant_lower = transaction.merchant.lower()
    
    # Deterministic fallback logic
    if any(keyword in merchant_lower for keyword in ["학교", "대학", "university"]):
        return {
            "category": "교육",
            "confidence": 0.8,
            "rationale": "LLM: 가맹점명에 교육 관련 키워드 포함"
        }
    elif any(keyword in merchant_lower for keyword in ["병원", "약국", "pharmacy"]):
        return {
            "category": "의료/건강",
            "confidence": 0.8,
            "rationale": "LLM: 가맹점명에 의료 관련 키워드 포함"
        }
    elif any(keyword in merchant_lower for keyword in ["영화", "cgv", "롯데시네마", "메가박스"]):
        return {
            "category": "문화/여가",
            "confidence": 0.85,
            "rationale": "LLM: 영화관 관련 가맹점"
        }
    else:
        return {
            "category": "기타",
            "confidence": 0.6,
            "rationale": "LLM: 명확한 카테고리 판단 불가"
        }


def classify_single_transaction(transaction: Transaction, use_llm: bool = False) -> dict:
    """
    단일 거래 분류
    
    Args:
        transaction: 거래 객체
        use_llm: LLM 사용 여부 (기본값: False)
        
    Returns:
        분류 결과 딕셔너리
    """
    # 1. Rules engine으로 시도
    result = classify_transaction(transaction.merchant, transaction.memo)
    
    # 2. 미분류이고 LLM 사용 설정이면 LLM 시도
    if result["category"] == "기타" and use_llm:
        llm_result = classify_with_llm(transaction)
        if llm_result["confidence"] > result["confidence"]:
            result = {
                "category": llm_result["category"],
                "confidence": llm_result["confidence"],
                "needs_review": llm_result["category"] == "기타",
                "method": "llm",
                "rationale": llm_result.get("rationale", "")
            }
    
    return result


def classify_all_unclassified(session: Session, use_llm: bool = False) -> dict:
    """
    미분류 거래 전체 분류
    
    Args:
        session: DB 세션
        use_llm: LLM 사용 여부
        
    Returns:
        {
            "total_classified": int,
            "by_category": {카테고리: 건수},
            "needs_review_count": int
        }
    """
    # 미분류 거래 조회 (category가 None인 것들)
    statement = select(Transaction).where(Transaction.category.is_(None))
    unclassified = session.exec(statement).all()
    
    total_classified = 0
    by_category = {}
    needs_review_count = 0
    
    for transaction in unclassified:
        result = classify_single_transaction(transaction, use_llm=use_llm)
        
        # 거래 업데이트
        transaction.category = result["category"]
        transaction.confidence = result["confidence"]
        transaction.needs_review = result["needs_review"]
        transaction.updated_at = datetime.utcnow()
        
        session.add(transaction)
        
        # 통계 집계
        total_classified += 1
        by_category[result["category"]] = by_category.get(result["category"], 0) + 1
        if result["needs_review"]:
            needs_review_count += 1
        
        logger.info(
            f"Classified transaction {transaction.id}: "
            f"{transaction.merchant} -> {result['category']} "
            f"(confidence: {result['confidence']:.2f}, method: {result['method']})"
        )
    
    session.commit()
    
    return {
        "total_classified": total_classified,
        "by_category": by_category,
        "needs_review_count": needs_review_count,
    }
