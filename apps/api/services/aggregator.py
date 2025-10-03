"""
거래 집계 서비스
"""

import logging
from datetime import datetime
from typing import Literal
from sqlmodel import Session, select, func
from models.transaction import Transaction

logger = logging.getLogger(__name__)


def aggregate_transactions(
    session: Session,
    user_id: int,
    start_date: str,
    end_date: str,
    range_type: Literal["day", "week", "month"] = "month"
) -> dict:
    """
    거래 집계
    
    Args:
        session: DB 세션
        user_id: 사용자 ID
        start_date: 시작일 (YYYY-MM-DD)
        end_date: 종료일 (YYYY-MM-DD)
        range_type: 집계 범위 (day|week|month)
        
    Returns:
        {
            "total_amount": float,
            "by_category": {카테고리: 금액},
            "top_merchants": [{merchant: 가맹점, amount: 금액}],
            "daily_totals": [{date: 날짜, amount: 금액}]
        }
    """
    # 날짜 범위 내 해당 사용자의 거래 조회
    statement = select(Transaction).where(
        Transaction.user_id == user_id,
        Transaction.date >= start_date,
        Transaction.date <= end_date
    )
    transactions = session.exec(statement).all()
    
    # 총 금액
    total_amount = sum(txn.amount_krw for txn in transactions)
    
    # 카테고리별 금액
    by_category = {}
    for txn in transactions:
        category = txn.category or "미분류"
        by_category[category] = by_category.get(category, 0.0) + txn.amount_krw
    
    # 가맹점별 금액 (상위 3개)
    merchant_totals = {}
    for txn in transactions:
        merchant_totals[txn.merchant] = merchant_totals.get(txn.merchant, 0.0) + txn.amount_krw
    
    top_merchants = sorted(
        [{"merchant": k, "amount": v} for k, v in merchant_totals.items()],
        key=lambda x: x["amount"],
        reverse=True
    )[:3]
    
    # 일별 총액
    daily_totals_dict = {}
    for txn in transactions:
        daily_totals_dict[txn.date] = daily_totals_dict.get(txn.date, 0.0) + txn.amount_krw
    
    daily_totals = sorted(
        [{"date": k, "amount": v} for k, v in daily_totals_dict.items()],
        key=lambda x: x["date"]
    )
    
    logger.info(
        f"집계 완료: {len(transactions)}건, "
        f"총 {total_amount:,.0f}원 ({start_date} ~ {end_date})"
    )
    
    return {
        "total_amount": total_amount,
        "by_category": by_category,
        "top_merchants": top_merchants,
        "daily_totals": daily_totals,
    }
