"""
분류기 테스트
"""

import pytest

from services.classifier import TransactionClassifier


@pytest.fixture
def classifier():
    return TransactionClassifier()


def test_classify_food(classifier):
    """식비 카테고리 분류 테스트"""
    category, confidence = classifier.classify("스타벅스 커피")
    assert category == "식비"
    assert confidence > 0


def test_classify_transport(classifier):
    """교통비 카테고리 분류 테스트"""
    category, confidence = classifier.classify("지하철 요금")
    assert category == "교통비"
    assert confidence > 0


def test_classify_unknown(classifier):
    """알 수 없는 항목은 기타로 분류"""
    category, confidence = classifier.classify("알 수 없는 항목")
    assert category == "기타"
    assert confidence == 0.3
