"""
카테고리 분류 규칙 정의
"""

# 가맹점 → 카테고리 매핑
MERCHANT_CATEGORY_MAP = {
    # 식비/카페
    "스타벅스": "식비/카페",
    "이디야": "식비/카페",
    "투썸플레이스": "식비/카페",
    "투썸": "식비/카페",
    "빽다방": "식비/카페",
    "메가커피": "식비/카페",
    "카페": "식비/카페",
    "커피": "식비/카페",
    "맥도날드": "식비/외식",
    "버거킹": "식비/외식",
    "KFC": "식비/외식",
    "롯데리아": "식비/외식",
    "서브웨이": "식비/외식",
    
    # 생활/편의점
    "GS25": "생활/편의점",
    "CU": "생활/편의점",
    "세븐일레븐": "생활/편의점",
    "미니스톱": "생활/편의점",
    "이마트24": "생활/편의점",
    
    # 교통
    "T-money Transit": "교통",
    "지하철": "교통",
    "버스": "교통",
    "Kakao T": "교통",
    "택시": "교통",
    "카카오T": "교통",
    
    # 온라인 구매
    "쿠팡": "온라인구매",
    "무신사": "온라인구매",
    "배달의민족": "온라인구매",
    "지마켓": "온라인구매",
    "G마켓": "온라인구매",
    "네이버페이": "온라인구매",
    "11번가": "온라인구매",
    "옥션": "온라인구매",
}

# 키워드 → 카테고리 매핑 (메모 검색용)
KEYWORD_CATEGORY_MAP = {
    # 편의점 상품
    "삼각김밥": "생활/편의점",
    "라면": "생활/편의점",
    "도시락": "생활/편의점",
    "컵라면": "생활/편의점",
    "우유": "생활/편의점",
    "과자": "생활/편의점",
    "음료": "생활/편의점",
    
    # 교통
    "택시": "교통",
    "지하철": "교통",
    "버스": "교통",
    "주차": "교통",
    "주유": "교통",
    
    # 카페
    "아메리카노": "식비/카페",
    "카페라떼": "식비/카페",
    "에스프레소": "식비/카페",
    
    # 외식
    "점심": "식비/외식",
    "저녁": "식비/외식",
    "회식": "식비/외식",
    "치킨": "식비/외식",
    "피자": "식비/외식",
}

# 카테고리별 신뢰도 (규칙 기반)
RULE_CONFIDENCE = {
    "merchant_exact_match": 0.95,  # 가맹점 정확히 매칭
    "merchant_partial_match": 0.85,  # 가맹점 부분 매칭
    "keyword_match": 0.75,  # 키워드 매칭
    "default": 0.5,  # 기타
}


def normalize_merchant(merchant: str) -> str:
    """
    가맹점명 정규화
    
    Args:
        merchant: 원본 가맹점명
        
    Returns:
        정규화된 가맹점명
    """
    normalized = merchant.strip().lower()
    
    # 지점명 제거
    for suffix in ["점", "지점", "매장", "스토어", "store"]:
        if normalized.endswith(suffix):
            normalized = normalized[:-len(suffix)].strip()
    
    return normalized


def get_category_by_merchant(merchant: str) -> tuple[str | None, float]:
    """
    가맹점명으로 카테고리 찾기
    
    Args:
        merchant: 가맹점명
        
    Returns:
        (카테고리, 신뢰도) 튜플
    """
    normalized = normalize_merchant(merchant)
    
    # 1. 정확한 매칭
    for key, category in MERCHANT_CATEGORY_MAP.items():
        if normalize_merchant(key) == normalized:
            return category, RULE_CONFIDENCE["merchant_exact_match"]
    
    # 2. 부분 매칭 (가맹점명에 키워드 포함)
    for key, category in MERCHANT_CATEGORY_MAP.items():
        if normalize_merchant(key) in normalized or normalized in normalize_merchant(key):
            return category, RULE_CONFIDENCE["merchant_partial_match"]
    
    return None, 0.0


def get_category_by_keyword(memo: str) -> tuple[str | None, float]:
    """
    메모 키워드로 카테고리 찾기
    
    Args:
        memo: 메모 내용
        
    Returns:
        (카테고리, 신뢰도) 튜플
    """
    if not memo:
        return None, 0.0
    
    memo_lower = memo.lower().strip()
    
    for keyword, category in KEYWORD_CATEGORY_MAP.items():
        if keyword.lower() in memo_lower:
            return category, RULE_CONFIDENCE["keyword_match"]
    
    return None, 0.0


def classify_transaction(merchant: str, memo: str = "") -> dict:
    """
    거래 분류
    
    Args:
        merchant: 가맹점명
        memo: 메모
        
    Returns:
        {
            "category": str,
            "confidence": float,
            "needs_review": bool,
            "method": str  # "merchant" | "keyword" | "default"
        }
    """
    # 1. 가맹점명으로 시도
    category, confidence = get_category_by_merchant(merchant)
    if category:
        return {
            "category": category,
            "confidence": confidence,
            "needs_review": False,
            "method": "merchant",
        }
    
    # 2. 키워드로 시도
    category, confidence = get_category_by_keyword(memo)
    if category:
        return {
            "category": category,
            "confidence": confidence,
            "needs_review": False,
            "method": "keyword",
        }
    
    # 3. 미분류 (기타)
    return {
        "category": "기타",
        "confidence": RULE_CONFIDENCE["default"],
        "needs_review": True,
        "method": "default",
    }

