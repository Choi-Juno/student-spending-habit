"""
User 모델 정의 (SQLModel)
"""

from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    """사용자 테이블"""

    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True, description="사용자명 (고유)")
    email: str = Field(unique=True, index=True, description="이메일")
    hashed_password: str = Field(description="해시된 비밀번호")
    full_name: Optional[str] = Field(default=None, description="전체 이름")
    is_active: bool = Field(default=True, description="활성화 여부")
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())
    updated_at: datetime = Field(default_factory=lambda: datetime.utcnow())


class UserCreate(SQLModel):
    """사용자 생성용 스키마"""

    username: str
    email: str
    password: str
    full_name: Optional[str] = None


class UserRead(SQLModel):
    """사용자 조회용 스키마"""

    id: int
    username: str
    email: str
    full_name: Optional[str]
    is_active: bool
    created_at: datetime


class UserLogin(SQLModel):
    """로그인 요청 스키마"""

    username: str
    password: str


class Token(SQLModel):
    """토큰 응답 스키마"""

    access_token: str
    token_type: str
    user: UserRead

