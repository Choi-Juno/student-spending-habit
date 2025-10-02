"""
거래 분류 서비스
간단한 규칙 기반 분류 엔진
"""

import logging
import re

logger = logging.getLogger(__name__)

# 카테고리별 키워드 매핑
CATEGORY_KEYWORDS = {
    "식비": [
        "식당",
        "카페",
        "커피",
        "음식",
        "배달",
        "치킨",
        "피자",
        "버거",
        "편의점",
        "마트",
    ],
    "교통비": ["버스", "지하철", "택시", "카카오택시", "티머니", "교통카드"],
    "학용품": ["문구", "책", "교재", "필기", "노트", "펜", "연필", "서점"],
    "생활용품": ["세제", "샴푸", "화장품", "옷", "의류", "신발", "가방"],
    "통신비": ["통신", "인터넷", "휴대폰", "요금"],
    "취미/여가": ["영화", "게임", "스트리밍", "넷플릭스", "유튜브", "헬스", "운동"],
    "의료": ["병원", "약국", "의원", "치료"],
}


class TransactionClassifier:
    """거래 분류기"""

    def __init__(self):
        self.categories = CATEGORY_KEYWORDS

    def classify(self, description: str) -> tuple[str, float]:
        """
        거래 설명을 기반으로 카테고리 분류

        Args:
            description: 거래 설명

        Returns:
            (카테고리, 신뢰도) 튜플
        """
        description_lower = description.lower()

        # 각 카테고리별 매칭 점수 계산
        scores = {}
        for category, keywords in self.categories.items():
            score = sum(1 for keyword in keywords if keyword in description_lower)
            if score > 0:
                scores[category] = score

        # 가장 높은 점수의 카테고리 선택
        if scores:
            best_category = max(scores, key=scores.get)
            # 신뢰도는 매칭된 키워드 수를 기반으로 계산 (최대 1.0)
            confidence = min(scores[best_category] / 3, 1.0)
            logger.info(
                f"분류 완료: '{description}' -> {best_category} (신뢰도: {confidence:.2f})",
                extra={"description_length": len(description)},
            )
            return best_category, confidence

        # 매칭되지 않으면 기타로 분류
        logger.info(
            f"기타로 분류: '{description}'",
            extra={"description_length": len(description)},
        )
        return "기타", 0.3


# 싱글톤 인스턴스
classifier = TransactionClassifier()
