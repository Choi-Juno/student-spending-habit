"""
인증 라우터
"""

import logging
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlmodel import Session

from db import get_session
from models.user import UserCreate, UserRead, UserLogin, Token
from services.auth import (
    authenticate_user,
    create_user,
    create_access_token,
    get_current_user_from_token,
)

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/signup", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate, session: Session = Depends(get_session)):
    """
    회원가입
    
    - username, email, password 필수
    - full_name 선택
    """
    try:
        user = create_user(
            session,
            username=user_data.username,
            email=user_data.email,
            password=user_data.password,
            full_name=user_data.full_name,
        )
        logger.info(f"새 사용자 가입: {user.username}")
        return user
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, session: Session = Depends(get_session)):
    """
    로그인
    
    - username, password 필요
    - 성공 시 JWT 토큰 반환
    """
    user = authenticate_user(session, credentials.username, credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="사용자명 또는 비밀번호가 잘못되었습니다.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.id})
    logger.info(f"사용자 로그인: {user.username}")
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserRead(
            id=user.id,
            username=user.username,
            email=user.email,
            full_name=user.full_name,
            is_active=user.is_active,
            created_at=user.created_at,
        ),
    )


@router.get("/me", response_model=UserRead)
async def get_current_user(
    authorization: str = Header(..., description="Bearer token"),
    session: Session = Depends(get_session),
):
    """
    현재 로그인한 사용자 정보 조회
    
    - Authorization 헤더에 Bearer token 필요
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않은 인증 토큰입니다.",
        )
    
    token = authorization.replace("Bearer ", "")
    user = get_current_user_from_token(token, session)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="인증 토큰이 만료되었거나 유효하지 않습니다.",
        )
    
    return user


async def get_current_user_dependency(
    authorization: str = Header(..., description="Bearer token"),
    session: Session = Depends(get_session),
):
    """
    의존성 주입용: 현재 사용자 조회
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않은 인증 토큰입니다.",
        )
    
    token = authorization.replace("Bearer ", "")
    user = get_current_user_from_token(token, session)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="인증 토큰이 만료되었거나 유효하지 않습니다.",
        )
    
    return user

