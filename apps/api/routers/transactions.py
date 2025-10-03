"""
거래 업로드 라우터
"""

import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, ValidationError
from sqlmodel import Session, select

from db import get_session
from models.transaction import Transaction, TransactionCreate, TransactionRead

router = APIRouter()
logger = logging.getLogger(__name__)


class UploadRequest(BaseModel):
    """업로드 요청"""

    transactions: list[dict]


class RejectionReason(BaseModel):
    """거부 사유"""

    row: int
    reason: str


class UploadResponse(BaseModel):
    """업로드 응답"""

    accepted: int
    rejected: int
    reasons: list[RejectionReason]


@router.post("/transactions/upload", response_model=UploadResponse)
async def upload_transactions(
    request: UploadRequest,
    session: Annotated[Session, Depends(get_session)],
):
    """
    거래 데이터 일괄 업로드

    - 각 거래를 검증하여 유효한 것만 DB에 저장
    - 무효한 거래는 거부 사유와 함께 반환
    """
    accepted = 0
    rejected = 0
    reasons: list[RejectionReason] = []

    for index, txn_data in enumerate(request.transactions):
        row_number = index + 1
        try:
            # Pydantic 검증
            txn_create = TransactionCreate(**txn_data)

            # DB에 저장
            db_transaction = Transaction(**txn_create.model_dump())
            session.add(db_transaction)
            accepted += 1

        except ValidationError as e:
            # 검증 실패
            rejected += 1
            error_messages = "; ".join(
                [f"{err['loc'][0]}: {err['msg']}" for err in e.errors()]
            )
            reasons.append(
                RejectionReason(
                    row=row_number,
                    reason=error_messages,
                )
            )
            logger.warning(
                f"Row {row_number} 검증 실패",
                extra={"row": row_number, "error": error_messages},
            )

        except Exception as e:
            # 기타 에러
            rejected += 1
            reasons.append(
                RejectionReason(
                    row=row_number,
                    reason=f"예상치 못한 에러: {str(e)}",
                )
            )
            logger.error(
                f"Row {row_number} 처리 실패",
                extra={"row": row_number, "error": str(e)},
            )

    # 커밋
    try:
        session.commit()
        logger.info(
            f"업로드 완료: {accepted}건 성공, {rejected}건 실패",
            extra={"accepted": accepted, "rejected": rejected},
        )
    except Exception as e:
        session.rollback()
        logger.error(f"DB 커밋 실패: {e}")
        raise HTTPException(status_code=500, detail="데이터베이스 저장 실패")

    return UploadResponse(
        accepted=accepted,
        rejected=rejected,
        reasons=reasons,
    )


@router.get("/transactions", response_model=list[TransactionRead])
async def get_transactions(
    session: Annotated[Session, Depends(get_session)],
    limit: int = 100,
    offset: int = 0,
):
    """
    거래 목록 조회
    """
    statement = select(Transaction).offset(offset).limit(limit)
    transactions = session.exec(statement).all()
    return transactions


@router.get("/transactions/stats")
async def get_transaction_stats(
    session: Annotated[Session, Depends(get_session)],
):
    """
    거래 통계
    """
    statement = select(Transaction)
    transactions = session.exec(statement).all()

    total_count = len(transactions)
    total_amount = sum(txn.amount_krw for txn in transactions)

    return {
        "total_count": total_count,
        "total_amount": total_amount,
        "avg_amount": total_amount / total_count if total_count > 0 else 0,
    }
