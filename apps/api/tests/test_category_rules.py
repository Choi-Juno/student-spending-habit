"""
카테고리 규칙 테스트
"""

import pytest
from services.category_rules import (
    classify_transaction,
    get_category_by_merchant,
    get_category_by_keyword,
    normalize_merchant,
)


class TestNormalizeMerchant:
    """가맹점명 정규화 테스트"""
    
    def test_remove_branch_suffix(self):
        assert normalize_merchant("스타벅스 강남점") == "스타벅스 강남"
        assert normalize_merchant("GS25 역삼지점") == "gs25 역삼"
        assert normalize_merchant("이디야 매장") == "이디야"
    
    def test_lowercase_conversion(self):
        assert normalize_merchant("STARBUCKS") == "starbucks"
        assert normalize_merchant("CU편의점") == "cu편의점"


class TestGetCategoryByMerchant:
    """가맹점 기반 분류 테스트"""
    
    def test_exact_match_cafe(self):
        category, confidence = get_category_by_merchant("스타벅스")
        assert category == "식비/카페"
        assert confidence == 0.95
    
    def test_exact_match_convenience(self):
        category, confidence = get_category_by_merchant("GS25")
        assert category == "생활/편의점"
        assert confidence == 0.95
    
    def test_exact_match_transport(self):
        category, confidence = get_category_by_merchant("T-money Transit")
        assert category == "교통"
        assert confidence == 0.95
    
    def test_partial_match_with_branch(self):
        category, confidence = get_category_by_merchant("스타벅스 강남점")
        assert category == "식비/카페"
        assert confidence == 0.85
    
    def test_partial_match_online(self):
        category, confidence = get_category_by_merchant("쿠팡")
        assert category == "온라인구매"
        assert confidence >= 0.85
    
    def test_no_match(self):
        category, confidence = get_category_by_merchant("알 수 없는 가맹점")
        assert category is None
        assert confidence == 0.0


class TestGetCategoryByKeyword:
    """키워드 기반 분류 테스트"""
    
    def test_keyword_match_ramen(self):
        category, confidence = get_category_by_keyword("라면 샀음")
        assert category == "생활/편의점"
        assert confidence == 0.75
    
    def test_keyword_match_taxi(self):
        category, confidence = get_category_by_keyword("택시 탔음")
        assert category == "교통"
        assert confidence == 0.75
    
    def test_keyword_match_coffee(self):
        category, confidence = get_category_by_keyword("아메리카노")
        assert category == "식비/카페"
        assert confidence == 0.75
    
    def test_no_keyword_match(self):
        category, confidence = get_category_by_keyword("특별한 메모 없음")
        assert category is None
        assert confidence == 0.0
    
    def test_empty_memo(self):
        category, confidence = get_category_by_keyword("")
        assert category is None
        assert confidence == 0.0


class TestClassifyTransaction:
    """전체 거래 분류 테스트"""
    
    def test_known_merchant_starbucks(self):
        result = classify_transaction("스타벅스", "")
        assert result["category"] == "식비/카페"
        assert result["confidence"] >= 0.85
        assert result["needs_review"] is False
        assert result["method"] == "merchant"
    
    def test_known_merchant_gs25(self):
        result = classify_transaction("GS25", "")
        assert result["category"] == "생활/편의점"
        assert result["confidence"] >= 0.85
        assert result["needs_review"] is False
    
    def test_known_merchant_kakao_t(self):
        result = classify_transaction("Kakao T", "")
        assert result["category"] == "교통"
        assert result["confidence"] >= 0.85
        assert result["needs_review"] is False
    
    def test_unknown_merchant_with_keyword(self):
        result = classify_transaction("알 수 없는 가게", "삼각김밥 샀음")
        assert result["category"] == "생활/편의점"
        assert result["confidence"] == 0.75
        assert result["needs_review"] is False
        assert result["method"] == "keyword"
    
    def test_unresolved_transaction(self):
        result = classify_transaction("알 수 없는 가맹점", "특별한 메모 없음")
        assert result["category"] == "기타"
        assert result["confidence"] == 0.5
        assert result["needs_review"] is True
        assert result["method"] == "default"
    
    def test_merchant_priority_over_keyword(self):
        # 가맹점 매칭이 키워드보다 우선
        result = classify_transaction("스타벅스", "택시")
        assert result["category"] == "식비/카페"
        assert result["method"] == "merchant"


class TestCoverageRequirement:
    """≥90% 커버리지 요구사항 테스트"""
    
    def test_sample_transactions_coverage(self):
        """샘플 거래 목록의 90% 이상이 분류되어야 함"""
        sample_transactions = [
            ("스타벅스", ""),
            ("이디야", ""),
            ("투썸플레이스", ""),
            ("빽다방", ""),
            ("GS25", ""),
            ("CU", ""),
            ("세븐일레븐", ""),
            ("T-money Transit", ""),
            ("지하철", ""),
            ("버스", ""),
            ("Kakao T", ""),
            ("쿠팡", ""),
            ("무신사", ""),
            ("배달의민족", ""),
            ("알 수 없는 가게", "삼각김밥"),
            ("모르는 곳", "택시"),
            ("카페", ""),
            ("편의점", "도시락"),
            ("맥도날드", ""),
            ("버거킹", ""),
        ]
        
        classified_count = 0
        for merchant, memo in sample_transactions:
            result = classify_transaction(merchant, memo)
            if result["category"] != "기타":
                classified_count += 1
        
        coverage = classified_count / len(sample_transactions)
        assert coverage >= 0.9, f"Coverage {coverage:.1%} is below 90%"

