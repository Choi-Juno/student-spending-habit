"""
파일 업로드 라우터
"""

import logging

from fastapi import APIRouter, File, HTTPException, UploadFile

from models.schemas import UploadResponse

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/upload", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)):
    """
    CSV 또는 Excel 파일 업로드

    - PII 데이터는 로깅하지 않음
    - 파일 크기 및 형식 검증
    """
    # 파일 형식 검증
    allowed_extensions = [".csv", ".xlsx", ".xls"]
    if not any(file.filename.endswith(ext) for ext in allowed_extensions):
        logger.warning(
            f"지원하지 않는 파일 형식 업로드 시도",
            extra={"filename_length": len(file.filename)},
        )
        raise HTTPException(status_code=400, detail="지원하지 않는 파일 형식입니다")

    # 파일 크기 검증 (예: 10MB)
    MAX_FILE_SIZE = 10 * 1024 * 1024
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        logger.warning(f"파일 크기 초과", extra={"file_size": len(content)})
        raise HTTPException(
            status_code=400, detail="파일 크기가 너무 큽니다 (최대 10MB)"
        )

    # 실제로는 여기서 파일을 파싱하고 DB에 저장
    # 현재는 모의 응답 반환
    processed_count = 15  # 예시

    logger.info(
        f"파일 업로드 성공",
        extra={"file_size": len(content), "processed_count": processed_count},
    )

    return UploadResponse(
        message="파일이 성공적으로 업로드되었습니다", processed_count=processed_count
    )
