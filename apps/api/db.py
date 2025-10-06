"""
데이터베이스 설정 및 연결
"""

import logging
import os
from pathlib import Path

from sqlmodel import Session, SQLModel, create_engine

logger = logging.getLogger(__name__)

# 기본값: 로컬 개발용 SQLite
DB_PATH = Path(__file__).parent / "data"
DB_PATH.mkdir(exist_ok=True)
DEFAULT_DATABASE_URL = f"sqlite:///{DB_PATH / 'transactions.db'}"

# 환경 변수로 DATABASE_URL 설정 (프로덕션: PostgreSQL)
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DATABASE_URL)

# SQLite의 경우 check_same_thread=False 필요
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

logger.info(f"🗄️  데이터베이스 연결 중: {DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else 'SQLite (로컬)'}")

engine = create_engine(DATABASE_URL, echo=False, connect_args=connect_args)


def create_db_and_tables():
    """데이터베이스 및 테이블 생성"""
    logger.info(f"데이터베이스 초기화 중: {DATABASE_URL}")
    SQLModel.metadata.create_all(engine)
    logger.info("✅ 데이터베이스 테이블 생성 완료")


def get_session():
    """데이터베이스 세션 생성"""
    with Session(engine) as session:
        yield session
