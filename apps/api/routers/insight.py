"""
인사이트 생성 라우터 (Placeholder)
TODO: 추후 구현 예정
"""

import logging
from fastapi import APIRouter

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/insight")
async def get_insights():
    """
    지출 인사이트 조회 (추후 구현 예정)
    
    - 지출 패턴 분석
    - 개선 제안
    - 트렌드 분석
    """
    logger.info("인사이트 조회 요청 (미구현)")
    
    return {
        "status": "not_implemented",
        "message": "인사이트 기능은 추후 구현 예정입니다.",
        "insights": [],
        "recommendations": []
    }
