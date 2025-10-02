"""
지출 집계 서비스
"""

import logging
from collections import defaultdict

logger = logging.getLogger(__name__)


class SpendingAggregator:
    """지출 집계기"""

    def aggregate_by_category(
        self, transactions: list[dict]
    ) -> tuple[float, dict[str, float]]:
        """
        카테고리별 지출 집계

        Args:
            transactions: 거래 목록 (각 거래는 category, amount 포함)

        Returns:
            (총 지출, 카테고리별 지출) 튜플
        """
        total = 0.0
        by_category = defaultdict(float)

        for txn in transactions:
            category = txn.get("category", "기타")
            amount = txn.get("amount", 0.0)
            total += amount
            by_category[category] += amount

        logger.info(
            f"집계 완료: 총 {len(transactions)}건, 총액 {total:,.0f}원",
            extra={"transaction_count": len(transactions)},
        )

        return total, dict(by_category)


# 싱글톤 인스턴스
aggregator = SpendingAggregator()
