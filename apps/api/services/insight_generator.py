"""
인사이트 생성 서비스
간단한 규칙 기반 인사이트 생성
"""

import logging

logger = logging.getLogger(__name__)


class InsightGenerator:
    """인사이트 생성기"""

    def generate_insights(
        self, total_spending: float, by_category: dict[str, float]
    ) -> dict:
        """
        지출 데이터를 기반으로 인사이트 생성

        Args:
            total_spending: 총 지출
            by_category: 카테고리별 지출

        Returns:
            인사이트 딕셔너리
        """
        insights = []
        recommendations = []

        # 가장 많이 쓴 카테고리 찾기
        if by_category:
            top_category = max(by_category, key=by_category.get)
            top_amount = by_category[top_category]
            percentage = (
                (top_amount / total_spending * 100) if total_spending > 0 else 0
            )

            insights.append(
                f"가장 많이 지출한 카테고리는 '{top_category}'입니다 ({percentage:.1f}%)"
            )

            # 식비 관련 추천
            if top_category == "식비" and percentage > 40:
                recommendations.append(
                    "식비 지출이 높습니다. 집에서 식사하는 빈도를 늘려보세요."
                )

            # 취미/여가 관련 추천
            if "취미/여가" in by_category:
                leisure_pct = (
                    (by_category["취미/여가"] / total_spending * 100)
                    if total_spending > 0
                    else 0
                )
                if leisure_pct > 30:
                    recommendations.append(
                        "여가 지출이 높습니다. 무료 활동을 찾아보시는 것은 어떨까요?"
                    )

        # 총 지출 분석
        avg_daily = total_spending / 30  # 월 기준 가정
        insights.append(f"평균 일일 지출은 약 {avg_daily:,.0f}원입니다")

        if avg_daily > 50000:
            recommendations.append("일일 평균 지출이 높습니다. 예산을 설정해보세요.")

        # 트렌드 (간단한 규칙)
        trend = "stable"
        if total_spending > 1500000:
            trend = "increasing"
            insights.append("지출이 증가 추세입니다")
        elif total_spending < 500000:
            trend = "decreasing"
            insights.append("지출이 감소 추세입니다")

        logger.info(
            f"인사이트 생성 완료: {len(insights)}개 인사이트, {len(recommendations)}개 추천",
            extra={"total_spending": total_spending},
        )

        return {
            "insights": insights,
            "recommendations": recommendations,
            "spending_trend": trend,
        }


# 싱글톤 인스턴스
insight_generator = InsightGenerator()
