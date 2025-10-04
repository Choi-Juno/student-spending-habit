"""
인증 서비스
"""

import logging
from datetime import datetime, timedelta
from typing import Optional
from passlib.context import CryptContext
from jose import JWTError, jwt
from sqlmodel import Session, select

from models.user import User

logger = logging.getLogger(__name__)

# 비밀번호 해싱
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT 설정
SECRET_KEY = "your-secret-key-change-in-production"  # 프로덕션에서는 환경변수로!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7일


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """비밀번호 검증"""
    # bcrypt는 최대 72바이트까지만 지원
    password_bytes = plain_password.encode('utf-8')[:72]
    truncated_password = password_bytes.decode('utf-8', errors='ignore')
    return pwd_context.verify(truncated_password, hashed_password)


def get_password_hash(password: str) -> str:
    """비밀번호 해싱"""
    # bcrypt는 최대 72바이트까지만 지원
    password_bytes = password.encode('utf-8')[:72]
    truncated_password = password_bytes.decode('utf-8', errors='ignore')
    return pwd_context.hash(truncated_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """JWT 토큰 생성"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """JWT 토큰 디코딩"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


def authenticate_user(session: Session, username: str, password: str) -> Optional[User]:
    """사용자 인증"""
    statement = select(User).where(User.username == username)
    user = session.exec(statement).first()
    
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    
    return user


def create_user(session: Session, username: str, email: str, password: str, full_name: Optional[str] = None) -> User:
    """사용자 생성"""
    # 중복 체크
    existing_user = session.exec(select(User).where(User.username == username)).first()
    if existing_user:
        raise ValueError("이미 존재하는 사용자명입니다.")
    
    existing_email = session.exec(select(User).where(User.email == email)).first()
    if existing_email:
        raise ValueError("이미 존재하는 이메일입니다.")
    
    # 사용자 생성
    user = User(
        username=username,
        email=email,
        hashed_password=get_password_hash(password),
        full_name=full_name,
    )
    
    session.add(user)
    session.commit()
    session.refresh(user)
    
    logger.info(f"새 사용자 생성: {username}")
    return user


def get_current_user_from_token(token: str, session: Session) -> Optional[User]:
    """토큰에서 현재 사용자 조회"""
    payload = decode_access_token(token)
    if not payload:
        return None
    
    user_id: int = payload.get("sub")
    if not user_id:
        return None
    
    user = session.get(User, user_id)
    return user

